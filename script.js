// Global variables and state
let products = [];
let filteredProducts = [];
let cart = [];
let currentPage = 1;
const PRODUCTS_PER_PAGE = 9;
let isLoading = false;

// Mock product data with intentional inconsistencies
const mockProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    category: "smartphones",
    price: 999,
    originalPrice: 1099,
    rating: 4.8,
    reviews: 2543,
    description:
      "The latest iPhone with advanced camera system and A17 Pro chip.",
    badge: "New",
    image: "fas fa-mobile-alt",
  },
  {
    id: 2,
    name: 'MacBook Pro 16"',
    category: "laptops",
    price: 2399,
    originalPrice: null,
    rating: 4.9,
    reviews: 1876,
    description:
      "Professional laptop with M3 Pro chip for demanding workflows.",
    badge: null,
    image: "fas fa-laptop",
  },
  {
    id: 3,
    name: "AirPods Pro 2nd Gen",
    category: "headphones",
    price: 249,
    originalPrice: 279,
    rating: 4.7,
    reviews: 8932,
    description: "Active noise cancellation and spatial audio technology.",
    badge: "Popular",
    image: "fas fa-headphones",
  },
  {
    id: 4,
    name: "iPad Air",
    category: "tablets",
    price: 599,
    originalPrice: null,
    rating: 4.6,
    reviews: 3421,
    description: "Powerful and versatile tablet for work and creativity.",
    badge: null,
    image: "fas fa-tablet-alt",
  },
  {
    id: 5,
    name: "Samsung Galaxy S24 Ultra",
    category: "smartphones",
    price: 1199,
    originalPrice: 1299,
    rating: 4.5,
    reviews: 1923,
    description: "Premium Android phone with S Pen and advanced cameras.",
    badge: "Sale",
    image: "fas fa-mobile-alt",
  },
  {
    id: 6,
    name: "Dell XPS 13",
    category: "laptops",
    price: 1299,
    originalPrice: 1499,
    rating: 4.4,
    reviews: 987,
    description: "Ultra-portable laptop with stunning InfinityEdge display.",
    badge: "Sale",
    image: "fas fa-laptop",
  },
  {
    id: 7,
    name: "Sony WH-1000XM5",
    category: "headphones",
    price: 399,
    originalPrice: null,
    rating: 4.8,
    reviews: 5643,
    description: "Industry-leading noise canceling headphones.",
    badge: null,
    image: "fas fa-headphones",
  },
  {
    id: 8,
    name: "Surface Pro 9",
    category: "tablets",
    price: 999,
    originalPrice: null,
    rating: 4.3,
    reviews: 2145,
    description: "2-in-1 laptop and tablet with versatile design.",
    badge: null,
    image: "fas fa-tablet-alt",
  },
  {
    id: 9,
    name: "Google Pixel 8 Pro",
    category: "smartphones",
    price: 899,
    originalPrice: 999,
    rating: 4.6,
    reviews: 1456,
    description: "AI-powered photography and pure Android experience.",
    badge: "Sale",
    image: "fas fa-mobile-alt",
  },
  {
    id: 10,
    name: "MacBook Air M2",
    category: "laptops",
    price: 1199,
    originalPrice: null,
    rating: 4.7,
    reviews: 3789,
    description: "Thin, light, and powerful with M2 chip efficiency.",
    badge: "Popular",
    image: "fas fa-laptop",
  },
  {
    id: 11,
    name: "Bose QuietComfort 45",
    category: "headphones",
    price: 329,
    originalPrice: 379,
    rating: 4.5,
    reviews: 4231,
    description:
      "Comfortable wireless headphones with excellent noise cancellation.",
    badge: "Sale",
    image: "fas fa-headphones",
  },
  {
    id: 12,
    name: 'iPad Pro 12.9"',
    category: "tablets",
    price: 1099,
    originalPrice: null,
    rating: 4.8,
    reviews: 2567,
    description: "Professional tablet with M2 chip and Liquid Retina display.",
    badge: "New",
    image: "fas fa-tablet-alt",
  },
];

