const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const uri = process.env.MONGODB_URI;

console.log("Connecting to the url:", uri);

mongoose
  .connect(uri)
  .then((result) => console.log("Connected to the database", uri.slice(0, 7)))
  .catch((error) => console.log("Connection failed", error));

const phoneNumberValidation = [
  {
    validator: (num) =>
      /^[0-9]{2}-[0-9]{6,}$/.test(num) || /^[0-9]{3}-[0-9]{5,}$/.test(num),
    message:
      "Invalid number format: eg, 09-1234556 and 040-22334455 are valid phone numbers",
  },
];

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: phoneNumberValidation,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
