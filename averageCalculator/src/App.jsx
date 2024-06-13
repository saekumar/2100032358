import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [numbers, setNumbers] = useState([])
  const [windowPrevState, setWindowPrevState] = useState([])
  const [windowCurrState, setWindowCurrState] = useState([])
  const [average, setAverage] = useState(0)
  const [error, setError] = useState('')

  const fetchNumbers = async (qualifier) => {
    try {
      const response = await axios.get(
        `http://localhost:9876/numbers/${qualifier}`
      )
      console.log(response)
      const data = response.data
      console.log(data)
      setNumbers(data.numbers)
      setWindowPrevState(data.windowPrevState)
      setWindowCurrState(data.windowCurrState)
      setAverage(data.avg)
      setError('') // Clear any previous error
    } catch (err) {
      setError('Error fetching numbers')
      console.error(err)
    }
  }

  return (
    <div className="App flex flex-col items-center justify-center gap-8 p-5 font-sans">
      <h1 className="text-2xl font-bold">Average Calculator</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="numbers-section flex flex-col items-center gap-2 w-full max-w-md">
        <h2 className="text-xl">New Numbers:</h2>
        <p>{numbers.join(', ')}</p>
      </div>
      <div className="numbers-section flex flex-col items-center gap-2 w-full max-w-md">
        <h2 className="text-xl">Window Previous State:</h2>
        <p>{windowPrevState.join(', ')}</p>
      </div>
      <div className="numbers-section flex flex-col items-center gap-2 w-full max-w-md">
        <h2 className="text-xl">Window Current State:</h2>
        <p>{windowCurrState.join(', ')}</p>
      </div>
      <div className="numbers-section flex flex-col items-center gap-2 w-full max-w-md">
        <h2 className="text-xl">Average:</h2>
        <p>{average}</p>
      </div>
      <div className="buttons-section flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => fetchNumbers('p')}
        >
          Fetch Prime Numbers
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => fetchNumbers('f')}
        >
          Fetch Fibonacci Numbers
        </button>
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          onClick={() => fetchNumbers('e')}
        >
          Fetch Even Numbers
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => fetchNumbers('r')}
        >
          Fetch Random Numbers
        </button>
      </div>
    </div>
  )
}

export default App
