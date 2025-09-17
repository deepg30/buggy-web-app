import React from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";

function App() {
  // Bug #2: Declaring a variable but never using it (dead code)
  const unusedVariable = "This will never be used";

  // Bug #3: Trying to call a non-function
  const notAFunction = "I'm a string";

  const handleBuggyClick = () => {
    try {
      // Bug #4: Calling a string as a function (wrapped to prevent crash)
      notAFunction();
    } catch (error) {
      console.error("Bug #4 triggered:", error.message);
      alert("Oops! That button has a bug - check the console!");
    }
  };

  return (
    <div className="app">
      <Navigation />
      <main>
        <button onClick={handleBuggyClick} className="bug-trigger-btn">
          Click me for error (Bug #4)
        </button>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          {/* Bug #5: Missing route handler - will cause 404 issues */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