// DOM elements
let productsGrid;
let loadingElement;
let loadMoreBtn;
let categoryFilter;
let priceFilter;
let priceDisplay;
let sortFilter;
let cartBtn;
let cartCount;
let cartModal;
let cartItems;
let cartTotal;

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  console.log("Initializing TechGear Catalog...");

  // Get DOM elements
  productsGrid = document.getElementById("products-grid");
  loadingElement = document.getElementById("loading");
  loadMoreBtn = document.getElementById("load-more-btn");
  categoryFilter = document.getElementById("category-filter");
  priceFilter = document.getElementById("price-filter");
  priceDisplay = document.getElementById("price-display");
  sortFilter = document.getElementById("sort-filter");
  cartBtn = document.getElementById("cart-btn");
  cartCount = document.getElementById("cart-count");
  cartModal = document.getElementById("cart-modal");
  cartItems = document.getElementById("cart-items");
  cartTotal = document.getElementById("cart-total");

  // Bug #1: Trying to access non-existent element (will cause console error)
  try {
    const nonExistentElement = document.getElementById("analytics-tracker");
    nonExistentElement.setAttribute("data-initialized", "true"); // This will throw error
  } catch (error) {
    console.error("Analytics tracker initialization failed:", error.message);
  }

  // Initialize products
  initializeProducts();

  // Setup event listeners
  setupEventListeners();

  // Bug #2: Calling undefined function (will cause console error)
  try {
    initializeAnalytics(); // This function doesn't exist
  } catch (error) {
    console.warn("Analytics initialization failed:", error.message);
  }

  // Load cart from localStorage
  loadCartFromStorage();

  console.log("Application initialized successfully");
});

function initializeProducts() {
  console.log("Initializing product catalog...");
  products = [...mockProducts];
  filteredProducts = [...products];

  // Hide loading immediately and display products
  hideLoading();
  displayProducts();

  // Bug #3: Simulate API call that sometimes fails (but doesn't affect main product loading)
  setTimeout(() => {
    if (Math.random() < 0.3) {
      // 30% chance of "network error" for recommendations
      console.error(
        "Failed to load product recommendations from API:",
        "Network timeout after 5000ms"
      );
      try {
        loadProductRecommendations(); // This function doesn't exist but we call it anyway
      } catch (error) {
        console.warn("Product recommendations failed:", error.message);
      }
    }
  }, 1000);

  console.log(`Successfully loaded ${products.length} products`);
}

function displayProducts() {
  console.log(
    "displayProducts called with:",
    filteredProducts.length,
    "products"
  );

  if (!productsGrid) {
    console.error("Products grid element not found");
    return;
  }

  console.log("Products grid found, displaying products...");

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const productsToShow = filteredProducts.slice(0, endIndex);

  // Clear existing products if it's the first page
  if (currentPage === 1) {
    productsGrid.innerHTML = "";
  }

  // Bug #4: Trying to access undefined property occasionally
  productsToShow.slice(startIndex).forEach((product, index) => {
    try {
      const productCard = createProductCard(product);
      productsGrid.appendChild(productCard);

      // Bug #5: Randomly try to access undefined nested property
      if (index % 3 === 0) {
        console.log("Product analytics:", product.analytics.views); // analytics doesn't exist
      }
    } catch (error) {
      console.warn(`Failed to load product ${product.id}:`, error.message);
    }
  });

  // Show/hide load more button
  const hasMoreProducts = endIndex < filteredProducts.length;
  const loadMoreSection = document.getElementById("load-more");
  if (loadMoreSection) {
    loadMoreSection.style.display = hasMoreProducts ? "block" : "none";
  }

  console.log(
    `Displayed ${productsToShow.slice(startIndex).length} products successfully`
  );

  // Bug #6: Trying to update non-existent metrics
  try {
    updateProductMetrics(productsToShow.length); // This function doesn't exist
  } catch (error) {
    console.warn("Product metrics update failed:", error.message);
  }
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.setAttribute("data-product-id", product.id);

  // Bug #7: Unsafe string concatenation that might cause XSS (simulated)
  const unsafeDescription = product.description; // In real scenario, this could be user input

  card.innerHTML = `
        <div class="product-image">
            <i class="${product.image}"></i>
            ${
              product.badge
                ? `<div class="product-badge">${product.badge}</div>`
                : ""
            }
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3>${product.name}</h3>
            <p class="product-description">${unsafeDescription}</p>
            <div class="product-rating">
                <div class="stars">${generateStars(product.rating)}</div>
                <span class="rating-text">${
                  product.rating
                } (${product.reviews.toLocaleString()} reviews)</span>
            </div>
            <div class="product-price">
                ${
                  product.originalPrice
                    ? `<span class="original-price">$${product.originalPrice}</span>`
                    : ""
                }
                $${product.price}
            </div>
            <div class="product-actions">
                <button class="btn-primary add-to-cart" onclick="addToCart(${
                  product.id
                })">Add to Cart</button>
                <button class="btn-secondary" onclick="viewProduct(${
                  product.id
                })">View Details</button>
            </div>
        </div>
    `;

  // Bug #8: Memory leak - adding event listeners without cleanup
  const addToCartBtn = card.querySelector(".add-to-cart");
  addToCartBtn.addEventListener("click", function () {
    // This creates a closure that might prevent garbage collection
    setTimeout(() => {
      console.log(`Product ${product.id} added to cart at ${new Date()}`);
    }, 100);
  });

  return card;
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let starsHtml = "";

  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star"></i>';
  }

  if (hasHalfStar) {
    starsHtml += '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star"></i>';
  }

  return starsHtml;
}

