//these are the sticky notes that are used in the app
import React from 'react'; //react is a JavaScript library for building user interfaces

//this is the type definition for the props that the StickyNote component will accept
//a prop is a property that is passed to a component
//example: <StickyNote text="Hello World" />
//analogy: props are the arguments that you pass to a function
type StickyNoteProps = {
    //typescript lets us create types for our props (think of objects)
    text: string; //the text that will be displayed in the sticky note
    onChange: (newText:string) => void; //a function that will be called when the text in the sticky note changes
    onDelete: () => void; //a function that will be called when the sticky note is deleted
};

const StickyNote: React.FC<StickyNoteProps> = ({ text, onChange, onDelete }) => {
    //this is the stickynote component that will be rendered
    return (
        <div className = "bg-yellow-200 rounded p-4 shadow-md w-64 min-h-32 relative">
            <textarea 
            className= "w-full h-24 bg-transparent resize-none outline-none" 
            value = {text}
            onChange={e => onChange(e.target.value)} //when the text changes, call the onChange function with the new text
            //e.target.value gets the value of the textarea. e is the event object that is passed to the onChange function
            //target is the element that triggered the event, in this case the textarea
            //value is the text that is currently in the textarea
            ></textarea>
            <button
            className = "absolute top-2 right-2 text-red-500 hover:text-red-700"
            onClick={onDelete} //when the button is clicked, call the onDelete function
            aria-label="Delete Note"
            >
                x
            </button>
            </div>
        );
    };

export default StickyNote; //export the StickyNote component so it can be used in other files
//exporting is like making a function available to be used in other files
//in this case, we are exporting the StickyNote component so it can be used in other files
//this is the end of the StickyNote component
//the StickyNote component is a functional component that takes in props and returns a JSX element
//JSX is a syntax extension for JavaScript that looks similar to HTML
//it allows us to write HTML-like code in our JavaScript files
//the StickyNote component is a simple component that displays a sticky note with a textarea and a delete button
//it uses the props that are passed to it to display the text, handle changes, and delete the note
//the component is styled using Tailwind CSS classes
//Tailwind CSS is a utility-first CSS framework that allows us to style our components using classes
//the component is also responsive, meaning it will adjust its size based on the screen size        