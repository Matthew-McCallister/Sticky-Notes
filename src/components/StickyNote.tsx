import React, { useEffect, useState } from 'react';

// This type defines what props (inputs) the StickyNote component expects.
// These props are provided by the parent (App) and let the note work with text, position, color, and actions.
type StickyNoteProps = {
  text: string; // The text content of the note
  position: { x: number; y: number }; // The position of the note on the screen
  color: string; // The background color of the note
  onChange: (text: string) => void; // Function to call when the note text changes
  onDrag: (position: { x: number; y: number }) => void; // Function to call when the note is dragged
  onDelete: () => void; // Function to call when the note is deleted
  onToggleColor: () => void; // Function to call when the color toggle button is clicked
};

// This is a React functional component for a single sticky note
const StickyNote: React.FC<StickyNoteProps> = ({
  text,
  position,
  color,
  onChange,
  onDelete,
  onDrag,
  onToggleColor,
}) => {
  // Local state to track if the note is being dragged
  const [isDragging, setIsDragging] = useState(false);
  // Local state to track the offset between mouse and note corner when dragging starts
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // This function is called when the user presses the mouse down on the drag handle
  // It sets up dragging and records the offset so the note doesn't jump
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // useEffect lets us run code when dragging starts or stops
  // Here, we add listeners to the whole document so dragging works even if the mouse leaves the note
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Calculate the new position based on mouse movement and offset
        const newX = e.clientX - offset.x;
        const newY = e.clientY - offset.y;
        onDrag({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false); // Stop dragging when mouse is released
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    // Cleanup: remove listeners when dragging stops or component unmounts
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset, onDrag]);

  // The return statement describes the note's appearance and behavior
  return (
    <div
      style={{
        position: 'absolute', // Makes the note float at a specific position
        left: position.x,
        top: position.y,
        backgroundColor: color, // Sets the note's background color
        color: (color === 'red' || color === 'blue') ? 'white' : 'black', // Use white text on dark backgrounds
        minWidth: 200,
        minHeight: 150,
        borderRadius: 8, // Rounded corners
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', // Subtle shadow for depth
        padding: 16, // Space inside the note
      }}
    >
      {/* This is the drag handle (the area you grab to move the note) */}
      <div
        className="cursor-move bg-blue-300 px-2 py-5 rounded-t"
        onMouseDown={handleMouseDown}
        aria-label="Drag Me" // This label helps with accessibility and testing
      >
      </div>

      {/* The textarea lets you edit the note's text */}
      <textarea
        className="w-full h-24 bg-transparent resize-none outline-none"
        value={text}
        onChange={e => onChange(e.target.value)}
      ></textarea>

      {/* The bottom row has buttons for color toggle and delete */}
      <div className="flex justify-between mt-2">
        <button
          className="text-white-600 hover:text-black-800"
          onClick={onToggleColor}
        >
          Toggle Color
        </button>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={onDelete}
          aria-label="Delete Note"
          type="button"
        >
          x
        </button>
      </div>
    </div>
  );
};

export default StickyNote;
// This export lets other files import and use the StickyNote component
// For example, App.tsx uses <StickyNote ... /> to show each note