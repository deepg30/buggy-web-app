import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  // Bug #6: Accessing undefined object property
  const user = null;
  
  const handleClick = () => {
    // Bug #7: Trying to access property of null
    console.log(user.name.toUpperCase()); // TypeError
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h1>Buggy Web</h1>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/products">Products</Link></li>
        {/* Bug #8: Broken link - typo in path */}
        <li><Link to="/prodcuts">Broken Link</Link></li>
      </ul>
      <button onClick={handleClick} className="user-button">
        User Info (Will Error)
      </button>
    </nav>
  );
}

export default Navigation;
