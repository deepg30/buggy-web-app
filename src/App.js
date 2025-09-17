import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';

function App() {
  // Bug #2: Declaring a variable but never using it (dead code)
  const unusedVariable = "This will never be used";
  
  // Bug #3: Trying to call a non-function
  const notAFunction = "I'm a string";
  
  return (
    <div className="app">
      <Navigation />
      <main>
        {/* Bug #4: Calling a string as a function */}
        <button onClick={() => notAFunction()}>
          Click me for error
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
