import React, { createContext, useState, useContext } from "react";

const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState([]);

  // ADD BOOK TO LIBRARY
  const addBook = async (book) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token mancante, effettua il login.");
        return;
      }

      const response = await fetch("/api/library/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book }),
      });

      const data = await response.json();
      if (response.ok) {
        // Update library with added book
        setLibrary((prev) => [...prev, book]);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const fetchLibrary = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/library", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setLibrary(data.library);
      }
    } catch (error) {
      console.error("Error fetching library:", error);
    }
  };

  // REMOVE BOOK FROM LIBRARY
  const removeBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/library/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId }),
      });

      const data = await response.json();
      if (response.ok) {
        // Remove book and update local library
        setLibrary((prevLibrary) =>
          prevLibrary.filter((book) => book.id !== bookId)
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error removing book:", error);
    }
  };

  return (
    <LibraryContext.Provider
      value={{ library, addBook, removeBook, fetchLibrary }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

// Hook to use context
export const useLibrary = () => useContext(LibraryContext);
