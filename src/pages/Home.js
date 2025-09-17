import React, { useState, useEffect } from "react";

function Home() {
  const [data, setData] = useState(null);
  const [count, setCount] = useState(0);

  // Bug #9: useEffect with missing dependency - but won't crash
  useEffect(() => {
    // Simulate some data loading instead of calling undefined function
    const simulateLoading = () => {
      try {
        // Bug #10: Reference to undefined function (wrapped)
        const result = someUndefinedFunction();
        setData(result);
      } catch (error) {
        console.error("Bug #10 triggered:", error.message);
        // Set some mock data so the page still works
        setData({
          items: [
            {
              id: 1,
              title: "Sample Item 1",
              description: "This is a sample description for testing",
            },
            {
              id: 2,
              title: "Sample Item 2",
              description: "Another sample description",
            },
          ],
        });
      }
    };

    // Delay to simulate API call
    setTimeout(simulateLoading, 1000);
  }, []); // Bug: Missing 'count' in dependency array

  // Bug #11: Function that will cause TypeError but wrapped
  const processData = () => {
    try {
      if (!data || !data.items) {
        throw new Error("Data is not available");
      }
      // Bug #12: This would fail if data.items doesn't exist
      return data.items.map((item) => item.name || "Unknown");
    } catch (error) {
      console.error("Bug #11/12 triggered:", error.message);
      alert("Process data button has a bug - check the console!");
      return [];
    }
  };

  // Corrected increment logic
  const incrementByTwo = () => {
    setCount(count => count + 2);
  };

  // Bug #14: Synchronous operation treated as async
  const fakeAsyncOperation = () => {
    try {
      const result = Math.random();
      return result.then((data) => data * 2); // TypeError: result.then is not a function
    } catch (error) {
      console.error("Bug #14 triggered:", error.message);
      alert("Fake async button has a bug - check the console!");
    }
  };

  return (
    <div className="home">
      <h2>Welcome to Buggy Web!</h2>
      <p>This site contains intentional bugs for testing purposes.</p>

      <div className="bug-section">
        <h3>Bug Triggers</h3>

        <button onClick={processData}>Process Data (Bug #11/12)</button>

        <button onClick={incrementByTwo}>Increment by 2: {count}</button>

        <button onClick={fakeAsyncOperation}>Fake Async (Bug #14)</button>

        {/* Safe rendering with proper checks */}
        {data &&
          data.items &&
          data.items.map((item) => (
            <div key={item.id}>
              <h4>{item.title ? item.title.toUpperCase() : "No Title"}</h4>
              <p>
                {item.description
                  ? item.description.substring(0, 50) + "..."
                  : "No description"}
              </p>
            </div>
          ))}

        {/* Bug #17: Logic error - checking wrong type but won't crash */}
        {typeof data === "string" && (
          <div>
            <p>This will never show because data is not a string (Bug #17)</p>
          </div>
        )}
      </div>

      <div className="stats">
        <p>Current count: {count}</p>
        {/* Bug #18: Division by zero - results in Infinity but won't crash */}
        <p>
          Percentage:{" "}
          {isFinite(100 / (count - count))
            ? 100 / (count - count)
            : "Invalid (Bug #18)"}
          %
        </p>
      </div>
    </div>
  );
}

export default Home;
