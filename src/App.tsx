import { useState } from 'react'
import StickyNote from './components/StickyNote' // Importing the StickyNote component
// StickyNote component is a functional component that displays a sticky note with a textarea and a delete button
function App() {
  const [note, setNote] = useState("Hello, Sticky Note!");// State to hold the text of the sticky note

  return (
    <div className = "p-8">
      <StickyNote
        text={note} // Passing the note state as text prop to StickyNote
        onChange={setNote} // Passing setNote function to handle text changes
        onDelete={() => setNote("")} // Passing a function to clear the note when deleted
        />
    </div>
  )
}

export default App
