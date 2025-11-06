import React, { useState } from 'react';

function InteractiveComponent() {
  
  const [inputValue, setInputValue] = useState('');

  const handleClick = (event) => {
   
    alert('Button was clicked!');
    console.log('Event type:', event.type);
    
  };

  const handleChange = (event) => {
 
    setInputValue(event.target.value);
    console.log('Input changed to:', event.target.value);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      
      <button onClick={handleClick}>
        Click Me
      </button>

      <hr />

      
      <input 
        type="text"
        placeholder="Type something..."
        value={inputValue}
        onChange={handleChange} 
      />
      
      <p>Current Input Value: **{inputValue}**</p>
    </div>
  );
}

export default InteractiveComponent;