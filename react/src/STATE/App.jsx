import React, { useState } from 'react';

function Counter() {

  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    
    setCount(count + 1);
  };

  return (
    <div>
      <h2>Current Count: {count}</h2>
      
      <button onClick={handleIncrement}>
        Increment Count
      </button>
    </div>
  );
}

export default Counter;