const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', function getBody (req) {
    return JSON.stringify(req.body);
})

let phonebook = [
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

    app.get('/api/persons', (request, response) => {
        response.json(phonebook);
    });

    app.get('/info', (request, response) => {
        const now = new Date();

        response.send(`
            <div>
                Phonebook has info for ${phonebook.length}
            </div>
            <div>
                ${now}
            </div>`)
     });

    app.get('/api/persons/:id', (request, response) => {
        const id = request.params.id
        const person = phonebook.find(note => note.id === id)
        response.json(person)
    });

    app.delete('/api/persons/:id', (request, response) => {
        const id = request.params.id
        phonebook = phonebook.filter(note => note.id !== id)
        response.status(204).end()
    });

    app.post('/api/persons/', (request, response) => {
        const body = request.body;
        const person = {
            "id": String(Math.random()),
            name: body.name,
            number: body.number
        }

        if(!person.name){
            response.status(400).send("Name for person is missing")
        } else if (!person.number){
            response.status(400).send("Number for person is missing")
        }

        const personFound = phonebook.find(foundPerson => foundPerson.name === person.name)
        if(personFound){
            response.status(400).send("Name must be unique")
        }
        phonebook = phonebook.concat(person)
        response.json(request.body)
    });

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)