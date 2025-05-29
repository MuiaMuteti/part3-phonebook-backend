require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require('./models/phonebook')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token("body", (request) => {
  return request.method === "POST"? JSON.stringify(request.body) : " "
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

let persons = []

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
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

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))  
})

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

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })  
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})