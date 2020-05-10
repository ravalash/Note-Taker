// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express App
// =============================================================
const app = express();
app.use(express.static("public"));
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
// =============================================================

// Basic route that sends the user to the index page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Route that redirects to the notes page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Route that returns db.json object when callled
app.get("/api/notes", function (req, res) {
  return res.json(JSON.parse(fs.readFileSync("./db/db.json", "utf8")));
});

// Route to create a new note - takes in JSON input, adds to db.json, returns note to client.
app.post("/api/notes", function (req, res) {
  const existingNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  existingNotes.push(req.body);
  existingNotes.forEach((element, index) => {
    element.id = index;
  });
  fs.writeFileSync("./db/db.json", JSON.stringify(existingNotes));
  res.json(existingNotes);
});

// Deletes a note by ID passed
app.delete("/api/notes/:id", function(req, res) {
  const existingNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  const updatedNotes = existingNotes.filter(function(note){
    return note.id != req.params.id;
  })
  fs.writeFileSync("./db/db.json", JSON.stringify(updatedNotes));
  res.json(updatedNotes);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
