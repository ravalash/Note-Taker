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
  res.json(
    JSON.parse(
      fs.readFileSync(path.join(__dirname, "./db/db.json"), "utf8", function (
        error
      ) {
        if (error) {
          return console.log(error);
        }
      })
    )
  );
});

// Route to create a new note - takes in JSON input, adds to db.json, returns note to client
app.post("/api/notes", function (req, res) {
  const existingNotes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./db/db.json"), "utf8", function (
      error
    ) {
      if (error) {
        return console.log(error);
      }
    })
  );
  existingNotes.unshift(req.body);
  // Adds an ID value to each note sequentially
  existingNotes.forEach((element, index) => {
    element.id = index + 1;
  });
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(existingNotes),
    function (error) {
      if (error) {
        return console.log(error);
      }
    }
  );
  res.json(existingNotes);
});

// Deletes a note by ID passed
app.delete("/api/notes/:id", function (req, res) {
  const existingNotes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./db/db.json"), "utf8", function (
      error
    ) {
      if (error) {
        return console.log(error);
      }
    })
  );
  // Filters the note matching the ID passed from the array
  const updatedNotes = existingNotes.filter(function (note) {
    return note.id != req.params.id;
  });
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(updatedNotes),
    function (error) {
      if (error) {
        return console.log(error);
      }
    }
  );
  res.json(updatedNotes);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
