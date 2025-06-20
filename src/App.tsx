import { useState, useEffect } from 'react';
import StickyNote from './components/StickyNote';

type Note = {
  id: string;
  text: string;
  position: { x: number; y: number };
};

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        text: 'Hello, Sticky Note!',
        position: { x: 100, y: 100 },
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  return (
    <div className="p-8">
      {notes.map(note => (
        <StickyNote
          key={note.id}
          text={note.text}
          position={note.position}
          onChange={(newText) =>
            setNotes(notes =>
              notes.map(n =>
                n.id === note.id ? { ...n, text: newText } : n
              )
            )
          }
          onDrag={(position) =>
            setNotes(notes =>
              notes.map(n =>
                n.id === note.id ? { ...n, position } : n
              )
            )
          }
          onDelete={() =>
            setNotes(notes => notes.filter(n => n.id !== note.id))
          }
        />
      ))}
    </div>
  );
}

export default App;
