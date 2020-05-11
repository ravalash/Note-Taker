# Note-Taker
![Github Issues](https://img.shields.io/github/issues/ravalash/Note-Taker)![Github Forks](https://img.shields.io/github/forks/ravalash/Note-Taker)![Github Stars](https://img.shields.io/github/stars/ravalash/Note-Taker)![Github Issues](https://img.shields.io/github/license/ravalash/Note-Taker)

## Description
Week 11 Homework - Note Taker

## Motivation
This homework project will present a full stack note taking application with persistent server side storage. It will utilize the ExpressJS web application framework and Node.js to handle server functionality and allow for practice in defining routing and JSON manipulation.

## Code Style
This project is written using Javascript and uses the express and fs npm packages as well as the standard Node.js path module.

Stanrd HTML requests are served directly to the front end without modification.

```javascript
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
  ```

Get requests read the server stored database file and return information to the front end as an object.

  ```javascript
app.get("/api/notes", function (req, res) {
  res.json(
    JSON.parse(
      fs.readFileSync(path.join(__dirname, "./db/db.json"), "utf8", (err) => {
        if (err) throw err;
      })
    )
  );
});
  ```

New notes are added to the beginning of the array using unshift to ensure they remain at the top of the page when IDs are later assigned.

  ```javascript
app.post("/api/notes", function (req, res) {
  const existingNotes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./db/db.json"), "utf8", (err) => {
      if (err) throw err;
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
    (err) => {
      if (err) throw err;
    }
  );
  res.json(existingNotes);
});
  ```

Notes are displayed in descending chronological order and can be reviewed by clicking the title or deleted with the corresponding icon.

![Notes View Screenshot](/public/screenshots/notelist.JPG "Notes List")


## Features
New ID numbers are applied to the remaining notes upon deletion to ensure they are sequential and keep the database organized.

The unshift method is used instead of the push method to keep the newest notes at the top of the list without making changes to the front end Javascript.


## How to Use
Dependencies must be installed individually or via package.json file
* express
* fs
* path

New notes are recorded by first either navagating to the notes view page or by clicking the pencil icon once already there.

The option to save notes will become available once both a title and text have been entered for the note.

Notes may be viewed by clicking their title on the sidebar or deleted by clicking the trash can icon to the right of the title.
