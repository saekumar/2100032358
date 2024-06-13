const express = require('express')
const axios = require('axios')
const app = express()
const PORT = 3000

// Utility function to generate a custom unique id for each product
const generateUniqueId = (productName, price, rating) => {
  return `${productName}-${price}-${rating}-${Date.now()}`
}

// In-memory cache for storing product details to minimize API calls
const productCache = {}

// Get top n products within a category and price range
app.get('/categories/:categoryname/products', async (req, res) => {
  const { categoryname } = req.params
  const {
    top = 10,
    minPrice = 0,
    maxPrice = Infinity,
    page = 1,
    sort = 'rating',
    order = 'desc',
  } = req.query
  const n = parseInt(top)
  const start = (page - 1) * n
  const end = page * n
  const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO']

  try {
    const productPromises = companies.map((company) =>
      axios.get(
        `http://20.244.56.144/products/companies/${company}/categories/${categoryname}/products`,
        {
          params: { top: n, minPrice, maxPrice },
        }
      )
    )

    const responses = await Promise.all(productPromises)
    let products = responses.flatMap((response) => response.data)

    // Add unique IDs to products and cache them
    products = products.map((product) => {
      const uniqueId = generateUniqueId(
        product.productName,
        product.price,
        product.rating
      )
      productCache[uniqueId] = product
      return { ...product, id: uniqueId }
    })

    // Sort products based on query parameters
    products.sort((a, b) => {
      if (order === 'asc') {
        return a[sort] - b[sort]
      } else {
        return b[sort] - a[sort]
      }
    })

    const paginatedProducts = products.slice(start, end)
    res.json(paginatedProducts)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' })
  }
})

// Get product details by ID
app.get('/categories/:categoryname/products/:productid', (req, res) => {
  const { productid } = req.params

  const product = productCache[productid]
  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ error: 'Product not found' })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
