import React, { useState, useEffect } from 'react';

type StickyNoteProps = {
  text: string;
  onChange: (newText: string) => void;
  onDelete: () => void;
};

const StickyNote: React.FC<StickyNoteProps> = ({ text, onChange, onDelete }) => {
  // New: State to store position
  const [position, setPosition] = useState({ x: 100, y: 100 });

  // New: Track dragging
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // offset between mouse and corner of note

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    // Calculate offset between mouse and top-left of note
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // Attach global listeners while dragging
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);

  return (
    <div
      className="bg-yellow-200 rounded p-4 shadow-md w-64 min-h-32 absolute"
      style={{ left: position.x, top: position.y }}
    >
      {/* Drag handle: only this part is draggable */}
      <div
        className="cursor-move bg-yellow-300 px-2 py-1 rounded-t"
        onMouseDown={handleMouseDown}
      >
        Drag Me!
      </div>

      <textarea
        className="w-full h-24 bg-transparent resize-none outline-none"
        value={text}
        onChange={e => onChange(e.target.value)}
      ></textarea>

      <button
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        onClick={onDelete}
        aria-label="Delete Note"
      >
        x
      </button>
    </div>
  );
};

export default StickyNote;