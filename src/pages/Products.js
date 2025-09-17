import React, { useState, useEffect } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    // Simulating API data with some null/undefined values
    const mockProducts = [
      {
        id: 1,
        name: "Laptop",
        price: 999.99,
        category: "Electronics",
        description: "High-performance laptop",
      },
      {
        id: 2,
        name: "Phone",
        price: null,
        category: "Electronics",
        description: null,
      }, // Null price and description
      { id: 3, name: undefined, price: 299.99, category: "Electronics" }, // Undefined name
      {
        id: 4,
        name: "Book",
        price: 19.99,
        category: null,
        description: "Great read",
      }, // Null category
      {
        id: 5,
        name: "Headphones",
        price: "expensive",
        category: "Electronics",
        description: "Noise cancelling",
      }, // String price
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Bug #45: Missing key props but safe rendering
  const renderProducts = () => {
    return filteredProducts.map((product, index) => (
      <div key={product.id || index} className="product-card">
        {" "}
        {/* Added fallback key */}
        {/* Bug #46: Not checking for null/undefined values but with fallbacks */}
        <h3>
          {product.name
            ? product.name.toUpperCase()
            : "UNKNOWN PRODUCT (Bug #46)"}
        </h3>
        <p>
          Price: $
          {typeof product.price === "number"
            ? product.price.toFixed(2)
            : "Invalid Price (Bug #46)"}
        </p>
        <p>
          Category:{" "}
          {product.category
            ? product.category.toLowerCase()
            : "unknown (Bug #46)"}
        </p>
        <p>
          {product.description
            ? product.description.substring(0, 50) + "..."
            : "No description (Bug #46)"}
        </p>
        {/* Bug #47: Comparing different types with safe check */}
        {typeof product.price === "number" && product.price > 500 && (
          <span className="expensive">Expensive!</span>
        )}
      </div>
    ));
  };

  // Bug #48: Filter logic with type coercion issues but safe
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = products.filter((product) => {
      // Bug #49: Not handling null/undefined in filter but with fallback
      try {
        return (
          product.name &&
          product.name.toLowerCase().includes(term.toLowerCase())
        );
      } catch (error) {
        console.error("Bug #49 triggered for product:", product, error.message);
        return false; // Safe fallback
      }
    });

    setFilteredProducts(filtered);
  };

  // Bug #50: Sorting with mixed data types but safe
  const handleSort = (e) => {
    const sortField = e.target.value;
    setSortBy(sortField);

    const sorted = [...filteredProducts].sort((a, b) => {
      try {
        // Bug #51: Not handling different data types in sort properly
        if (sortField === "price") {
          const priceA = typeof a.price === "number" ? a.price : 0;
          const priceB = typeof b.price === "number" ? b.price : 0;
          return priceA - priceB; // Still buggy logic but won't crash
        } else {
          const fieldA = a[sortField] ? String(a[sortField]) : "";
          const fieldB = b[sortField] ? String(b[sortField]) : "";
          return fieldA.localeCompare(fieldB);
        }
      } catch (error) {
        console.error("Bug #50/51 triggered:", error.message);
        return 0; // Safe fallback
      }
    });

    setFilteredProducts(sorted);
  };

  // Bug #52: Inefficient useEffect (runs too often but won't crash)
  useEffect(() => {
    if (searchTerm && products.length > 0) {
      const filtered = products.filter(
        (p) => p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else if (!searchTerm) {
      setFilteredProducts(products);
    }
  }); // Bug: Missing dependency array - will run on every render

  // Bug #53: Array method on potentially problematic values
  const getTotalPrice = () => {
    try {
      return filteredProducts
        .map((p) => (typeof p.price === "number" ? p.price : 0)) // Bug: still using 0 for invalid prices
        .reduce((sum, price) => sum + price, 0);
    } catch (error) {
      console.error("Bug #53 triggered:", error.message);
      return "Error calculating total (Bug #53)";
    }
  };

  // Bug #54: Creating objects in render (performance issue)
  const getProductsByCategory = () => {
    const categories = {};
    filteredProducts.forEach((product) => {
      const cat = product.category || "Unknown";
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
            {/* Bug #57: Nested map without proper key prop */}
            <ul>
              {products.map((product, idx) => (
                <li key={`${category}-${product.id || idx}`}>
                  {product.name || "Unknown Product"}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bug #58: Conditional rendering logic issue */}
      {filteredProducts.length === 0 && searchTerm && (
        <div className="no-results">
          <p>No products found matching "{searchTerm}"</p>
          {/* Bug #59: Logic error but safe */}
          <p>
            Did you mean:{" "}
            {searchTerm && searchTerm.length > 1
              ? searchTerm.slice(0, -1)
              : "something else"}
            ? (Bug #59)
          </p>
        </div>
      )}

      {/* Bug #60: Rendering with safer null checks but still has issues */}
      <div className="featured-product">
        <h3>Featured Product:</h3>
        {products[0] && (
          <div>
            <h4>{products[0].name || "Unnamed Product (Bug #60)"}</h4>
            <p>
              $
              {typeof products[0].price === "number"
                ? products[0].price
                : "Price unavailable (Bug #60)"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
