import React, { createContext, useState, useContext } from 'react';

const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState([]);

  // Funzione per aggiungere un libro alla libreria
  const addBook = async (book) => {
    try {
      const token = localStorage.getItem('token'); // supponendo che il token sia salvato nel localStorage
      if (!token) {
        console.error("Token mancante, effettua il login.");
        return;
      }
      
      const response = await fetch('/api/library/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ book })
      });

      const data = await response.json();
      if (response.ok) {
        // Aggiorna lo stato locale con il libro aggiunto
        setLibrary(prev => [...prev, book]);
      } else {
        // Gestisci errori (ad esempio, mostrare un messaggio all’utente)
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const fetchLibrary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/library', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setLibrary(data.library);
      }
    } catch (error) {
      console.error('Error fetching library:', error);
    }
  };


// TO REMOVE BOOK FROM LIBRARY
const removeBook = async (bookId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/library/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bookId })
    });

    const data = await response.json();
    if (response.ok) {
      // Aggiorna la libreria locale rimuovendo il libro
      setLibrary(prevLibrary => prevLibrary.filter(book => book.id !== bookId));
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error('Error removing book:', error);
  }
};

  return (
    <LibraryContext.Provider value={{ library, addBook, removeBook, fetchLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
};

// Hook per usare il contesto
export const useLibrary = () => useContext(LibraryContext);