require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => response.json(people));
});

app.get("/info", (request, response) => {
  const count = Person.estimatedDocumentCount({}).then((result) =>
    response.send(
      `<p>Phonebook has info of ${result} people</p><p>${Date()}</p>`
    )
  );
});

app.get("/api/persons/:id", (request, response) => {
  const person = persons.find((p) => p.id === Number(request.params.id));
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
  Person.findById(request.params.id).then((people) => response.json(people));
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(response.status(204).end());
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.number || !body.name) {
    return response.status(400).json({ error: "Name or Number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => response.json(savedPerson));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
