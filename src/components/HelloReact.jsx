import React, { useState } from 'react';

export default function HelloReact() {
  const [count, setCount] = useState(0);
    
  return (
    <div style={{width: '100%', border: '1px solid black'}}>
      <p>
        <button onClick={() => setCount(count + 1)}>
          Hello, React!
        </button>
        <span> You greeted {count} times</span>
      </p>
    </div>
  );
}