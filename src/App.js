import axios from "axios";
import { useState, useEffect } from "react";
import Note from "./components/Note";

const App = (props) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note");
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/notes").then((respone) => {
      console.log("promise fulfilled");
      setNotes(respone.data);
    });
  }, []);

  console.log("rendered ", notes.length, " notes");

  const addNote = (event) => {
    event.preventDefault();
    const newNoteObj = {
      content: newNote,
      important: Math.random() < 0.5,
      date: new Date().toISOString(),
    };
    axios.post("http://localhost:3001/notes", newNoteObj).then((response) => {
      console.log(response);
      setNotes(notes.concat(response.data));
      setNewNote("");
    });
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    axios.put(url, changedNote).then((response) => {
      setNotes(notes.map((note) => (note.id === id ? response.data : note)));
    });
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "Important" : "All"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input onChange={handleNoteChange} value={newNote} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
