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
      id: notes.length + 1,
      content: newNote,
      important: Math.random() < 0.5,
      date: new Date().toISOString(),
    };
    setNotes(notes.concat(newNoteObj));
    setNewNote("");
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
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
          <Note key={note.id} note={note} />
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
