import React from "react";
import { useState, useEffect } from "react";
import { Input, Button, Select, message } from "antd";
import axios from "axios";
import "./NoteForm.css";

function NoteForm({ note, onSuccess, onCancel }) {
  const [form, setForm] = useState({ title: "", text: "", bookTitle: "" });
  const [books, setBooks] = useState([]);

  // Recupero e impostazione dei dati iniziali
  useEffect(() => {
    setForm({
      title: note?.title || "",
      text: note?.text || "",
      bookTitle: note?.book ? note.book.id : "",
    });
  }, [note]);

  // Fetch dei libri da libreria
  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/library", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Verifica se la risposta contiene il campo 'volumeInfo.title' per ogni libro
      setBooks(
        res.data.library.map((book) => ({
          id: book.id,
          title: book.volumeInfo?.title || "Unknown Title",
          author: book.volumeInfo?.authors || "Unknown Author",
          cover: book.volumeInfo?.imageLinks?.thumbnail || "Unknown Cover",
        }))
      );
    };
    fetchBooks();
  }, []);

  // Gestione dell'invio del form
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const selectedBook = books.find((book) => book.id === form.bookTitle);

    try {
      if (note) {
        // Modifica una nota esistente
        await axios.put(
          `/api/notes/${note._id}`,
          {
            title: form.title,
            text: form.text,
            book: selectedBook || null,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Note updated");
      } else {
        // Crea una nuova nota
        await axios.post(
          "/api/notes",
          {
            title: form.title,
            text: form.text,
            bookTitle: form.bookTitle ? form.bookTitle : null,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Note created");
      }

      onSuccess(); // Chiudi il form e ricarica la lista
    } catch (err) {
      console.error("Error while saving:", err);
      message.error("Error while saving.");
    }
  };

  return (
    <>
      <Input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        style={{ marginBottom: 12 }}
      />
      <Input.TextArea
        rows={5}
        placeholder="Text"
        value={form.text}
        onChange={(e) => setForm({ ...form, text: e.target.value })}
        style={{ marginBottom: 12 }}
      />
      <Select
        placeholder="Connect to book (optional)"
        value={form.bookTitle || undefined} // Usa l'ID del libro (che è bookTitle) come valore
        onChange={(value) => setForm({ ...form, bookTitle: value })}
        allowClear
        style={{ width: "100%", marginBottom: 16 }}
      >
        {books.map((book) => (
          <Select.Option key={book.id} value={book.id}>
            {" "}
            {/* Usa l'ID del libro come value */}
            {book.title} {/* Usa il titolo del libro come label */}
          </Select.Option>
        ))}
      </Select>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </>
  );
}

export default NoteForm;
