const express = require('express')
const axios = require('axios')

const app = express()
const PORT = 9876
const WINDOW_SIZE = 10
let numbersWindow = [1, 3, 5, 7]

const QUALIFIERS = {
  p: 'primes',
  f: 'fibo',
  e: 'even',
  r: 'random',
}

// Example authentication token, replace with actual if needed
const API_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4MjY2NTk2LCJpYXQiOjE3MTgyNjYyOTYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImFhMGRhMGE5LWU5M2EtNDYxMi1hNmQ3LTc4Nzg1ZjRiNzdiOCIsInN1YiI6IjIxMDAwMzIzNThjc2VoQGdtYWlsLmNvbSJ9LCJjb21wYW55TmFtZSI6IktMVW5pdmVyc2l0eSIsImNsaWVudElEIjoiYWEwZGEwYTktZTkzYS00NjEyLWE2ZDctNzg3ODVmNGI3N2I4IiwiY2xpZW50U2VjcmV0IjoiQnd6R3pNcmNPZ2pZb0N2eiIsIm93bmVyTmFtZSI6IlNhaUt1bWFyIiwib3duZXJFbWFpbCI6IjIxMDAwMzIzNThjc2VoQGdtYWlsLmNvbSIsInJvbGxObyI6IjIxMDAwMzIzNTgifQ.hxn6jfHsiRaW7-zAXA3uKRREiHU94d77wVmWkzTfN68'

async function fetchNumbers(qualifier) {
  try {
    console.log(QUALIFIERS[qualifier])
    const response = await axios.get(
      `http://20.244.56.144/test/${QUALIFIERS[qualifier]}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`, // Include token if required
        },
        timeout: 50000,
      }
    )
    console.log(response.data.numbers)
    return response.data.numbers
  } catch (error) {
    console.error('Error fetching numbers:', error.message)
    return []
  }
}

function updateWindow(newNumbers) {
  const uniqueNewNumbers = newNumbers.filter(
    (num) => !numbersWindow.includes(num)
  )
  numbersWindow = [...numbersWindow, ...uniqueNewNumbers]
  if (numbersWindow.length > WINDOW_SIZE) {
    numbersWindow = numbersWindow.slice(-WINDOW_SIZE)
  }
}

function calculateAverage(numbers) {
  if (numbers.length === 0) {
    return 0.0
  }
  const sum = numbers.reduce((acc, num) => acc + num, 0)
  return sum / numbers.length
}

app.get('/numbers/:numberid', async (req, res) => {
  const numberId = req.params.numberid

  if (!QUALIFIERS[numberId]) {
    return res.status(400).json({ detail: 'Invalid number ID qualifier' })
  }

  const newNumbers = await fetchNumbers(numberId)
  const windowPrevState = [...numbersWindow]
  updateWindow(newNumbers)
  const windowCurrState = [...numbersWindow]
  const avg = calculateAverage(windowCurrState)

  console.log(avg)

  res.json({
    numbers: newNumbers,
    windowPrevState: windowPrevState,
    windowCurrState: windowCurrState,
    avg: avg,
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
