import React, { useState, useEffect } from "react";

function Home() {
  const [data, setData] = useState(null);
  const [count, setCount] = useState(0);
  const [networkStatus, setNetworkStatus] = useState('idle');
  const [apiData, setApiData] = useState(null);

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

  // Bug #13: Incorrect increment logic (subtle bug, won't crash)
  const badIncrement = () => {
    setCount(count + 1); // Should use callback form
    setCount(count + 1); // Will not increment by 2 as expected - this is the bug
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

  // Bug #15: Network error - fetch to non-existent API
  const fetchNonExistentAPI = async () => {
    setNetworkStatus('loading');
    try {
      // Bug: This URL doesn't exist - will cause network error
      const response = await fetch('/api/non-existent-endpoint');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      setApiData(result);
      setNetworkStatus('success');
    } catch (error) {
      console.error('Bug #15 triggered - Network Error:', error.message);
      setNetworkStatus('error');
      alert(`Network Error (Bug #15): ${error.message}`);
    }
  };

  // Bug #16: CORS error - trying to fetch from external API without proper headers
  const fetchWithCORSIssue = async () => {
    setNetworkStatus('loading');
    try {
      // Bug: This will likely cause CORS issues
      const response = await fetch('https://api.github.com/users/nonexistentuser12345');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      setApiData(result);
      setNetworkStatus('success');
    } catch (error) {
      console.error('Bug #16 triggered - CORS/Network Error:', error.message);
      setNetworkStatus('error');
      alert(`CORS/Network Error (Bug #16): ${error.message}`);
    }
  };

  // Bug #17: Timeout error - long running request without timeout handling
  const fetchWithTimeout = async () => {
    setNetworkStatus('loading');
    try {
      // Bug: Long URL that might timeout, no timeout handling
      const response = await fetch('https://httpbin.org/delay/10'); // 10 second delay
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      setApiData(result);
      setNetworkStatus('success');
    } catch (error) {
      console.error('Bug #17 triggered - Timeout Error:', error.message);
      setNetworkStatus('error');
      alert(`Timeout Error (Bug #17): ${error.message}`);
    }
  };

  // Bug #18: Malformed JSON response handling
  const fetchMalformedJSON = async () => {
    setNetworkStatus('loading');
    try {
      // Bug: Trying to parse response as JSON when it might not be
      const response = await fetch('https://httpbin.org/html');
      // Bug: Not checking content-type before parsing as JSON
      const result = await response.json(); // This will fail - HTML response, not JSON
      setApiData(result);
      setNetworkStatus('success');
    } catch (error) {
      console.error('Bug #18 triggered - JSON Parse Error:', error.message);
      setNetworkStatus('error');
      alert(`JSON Parse Error (Bug #18): ${error.message}`);
    }
  };

  // Bug #19: Network error with wrong HTTP method
  const postToGetEndpoint = async () => {
    setNetworkStatus('loading');
    try {
      // Bug: Using POST method on a GET-only endpoint
      const response = await fetch('https://httpbin.org/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: 'test' }),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      setApiData(result);
      setNetworkStatus('success');
    } catch (error) {
      console.error('Bug #19 triggered - HTTP Method Error:', error.message);
      setNetworkStatus('error');
      alert(`HTTP Method Error (Bug #19): ${error.message}`);
    }
  };

  return (
    <div className="home">
      <h2>Welcome to Buggy Web!</h2>
      <p>This site contains intentional bugs for testing purposes.</p>

      <div className="bug-section">
        <h3>Bug Triggers</h3>

        <button onClick={processData}>Process Data (Bug #11/12)</button>

        <button onClick={badIncrement}>Bad Increment: {count} (Bug #13)</button>

        <button onClick={fakeAsyncOperation}>Fake Async (Bug #14)</button>

        {/* Network Error Buttons */}
        <h4>Network Error Triggers</h4>
        
        <button onClick={fetchNonExistentAPI} disabled={networkStatus === 'loading'}>
          {networkStatus === 'loading' ? 'Loading...' : 'Fetch Non-existent API (Bug #15)'}
        </button>

        <button onClick={fetchWithCORSIssue} disabled={networkStatus === 'loading'}>
          {networkStatus === 'loading' ? 'Loading...' : 'CORS Error (Bug #16)'}
        </button>

        <button onClick={fetchWithTimeout} disabled={networkStatus === 'loading'}>
          {networkStatus === 'loading' ? 'Loading...' : 'Timeout Error (Bug #17)'}
        </button>

        <button onClick={fetchMalformedJSON} disabled={networkStatus === 'loading'}>
          {networkStatus === 'loading' ? 'Loading...' : 'JSON Parse Error (Bug #18)'}
        </button>

        <button onClick={postToGetEndpoint} disabled={networkStatus === 'loading'}>
          {networkStatus === 'loading' ? 'Loading...' : 'Wrong HTTP Method (Bug #19)'}
        </button>

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
            <p>This will never show because data is not a string (Bug #20)</p>
          </div>
        )}

        {/* Network Status Display */}
        {networkStatus !== 'idle' && (
          <div className="network-status">
            <h4>Network Status:</h4>
            <p className={`status status-${networkStatus}`}>
              Status: {networkStatus.toUpperCase()}
            </p>
            {networkStatus === 'error' && (
              <p className="error-message">Check console for detailed error information</p>
            )}
            {apiData && (
              <div className="api-response">
                <h5>API Response:</h5>
                <pre>{JSON.stringify(apiData, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="stats">
        <p>Current count: {count}</p>
        {/* Bug #21: Division by zero - results in Infinity but won't crash */}
        <p>
          Percentage:{" "}
          {isFinite(100 / (count - count))
            ? 100 / (count - count)
            : "Invalid (Bug #21)"}
          %
        </p>
        <p>Network requests made: {networkStatus !== 'idle' ? '1+' : '0'}</p>
      </div>
    </div>
  );
}

export default Home;
