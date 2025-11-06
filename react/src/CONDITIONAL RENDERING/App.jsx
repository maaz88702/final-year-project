import React, { useState } from 'react';

function StatusDisplay() {
  
  const [isOnline, setIsOnline] = useState(true);


  const toggleStatus = () => {
    setIsOnline(!isOnline);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd' }}>
      
     
      <h2 style={{ color: isOnline ? 'green' : 'red' }}>
        Status: {isOnline ? 'Online' : 'Offline'}
      </h2>
      
      <button onClick={toggleStatus}>
        Toggle Status
      </button>
    </div>
  );
}

export default StatusDisplay;