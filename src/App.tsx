import { useState, useEffect } from 'react';
import StickyNote from './components/StickyNote';

// Define the shape of a Note object using TypeScript
type Note = {
  id: string; // unique identifier for each note
  text: string; // the text content of the note
  position: { x: number; y: number }; // position on the screen (pixels)
};

function App() {
  // useState with initializer function:
  // - Loads saved notes from localStorage if available
  // - Otherwise, creates a default note
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved
      ? JSON.parse(saved) // Parse saved JSON string back into JS object
      : [
          {
            id: '1',
            text: 'Hello, Sticky Note!',
            position: { x: 100, y: 100 }, // Default position (100px right, 100px down)
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
    // Create a new Note object with unique id and default values
    const newNote: Note = {
      id: crypto.randomUUID(), // generates a unique string ID (browser API)
      text: '', // start with empty text
      position: { x: 150, y: 150 }, // default position for new notes
    };

    // Update state by adding the new note to the existing array
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
          key={note.id} // React key to help React identify which items changed
          text={note.text} // Text content of this note
          position={note.position} // Position to place the note on screen

          // Handler to update text when the note content changes
          onChange={(newText) =>
            setNotes((notes) =>
              notes.map((n) => (n.id === note.id ? { ...n, text: newText } : n))
            )
          }

          // Handler to update position when the note is dragged
          onDrag={(position) =>
            setNotes((notes) =>
              notes.map((n) => (n.id === note.id ? { ...n, position } : n))
            )
          }

          // Handler to delete this note from state
          onDelete={() =>
            setNotes((notes) => notes.filter((n) => n.id !== note.id))
          }
        />
      ))}
    </div>
  );
}

export default App;
