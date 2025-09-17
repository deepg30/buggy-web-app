import React, { useState, useEffect } from 'react';

function Home() {
  const [data, setData] = useState(null);
  const [count, setCount] = useState(0);

  // Bug #9: useEffect with missing dependency
  useEffect(() => {
    // Bug #10: Trying to call undefined function
    const result = someUndefinedFunction();
    setData(result);
  }, []); // Missing 'count' in dependency array

  // Bug #11: Function that will cause TypeError
  const processData = () => {
    // Bug #12: Accessing property of potentially null value
    return data.items.map(item => item.name); // TypeError if data is null
  };

  // Bug #13: Infinite loop potential
  const badIncrement = () => {
    setCount(count + 1); // Should use callback form
    setCount(count + 1); // Will not increment by 2 as expected
  };

  // Bug #14: Synchronous operation treated as async
  const fakeAsyncOperation = () => {
    const result = Math.random();
    return result.then(data => data * 2); // TypeError: result.then is not a function
  };

  return (
    <div className="home">
      <h2>Welcome to Buggy Web!</h2>
      <p>This site contains intentional bugs for testing purposes.</p>
      
      <div className="bug-section">
        <h3>Bug Triggers</h3>
        
        <button onClick={processData}>
          Process Data (Will Error if data is null)
        </button>
        
        <button onClick={badIncrement}>
          Bad Increment: {count}
        </button>
        
        <button onClick={fakeAsyncOperation}>
          Fake Async (Will Error)
        </button>
        
        {/* Bug #15: Conditional rendering with potential undefined */}
        {data && data.items.map(item => (
          <div key={item.id}>
            {/* Bug #16: Accessing nested property without checking */}
            <h4>{item.title.toUpperCase()}</h4>
            <p>{item.description.substring(0, 50)}</p>
          </div>
        ))}
        
        {/* Bug #17: Using array method on non-array */}
        {typeof data === 'string' && data.map(char => (
          <span key={char}>{char}</span>
        ))}
      </div>
      
      <div className="stats">
        <p>Current count: {count}</p>
        {/* Bug #18: Division by zero */}
        <p>Percentage: {(100 / (count - count)) || 'Invalid'}%</p>
      </div>
    </div>
  );
}

export default Home;
