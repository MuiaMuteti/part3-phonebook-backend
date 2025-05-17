const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

morgan.token("body", (request) => {
  return request.method === "POST"? JSON.stringify(request.body) : " "
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/info", (request, response) => {
    const body = `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`

    response.send(body)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = persons.find(pers => pers.id === id)

    if (person) {
        return response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id
  persons = persons.filter(pers => pers.id !== id)
  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * Date.now())
}

const nameExists = (name) => {
  return persons.find(pers => pers.name === name)
}

app.post("/api/persons", (request, response) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({
      error: "name missing"
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number missing"
    })
  }
  if (nameExists(body.name)) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})