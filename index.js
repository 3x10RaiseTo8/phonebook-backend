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

// Get all the people in phonebook
app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => response.json(people));
});

// Get total number of people in phonebook
app.get("/info", (request, response) => {
  const count = Person.estimatedDocumentCount({}).then((result) =>
    response.send(
      `<p>Phonebook has info of ${result} people</p><p>${Date()}</p>`
    )
  );
});

// Get a single person
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// Delete a person from the phonebook by id
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

// Post a new person to the phonebook
app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.number || !body.name) {
    return response.status(400).json({ error: "Name or Number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => next(error));
});

// Puts new phone number to existing person name
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error));
});

// Handles requests to unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown Endpoint" });
};

app.use(unknownEndpoint);

// Handles request which results in error
const errorHandler = (error, request, response, next) => {
  console.log(error);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted ID" });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