function setupEventListeners() {
  // Category filter
  if (categoryFilter) {
    categoryFilter.addEventListener("change", applyFilters);
  }

  // Price filter
  if (priceFilter) {
    priceFilter.addEventListener("input", function () {
      if (priceDisplay) {
        priceDisplay.textContent = `$${this.value}`;
      }
      // Bug #9: Debouncing not implemented properly, causing excessive filtering
      applyFilters(); // This should be debounced but isn't
    });
  }

  // Sort filter
  if (sortFilter) {
    sortFilter.addEventListener("change", applyFilters);
  }

  // Load more button
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", loadMoreProducts);
  }

  // Cart button
  if (cartBtn) {
    cartBtn.addEventListener("click", openCartModal);
  }

  // Modal close button
  const closeBtn = cartModal?.querySelector(".close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeCartModal);
  }

  // Modal background close
  if (cartModal) {
    cartModal.addEventListener("click", function (e) {
      if (e.target === cartModal) {
        closeCartModal();
      }
    });
  }

  // Checkout button
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkout);
  }

  // Clear cart button
  const clearCartBtn = document.getElementById("clear-cart-btn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart);
  }

  // Bug #10: Adding global error handler that might interfere with debugging
  window.addEventListener("error", function (e) {
    console.error("Global error caught:", e.error);
    // In production, this might send errors to analytics but here it just logs
    trackError(e.error); // This function doesn't exist
  });
}

function applyFilters() {
  const category = categoryFilter?.value || "";
  const maxPrice = parseInt(priceFilter?.value) || Infinity;
  const sortBy = sortFilter?.value || "name";

  // Filter products
  filteredProducts = products.filter((product) => {
    const matchesCategory = !category || product.category === category;
    const matchesPrice = product.price <= maxPrice;
    return matchesCategory && matchesPrice;
  });

  // Sort products
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Reset pagination
  currentPage = 1;

  // Display filtered products
  displayProducts();

  // Bug #11: Trying to update URL with undefined function
  try {
    updateURLParams(category, maxPrice, sortBy); // This function doesn't exist
  } catch (error) {
    console.warn("Failed to update URL parameters:", error.message);
  }
}

function loadMoreProducts() {
  if (isLoading) return;

  isLoading = true;
  loadMoreBtn.disabled = true;
  loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

  // Simulate API delay
  setTimeout(() => {
    currentPage++;
    displayProducts();

    isLoading = false;
    loadMoreBtn.disabled = false;
    loadMoreBtn.innerHTML = "Load More Products";
  }, 1000);
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) {
    console.error(`Product with ID ${productId} not found`);
    return;
  }

  // Check if product already in cart
  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  updateCartUI();
  saveCartToStorage();

  // Bug #12: Trying to track event with undefined analytics
  try {
    analytics.track("add_to_cart", {
      // analytics object doesn't exist
      product_id: productId,
      product_name: product.name,
      price: product.price,
    });
  } catch (error) {
    console.warn("Analytics tracking failed:", error.message);
  }

  // Show feedback (this works correctly)
  showNotification(`${product.name} added to cart!`);
}

function viewProduct(productId) {
  // Bug #13: Trying to access undefined router
  try {
    router.navigate(`/product/${productId}`); // router doesn't exist
  } catch (error) {
    console.warn("Navigation failed:", error.message);
    // Fallback behavior
    console.log(`Viewing product ${productId}`);
    showNotification("Product details feature coming soon!");
  }
}

function updateCartUI() {
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }

  updateCartModal();
}

