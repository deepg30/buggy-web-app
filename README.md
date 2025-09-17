# Buggy Web - React Testing Site

A React website intentionally filled with bugs for testing bug reporting and monitoring tools.

## Overview

This project contains a simple React application with multiple pages, each containing various types of intentional bugs and errors. It's designed to help test bug reporting tools, error monitoring systems, and debugging workflows.

## Bug Types Included

### JavaScript Errors
- **TypeErrors**: Accessing properties of null/undefined objects
- **ReferenceErrors**: Using undefined variables and functions
- **Range Errors**: Array/string method misuse
- **Logic Errors**: Incorrect conditional statements and loops

### React-Specific Issues
- **State Management Bugs**: Direct state mutations, stale closures
- **Hook Dependency Issues**: Missing or incorrect useEffect dependencies
- **Performance Issues**: Unnecessary re-renders, memory leaks
- **Component Bugs**: Missing keys in lists, improper event handling

### Form Validation Issues
- **Input Validation**: Incorrect regex patterns, missing null checks
- **Async Handling**: Unhandled promise rejections, race conditions
- **User Experience**: Form submission without preventDefault

### Rendering Problems
- **Conditional Rendering**: Null reference errors in JSX
- **List Rendering**: Missing key props, array method errors
- **Data Handling**: Type coercion issues, mixed data types

## Pages and Their Bugs

### Home Page (`/`)
- Undefined property access
- Function call on non-function values
- useEffect dependency issues
- Division by zero errors

### About Page (`/about`)
- Direct state mutations
- Memory leaks (event listeners not cleaned up)
- Race conditions in async operations
- Stale closure bugs

### Contact Page (`/contact`)
- Form validation errors
- Missing preventDefault on form submission
- Incorrect error state management
- API call without error handling

### Products Page (`/products`)
- Missing key props in lists
- Null/undefined handling in filters and sorts
- Performance issues with functions in render
- Type coercion errors

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd buggy-web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Build

To build for production:
```bash
npm run build
```

## Usage for Testing

This application is perfect for:
- Testing error monitoring tools (Sentry, Bugsnag, etc.)
- Debugging workflow training
- Frontend testing automation
- Code review exercises

## Warning

⚠️ **This code contains intentional bugs and should NOT be used in production!**

All bugs are intentional and documented for educational and testing purposes.

## Bug Catalog

The application contains approximately 60+ intentional bugs across different categories:
- Runtime errors (TypeErrors, ReferenceErrors)
- Logic errors
- Performance issues
- React anti-patterns
- Form handling problems
- State management issues

## Contributing

If you'd like to add more bug examples or improve the existing ones, please:
1. Fork the repository
2. Create a feature branch
3. Add your bugs with clear comments
4. Submit a pull request

## License

MIT License - Feel free to use this for educational and testing purposes.
