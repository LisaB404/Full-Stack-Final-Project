import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

export async function fetchBooks(query, startIndex = 0, maxResults = 10) {
  try {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&langRestrict=en&key=${API_KEY}&maxResults=${maxResults}&startIndex=${startIndex}`;
    const response = await axios.get(apiUrl);
    return response.data.items || [];
  } catch (error) {
    console.error("Error while fetching books:", error);
    return [];
  }
}

export async function fetchBookDetails(bookId) {
  const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
  
  try {
      const response = await axios.get(apiUrl);
      return response.data;
  } catch (error) {
      console.error('Errore nel recupero dei dettagli del libro:', error);
      throw error;
  }
}
