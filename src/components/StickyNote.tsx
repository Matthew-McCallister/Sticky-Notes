import React, { useEffect, useState } from 'react';

type StickyNoteProps = {
  text: string;
  position: { x: number; y: number };
  onChange: (newText: string) => void;
  onDelete: () => void;
  onDrag: (position: { x: number; y: number }) => void;
};

const StickyNote: React.FC<StickyNoteProps> = ({ text, position, onChange, onDelete, onDrag }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - offset.x;
        const newY = e.clientY - offset.y;
        onDrag({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset, onDrag]);

  return (
    <div
      className="bg-yellow-200 rounded p-4 shadow-md w-64 min-h-32 absolute"
      style={{ left: position.x, top: position.y }}
    >
      <div
        className="cursor-move bg-yellow-300 px-2 py-1 rounded-t"
        onMouseDown={handleMouseDown}
      >
        Drag Me
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
