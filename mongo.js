const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Usage: node mongo.js <password>");
  process.exit(1);
}

const [, , password, name = null, number = null] = process.argv;

const uri = `mongodb+srv://light:${password}@phonebook-cluster.uyykqn3.mongodb.net/phonebookdb?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(uri);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

if (name && number) {
  const person = new Person({
    name,
    number,
  });
  person.save().then((result) => {
    console.log(
      `Added '${result.name} - ${result.number}' to the 'people' Collection`
    );
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    result.forEach((p) => {
      console.log(p.name, "-", p.number);
      mongoose.connection.close();
    });
  });
}
