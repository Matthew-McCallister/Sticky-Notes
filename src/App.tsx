import { useState, useEffect } from 'react';
import StickyNote from './components/StickyNote';

type Note = {
  id: string;
  text: string;
  position: { x: number; y: number };
  color: string;
};

function App() {
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

  // Persisted dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const addNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      text: '',
      position: { x: 150, y: 150 },
      color: 'yellow',
    };
    setNotes([...notes, newNote]);
  };

  const toggleMode = () => setDarkMode((prev) => !prev);

  return (
    <div className={`p-8 min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-blue-100'}`}>
      <button
        onClick={toggleMode}
        className="mb-4 mr-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
      >
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
      <button
        onClick={addNote}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Note
      </button>
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