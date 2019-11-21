const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('reqBody', (req) => {
    return JSON.stringify(req.body)
  })

app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))

let persons = [
        {
          "name": "Arto Hellas",
          "number": "040-123456",
          "id": 1
        },
        {
          "name": "Ada Lovelace",
          "number": "39-44-5323523",
          "id": 2
        },
        {
          "name": "Dan Abramov",
          "number": "12-43-234345",
          "id": 3
        }
      ]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    res.send('Phonebook has info for ' + persons.length + ' people<p>' + Date().toString());
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }

  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

app.post('/api/persons', (request, response) => {

    if(!request.body.name || !request.body.number)
    {
        return response.status(400).json({ error: 'invalid request' })
    }

    if(persons.filter(person => person.name === request.body.name).length != 0)
    {
        return response.status(400).json({ error: 'name must be unique' })
    }

    const newPerson =
    {
        name: request.body.name,
        number: request.body.number,
        id: getRandomInt(123123123)
    }
    persons = persons.concat(newPerson)

    response.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})