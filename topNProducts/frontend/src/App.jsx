import { useState, useEffect } from 'react'
import Card from './Card' // Import the Card component

function App() {
  const [company, setCompany] = useState('')
  const [category, setCategory] = useState('')
  const [top, setTop] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [token, setToken] = useState('')
  const [products, setProducts] = useState([]) // State for storing products

  const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO']
  const categories = [
    'Phone',
    'Computer',
    'TV',
    'Earphone',
    'Tablet',
    'Charger',
    'Mouse',
    'Keypad',
    'Bluetooth',
    'Pendrive',
    'Remote',
    'Speaker',
    'Headset',
    'Laptop',
    'PC',
  ]

  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch('http://20.244.56.144/test/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: 'KLUniversity',
          clientID: 'aa0da0a9-e93a-4612-a6d7-78785f4b77b8',
          clientSecret: 'BwzGzMrcOgjYoCvz',
          ownerName: 'SaiKumar',
          ownerEmail: '2100032358cseh@gmail.com',
          rollNo: '2100032358',
        }),
      })

      const data = await response.json()
      setToken(data.access_token)
    }

    fetchToken()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!token) {
      console.error('Token is not available')
      return
    }

    const trimmedCompany = company.trim()
    const trimmedCategory = category.trim()

    console.log('Submitting request with company:', trimmedCompany)

    const url = `http://20.244.56.144/test/companies/${trimmedCompany}/categories/${trimmedCategory}/products?top=${top}&minPrice=${minPrice}&maxPrice=${maxPrice}`

    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || 'Network response was not ok')
          })
        }
        return response.json()
      })
      .then((data) => {
        console.log(data)
        setProducts(data) // Store the fetched products in state
      })
      .catch((error) => {
        console.error('Error fetching data:', error.message)
      })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg mb-6"
      >
        <h2 className="text-2xl font-bold mb-4">Get Top Products</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Company</label>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg"
            required
          >
            <option value="">Select Company</option>
            {companies.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Top N Products</label>
          <input
            type="number"
            value={top}
            onChange={(e) => setTop(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Min Price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Max Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Get Products
        </button>
      </form>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default App
