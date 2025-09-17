import React, { useState, useRef } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();

  // Bug #31: Improper form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Bug #32: Using regex incorrectly
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!formData.email.match(emailRegex)) {
      newErrors.email = 'Invalid email';
    }
    
    // Bug #33: Not checking for null/undefined before calling string methods
    if (formData.name.trim().length < 2) { // Will error if name is null
      newErrors.name = 'Name too short';
    }
    
    // Bug #34: Logic error in validation
    if (formData.message || formData.message.length > 500) { // Should be AND, not OR
      newErrors.message = 'Message is required and must be less than 500 characters';
    }
    
    return newErrors;
  };

  // Bug #35: Not preventing default form submission
  const handleSubmit = async (e) => {
    // e.preventDefault(); // Commented out - will cause page reload
    
    setIsSubmitting(true);
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Bug #36: Hardcoded URL that doesn't exist
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      // Bug #37: Not checking if response is ok
      const result = await response.json(); // Will error if response is not JSON
      
      alert('Message sent successfully!');
      
      // Bug #38: Resetting form incorrectly
      setFormData({}); // Missing required properties
      
    } catch (error) {
      // Bug #39: Generic error handling
      alert('Something went wrong!'); // Not user-friendly
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bug #40: Missing null check in input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Bug #41: Clearing errors incorrectly
    if (errors[name]) {
      setErrors(prev => {
        delete prev[name]; // Direct mutation
        return prev; // Doesn't trigger re-render
      });
    }
  };

  // Bug #42: Using DOM manipulation instead of React state
  const clearForm = () => {
    formRef.current.reset(); // DOM manipulation
    // Not updating React state
  };

  // Bug #43: Potential infinite loop
  const [submitCount, setSubmitCount] = useState(0);
  React.useEffect(() => {
    if (submitCount > 0) {
      setSubmitCount(submitCount + 1); // Infinite loop
    }
  }, [submitCount]);

  return (
    <div className="contact">
      <h2>Contact Us</h2>
      <p>Send us a message (warning: form has bugs!)</p>
      
      <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="5"
            className={errors.message ? 'error' : ''}
          ></textarea>
          {errors.message && <span className="error-text">{errors.message}</span>}
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          <button type="button" onClick={clearForm}>
            Clear Form (Buggy)
          </button>
        </div>
      </form>
      
      {/* Bug #44: Displaying sensitive information */}
      <div className="debug-info">
        <h3>Debug Info (Should not be visible in production):</h3>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
        <p>Submit count: {submitCount}</p>
      </div>
    </div>
  );
}

export default Contact;
