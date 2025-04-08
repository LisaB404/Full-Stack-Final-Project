import React from "react";
import { useState, useEffect } from "react";
import { Input, Button, Select, message } from "antd";
import axios from "axios";
import "./NoteForm.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function NoteForm({ note, onSuccess, onCancel }) {
  const [form, setForm] = useState({ title: "", text: "", bookTitle: "" });
  const [books, setBooks] = useState([]);

  // Fetch initial data
  useEffect(() => {
    setForm({
      title: note?.title || "",
      text: note?.text || "",
      bookTitle: note?.book ? note.book.id : "",
    });
  }, [note]);

  // Fetch books from library
  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BACKEND_URL}/api/library`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Check if response has required data
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

  // Handle form submit
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const selectedBook = books.find((book) => book.id === form.bookTitle);

    try {
      if (note) {
        // Change existing note
        await axios.put(
          `${BACKEND_URL}/api/notes/${note._id}`,
          {
            title: form.title,
            text: form.text,
            book: selectedBook || null,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Note updated");
      } else {
        // Create new note
        await axios.post(
          `${BACKEND_URL}/api/notes`,
          {
            title: form.title,
            text: form.text,
            book: selectedBook || null,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Note created");
      }

      onSuccess(); // Close the form and reload
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
        value={form.bookTitle || undefined}
        onChange={(value) => setForm({ ...form, bookTitle: value })}
        allowClear
        style={{ width: "100%", marginBottom: 16 }}
      >
        <Select.Option value="">-- No book selected --</Select.Option>
        {books.map((book) => (
          <Select.Option key={book.id} value={book.id}>
            {book.title} {/* Mostra solo il titolo del libro */}
          </Select.Option>
        ))}
      </Select>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button className="note-btn" type="primary" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="note-btn" type="primary" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </>
  );
}

export default NoteForm;
