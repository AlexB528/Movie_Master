import React, { useState } from 'react';

const Navbar = () => {
  const [user, setUser] = useState(null);

  const signIn = () => {
    // Placeholder for sign in logic
    setUser({ name: 'John Doe' });
  };

  const signOut = () => {
    // Placeholder for sign out logic
    setUser(null);
  };

  return (
    <nav className="navbar">
      <h1>Movie Master</h1>
      <div className="menu">
        {user ? (
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <button onClick={signOut} className="sign-out-button">Sign Out</button>
          </div>
        ) : (
          <button onClick={signIn} className="sign-in-button">Sign In</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
