import React, { useEffect, useState } from 'react';

function ClickLogger() {
  const [clickCount, setClickCount] = useState(0);

  // Function that runs every time the window is clicked
  const handleWindowClick = () => {
    setClickCount(prevCount => prevCount + 1);
    console.log('Window was clicked! Count:', clickCount + 1);
  };

  // 1. Setup the Effect (runs once on mount)
  useEffect(() => {
    console.log('✅ EFFECT SETUP: Adding click listener to window.');
    
    // START the side effect: Attach the event listener to the global window object.
    window.addEventListener('click', handleWindowClick);

    // 2. The Cleanup Function (The RETURN)
    return () => {
      console.log('❌ CLEANUP RUN: Removing click listener from window.');
      
      // STOP the side effect: Remove the listener.
      window.removeEventListener('click', handleWindowClick);
    };
  }, []); // Empty dependency array: runs only on initial mount/final unmount

  return (
    <div style={{ padding: '20px', border: '2px solid #1a73e8', margin: '20px' }}>
      <h3>Click Logger Active</h3>
      <p>Total clicks observed globally: **{clickCount}**</p>
      <p style={{ color: 'gray' }}>Try clicking anywhere on this browser window.</p>
    </div>
  );
}

export default ClickLogger;