import React, { useEffect, useState } from 'react';

type StickyNoteProps = {
  text: string;
  position: { x: number; y: number };
  color: string;
  onChange: (text: string) => void;
  onDrag: (position: { x: number; y: number }) => void;
  onDelete: () => void;
  onToggleColor: () => void;
};

const StickyNote: React.FC<StickyNoteProps> = ({
  text,
  position,
  color,
  onChange,
  onDelete,
  onDrag,
  onToggleColor,
}) => {
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
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        backgroundColor: color,
        minWidth: 200,
        minHeight: 150,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        padding: 16,
      }}
    >
      <div
        className="cursor-move bg-blue-300 px-2 py-1 rounded-t"
        onMouseDown={handleMouseDown}
      >
        Drag Me
      </div>

      <textarea
        className="w-full h-24 bg-transparent resize-none outline-none"
        value={text}
        onChange={e => onChange(e.target.value)}
      ></textarea>

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