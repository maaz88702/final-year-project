import React from 'react';

function FruitList() {
  const fruits = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' }
  ];

  return (
    <div>
      <h2>Available Fruits</h2>
      <ul>
        {fruits.map((fruit) => (
          
          <li key={fruit.id}>
            {fruit.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FruitList;