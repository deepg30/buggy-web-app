import React, { useState, useEffect } from 'react';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    // Simulating API data with some null/undefined values
    const mockProducts = [
      { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', description: 'High-performance laptop' },
      { id: 2, name: 'Phone', price: null, category: 'Electronics', description: null }, // Null price and description
      { id: 3, name: undefined, price: 299.99, category: 'Electronics' }, // Undefined name
      { id: 4, name: 'Book', price: 19.99, category: null, description: 'Great read' }, // Null category
      { id: 5, name: 'Headphones', price: 'expensive', category: 'Electronics', description: 'Noise cancelling' }, // String price
    ];
    
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Bug #45: Missing key props and null handling in map
  const renderProducts = () => {
    return filteredProducts.map(product => ( // Missing key prop
      <div className="product-card">
        {/* Bug #46: Not checking for null/undefined values */}
        <h3>{product.name.toUpperCase()}</h3> {/* Will error if name is undefined */}
        <p>Price: ${product.price.toFixed(2)}</p> {/* Will error if price is null or string */}
        <p>Category: {product.category.toLowerCase()}</p> {/* Will error if category is null */}
        <p>{product.description.substring(0, 50)}...</p> {/* Will error if description is null */}
        
        {/* Bug #47: Comparing different types */}
        {product.price > 500 && ( // Will fail for string prices
          <span className="expensive">Expensive!</span>
        )}
      </div>
    ));
  };

  // Bug #48: Filter logic with type coercion issues
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filtered = products.filter(product => {
      // Bug #49: Not handling null/undefined in filter
      return product.name.toLowerCase().includes(term.toLowerCase()); // Will error for undefined names
    });
    
    setFilteredProducts(filtered);
  };

  // Bug #50: Sorting with mixed data types
  const handleSort = (e) => {
    const sortField = e.target.value;
    setSortBy(sortField);
    
    const sorted = [...filteredProducts].sort((a, b) => {
      // Bug #51: Not handling different data types in sort
      if (sortField === 'price') {
        return a.price - b.price; // Will fail for null/string prices
      } else {
        return a[sortField].localeCompare(b[sortField]); // Will fail for null/undefined
      }
    });
    
    setFilteredProducts(sorted);
  };

  // Bug #52: Infinite loop with useEffect
  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(products.filter(p => p.name && p.name.includes(searchTerm)));
    }
  }); // Missing dependency array - will run on every render

  // Bug #53: Array method on potentially undefined value
  const getTotalPrice = () => {
    return filteredProducts
      .map(p => p.price) // Could include null/undefined values
      .reduce((sum, price) => sum + price, 0); // Will result in NaN
  };

  // Bug #54: Creating objects in render (performance issue)
  const getProductsByCategory = () => {
    const categories = {};
    filteredProducts.forEach(product => {
      const cat = product.category || 'Unknown';
      if (!categories[cat]) {
        categories[cat] = [];
      }
      categories[cat].push(product);
    });
    return categories;
  };

  return (
    <div className="products">
      <h2>Our Products</h2>
      
      <div className="controls">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        
        <select value={sortBy} onChange={handleSort}>
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="category">Sort by Category</option>
        </select>
      </div>
      
      <div className="stats">
        <p>Total Products: {filteredProducts.length}</p>
        <p>Total Value: ${getTotalPrice()}</p> {/* Will show NaN */}
      </div>
      
      <div className="products-grid">
        {/* Bug #55: Calling function in render without memoization */}
        {renderProducts()}
      </div>
      
      <div className="categories">
        <h3>Products by Category:</h3>
        {/* Bug #56: Creating new object on every render */}
        {Object.entries(getProductsByCategory()).map(([category, products]) => (
          <div key={category}>
            <h4>{category}</h4>
            {/* Bug #57: Nested map without key prop */}
            <ul>
              {products.map(product => (
                <li>{product.name || 'Unknown Product'}</li> // Missing key
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      {/* Bug #58: Conditional rendering with potential issues */}
      {filteredProducts.length === 0 && searchTerm && (
        <div className="no-results">
          <p>No products found matching "{searchTerm}"</p>
          {/* Bug #59: Trying to access property of potentially undefined */}
          <p>Did you mean: {searchTerm.slice(0, -1)}?</p> {/* Will error if searchTerm is empty */}
        </div>
      )}
      
      {/* Bug #60: Rendering without proper null checks */}
      <div className="featured-product">
        <h3>Featured Product:</h3>
        {products[0] && (
          <div>
            <h4>{products[0].name}</h4> {/* Could be undefined */}
            <p>${products[0].price}</p> {/* Could be null */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