function updateCartModal() {
  if (!cartItems || !cartTotal) return;

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<tr><td colspan="3" class="empty-state"><i class="fas fa-shopping-cart"></i><p>Your cart is empty</p></td></tr>';
    cartTotal.textContent = "0.00";
    return;
  }

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const cartItemRow = document.createElement("tr");
    cartItemRow.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${(item.price * item.quantity).toFixed(2)}</td>
    `;

    cartItems.appendChild(cartItemRow);
  });

  cartTotal.textContent = total.toFixed(2);
}

function sortTable(columnIndex, type) {
  let sortOrder = 1;
  const table = document.getElementById("cart-table");
  const currentSortOrder = table.getAttribute("data-sort-order") || "desc";

  if (table.getAttribute("data-sort-column") == columnIndex) {
    sortOrder = currentSortOrder === "asc" ? -1 : 1;
  }

  table.setAttribute("data-sort-column", columnIndex);
  table.setAttribute("data-sort-order", sortOrder === 1 ? "asc" : "desc");

  const rows = Array.from(cartItems.querySelectorAll("tr"));

  rows.sort((a, b) => {
    const aText = a.cells[columnIndex].innerText;
    const bText = b.cells[columnIndex].innerText;

    if (type === "number") {
      return (Number(aText.replace(/[^0-9.-]+/g, "")) - Number(bText.replace(/[^0-9.-]+/g, ""))) * sortOrder;
    } else {
      return aText.localeCompare(bText) * sortOrder;
    }
  });

  rows.forEach(row => cartItems.appendChild(row));
}

function openCartModal() {
  if (cartModal) {
    cartModal.style.display = "block";
    document.body.style.overflow = "hidden";

    // Bug #14: Trying to focus on potentially non-existent element
    const firstCartItem = cartModal.querySelector(".cart-item button");
    if (firstCartItem) {
      firstCartItem.focus();
    }
  }
}

function closeCartModal() {
  if (cartModal) {
    cartModal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

function checkout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!");
    return;
  }

  // Bug #15: Simulating payment processing that might fail
  const processingTimeout = setTimeout(() => {
    showNotification("Processing payment...");

    // Simulate random payment failure
    setTimeout(() => {
      if (Math.random() < 0.2) {
        // 20% failure rate
        console.error("Payment processing failed: Gateway timeout");
        showNotification("Payment failed. Please try again.");
        clearTimeout(processingTimeout);
      } else {
        showNotification("Order placed successfully!");
        clearCart();
        closeCartModal();
      }
    }, 2000);
  }, 500);

  // Bug #16: Not clearing the timeout in all cases
}

function clearCart() {
  cart.length = 0; // Correctly clear the global cart array

  updateCartUI();
  saveCartToStorage();

  showNotification("Cart cleared!");
}

function saveCartToStorage() {
  try {
    localStorage.setItem("techgear-cart", JSON.stringify(cart));
  } catch (error) {
    console.warn("Failed to save cart to localStorage:", error.message);
  }
}

function loadCartFromStorage() {
  try {
    const savedCart = localStorage.getItem("techgear-cart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartUI();
    }
  } catch (error) {
    console.warn("Failed to load cart from localStorage:", error.message);
    cart = [];
  }
}

function hideLoading() {
  if (loadingElement) {
    loadingElement.style.display = "none";
  }
}

function showNotification(message) {
  // Simple notification system
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 3000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Bug #17: Global variables that might conflict with other scripts
var globalProductCache = {};
var userPreferences = {};

// Bug #18: Polluting the global namespace
window.debugMode = true;
window.appVersion = "1.2.3";

// Bug #19: Inefficient search function that runs on every keystroke
function searchProducts(query) {
  // This would be called on every keystroke without debouncing
  console.log(`Searching for: ${query}`);

  // Simulate expensive operation
  for (let i = 0; i < 10000; i++) {
    Math.random(); // Wasteful computation
  }

  // Filter logic would go here
}

// Bug #20: Event listeners that aren't properly cleaned up
document.addEventListener("scroll", function () {
  // Try to access potentially undefined element
  const header = document.querySelector(".header");
  if (header && window.scrollY > 100) {
    header.classList.add("scrolled");
  }
});

// Initialize some data that might cause issues
setTimeout(() => {
  // Bug #21: Trying to access undefined nested properties
  try {
    const userLocation = window.navigator.geolocation.getCurrentPosition.coords; // Wrong way to access
    console.log("User location:", userLocation);
  } catch (error) {
    console.warn("Geolocation access failed:", error.message);
  }
}, 2000);

console.log("Script loaded successfully");
