const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});

app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info of ${persons.length} people</p><p>${Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const person = persons.find((p) => p.id === Number(request.params.id));
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  persons = persons.filter((p) => p.id !== Number(request.params.id));
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.number || !body.name) {
    return response.status(400).json({ error: "Name or Number missing" });
  }

  if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({ error: "This name already exists" });
  }

  const person = {
    id: Math.floor(Math.random() * 1000000000000000),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
