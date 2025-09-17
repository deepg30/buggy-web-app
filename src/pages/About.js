import React, { useState, useEffect } from "react";

function About() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Bug #19: Direct state mutation
  const addUser = () => {
    const newUser = { id: Date.now(), name: "New User" };
    users.push(newUser); // Direct mutation - should use setUsers
    setUsers(users); // This won't trigger re-render properly
  };

  // Bug #20: Race condition in useEffect
  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        if (!cancelled) {
          // Bug #21: Setting state after component might be unmounted
          setUsers([
            { id: 1, name: "John Doe", age: 30 },
            { id: 2, name: "Jane Smith", age: 25 },
            { id: 3, name: "Bob Johnson", age: 35 },
          ]);
          setLoading(false);
        }
      }, 2000);
    };

    fetchUsers();

    // Bug #22: Missing cleanup function return
    // return () => { cancelled = true; };
  }, []);

  // Bug #23: Stale closure bug
  const handleUserClick = (user) => {
    setTimeout(() => {
      // This might reference stale state
      console.log("Selected user:", selectedUser); // Might log previous value
      setSelectedUser(user);
    }, 1000);
  };

  // Bug #24: Incorrect dependency array causing potential issues
  useEffect(() => {
    if (selectedUser) {
      console.log("User selected:", selectedUser.name);
    }
  }, [selectedUser && selectedUser.id]); // Bug: This dependency is problematic but won't crash

  // Bug #25: Memory leak - event listener not cleaned up
  useEffect(() => {
    const handleScroll = () => {
      console.log("Scrolling...");
    };

    window.addEventListener("scroll", handleScroll);
    // Missing cleanup
  }, []);

  // Bug #26: Async operation without proper error handling
  const deleteUser = async (userId) => {
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    }); // No error handling - will cause unhandled promise rejection

    // Bug #27: Assuming operation succeeded without checking
    setUsers(users.filter((user) => user.id !== userId));
  };

  return (
    <div className="about">
      <h2>About Our Buggy Team</h2>

      {loading && <p>Loading users...</p>}

      <button onClick={addUser}>Add User (Buggy)</button>

      <div className="users-list">
        {users.map((user) => (
          <div
            key={user.id}
            className="user-card"
            onClick={() => handleUserClick(user)}
          >
            <h3>{user.name}</h3>
            <p>Age: {user.age}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteUser(user.id);
              }}
            >
              Delete (Buggy)
            </button>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="selected-user">
          <h3>Selected User:</h3>
          <p>
            {selectedUser.name} - {selectedUser.age} years old
          </p>
          {/* Bug #29: Accessing undefined property with fallback */}
          <p>
            Email:{" "}
            {selectedUser.email
              ? selectedUser.email.toLowerCase()
              : "No email (Bug #29)"}
          </p>
        </div>
      )}

      {/* Bug #30: Rendering with type checking to prevent crash */}
      <div className="user-count">
        <p>Total users: {users.length}</p>
        {/* Bug: This logic is flawed but won't crash */}
        <p>
          User names:{" "}
          {Array.isArray(users)
            ? users.map((u) => u.name).join(", ")
            : "Error: users is not an array (Bug #30)"}
        </p>
      </div>
    </div>
  );
}

export default About;
