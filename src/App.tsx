import { useState, useEffect } from 'react';
import StickyNote from './components/StickyNote';

// Define the shape of a Note object using TypeScript
type Note = {
  id: string; // unique identifier for each note
  text: string; // the text content of the note
  position: { x: number; y: number }; // position on the screen (pixels)
  color: string; // color of the note
};

function App() {
  // useState with initializer function:
  // - Loads saved notes from localStorage if available
  // - Otherwise, creates a default note
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '1',
            text: 'Hello, Sticky Note!',
            position: { x: 100, y: 100 },
            color: 'yellow', // Default color
          },
        ];
  });

  // useEffect to keep localStorage updated whenever notes state changes
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
    // JSON.stringify converts notes array into a string for storage
  }, [notes]); // runs only when `notes` changes

  // Function to add a new note when user clicks the button
  const addNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      text: '',
      position: { x: 150, y: 150 },
      color: 'yellow', // Default color
    };
    setNotes([...notes, newNote]);
  };

  return (
    <div className="p-8">
      {/* Button for adding a new sticky note */}
      <button
        onClick={addNote} // Calls addNote function when clicked
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Note
      </button>

      {/* Render all notes using map */}
      {notes.map((note) => (
  <StickyNote
    key={note.id}
    text={note.text}
    position={note.position}
    color={note.color}
    onChange={(newText) =>
      setNotes((notes) =>
        notes.map((n) => (n.id === note.id ? { ...n, text: newText } : n))
      )
    }
    onDrag={(position) =>
      setNotes((notes) =>
        notes.map((n) => (n.id === note.id ? { ...n, position } : n))
      )
    }
    onDelete={() =>
      setNotes((notes) => notes.filter((n) => n.id !== note.id))
    }
    onToggleColor={() => {
      const colors = ['yellow', 'red', 'blue', 'green'];
      setNotes((notes) =>
        notes.map((n) =>
          n.id === note.id
            ? {
                ...n,
                color:
                  colors[(colors.indexOf(n.color) + 1) % colors.length],
              }
            : n
        )
      );
    }}
  />
))}
    </div>
  );
}

export default App;
