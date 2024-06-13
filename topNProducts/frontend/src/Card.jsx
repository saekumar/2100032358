import React from 'react'

function Card({ product }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-bold mb-2">{product.productName}</h3>
      <p className="text-gray-700 mb-1">Price: ${product.price}</p>
      <p className="text-gray-700 mb-1">Availability: {product.availability}</p>
      <p className="text-gray-700 mb-1">Discount: {product.discount}</p>
      <p className="text-gray-700 mb-1">Rating: {product.rating}</p>
      {/* Add other product details as needed */}
    </div>
  )
}

export default Card
