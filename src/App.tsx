// Import React hooks for state and side effects
import { useState, useEffect } from 'react';
// Import the StickyNote component
import StickyNote from './components/StickyNote';

// Define the structure of a Note object
// Each note has an id, text, position (x, y), and a color
// TypeScript helps catch errors by enforcing this structure
// If you are new to TypeScript, think of this as a way to describe what a note should look like

type Note = {
  id: string;
  text: string;
  position: { x: number; y: number };
  color: string;
};

function App() {
  // useState is a React hook that lets you add state to your component
  // Here, we store all the notes in an array
  // The function inside useState runs only once, when the component first loads
  // It tries to load notes from localStorage (browser storage), or uses a default note if none are found
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '1',
            text: 'Hello, Sticky Note!',
            position: { x: 100, y: 100 },
            color: 'yellow',
          },
        ];
  });

  // This state keeps track of whether dark mode is enabled
  // It also tries to load the value from localStorage, or defaults to false (light mode)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // useEffect is a React hook for running code when something changes
  // This effect saves the notes to localStorage whenever the notes array changes
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // This effect saves the dark mode setting to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Function to add a new note
  // It creates a new note object and adds it to the notes array
  const addNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(), // Generates a unique id for the note
      text: '',
      position: { x: 150, y: 150 },
      color: 'yellow',
    };
    setNotes([...notes, newNote]); // Adds the new note to the array
  };

  // Function to toggle between dark and light mode
  const toggleMode = () => setDarkMode((prev: boolean) => !prev);

  // The return statement describes what should be shown on the page
  // This is called JSX, which looks like HTML but is actually JavaScript
  return (
    // The main container div
    // The className sets up padding, minimum height, and background color based on darkMode
    <div className={`p-8 min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-blue-100'}`}>
      {/* Button to toggle dark/light mode */}
      <button
        onClick={toggleMode}
        className="mb-4 mr-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
      >
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
      {/* Button to add a new sticky note */}
      <button
        onClick={addNote}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Note
      </button>
      {/* Render each note using the StickyNote component */}
      {notes.map((note) => (
        <StickyNote
          key={note.id} // React needs a unique key for each item in a list
          text={note.text}
          position={note.position}
          color={note.color}
          // When the text changes, update the note in the array
          onChange={(newText) =>
            setNotes((notes) =>
              notes.map((n) => (n.id === note.id ? { ...n, text: newText } : n))
            )
          }
          // When the note is dragged, update its position
          onDrag={(position) =>
            setNotes((notes) =>
              notes.map((n) => (n.id === note.id ? { ...n, position } : n))
            )
          }
          // When the delete button is clicked, remove the note
          onDelete={() =>
            setNotes((notes) => notes.filter((n) => n.id !== note.id))
          }
          // When the color toggle button is clicked, cycle through colors
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