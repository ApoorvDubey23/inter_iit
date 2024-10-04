import React, { createContext, useState } from 'react';

// Create the context
export const ModeContext = createContext();

// Create a provider component
export const ModeProvider = ({ children }) => {
  const [isComparing, setIsComparing] = useState(false); // Comparison mode state

  // Function to toggle comparison mode
  

  return (
    <ModeContext.Provider value={{ isComparing, setIsComparing }}>
      {children}
    </ModeContext.Provider>
  );
};
