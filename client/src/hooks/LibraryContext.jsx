import React, { createContext, useState, useContext } from 'react';

const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState([]);

  // Funzione per aggiungere un libro alla libreria
  const addBook = (book) => {
    // Evitiamo duplicati (opzionale)
    setLibrary((prev) => {
      if (!prev.find((b) => b.id === book.id)) {
        return [...prev, book];
      }
      return prev;
    });
  };

  return (
    <LibraryContext.Provider value={{ library, addBook }}>
      {children}
    </LibraryContext.Provider>
  );
};

// Hook per usare il contesto
export const useLibrary = () => useContext(LibraryContext);