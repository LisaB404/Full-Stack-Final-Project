import React, { useState, useEffect } from "react";
import { Layout, Button, Card, List, Popconfirm, message, Drawer } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import Sidebar from "../components/Sidebar/Sidebar";
import NoteForm from "../components/NoteForm/NoteForm";
import './Notes.css'

const { Sider, Content } = Layout;

function Notes() {
  const [collapsed, setCollapsed] = useState(false);
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const fetchNotes = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("/api/notes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes(res.data);
  };

  const deleteNote = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`/api/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    message.success("Nota eliminata");
    fetchNotes();
  };

  const handleNewNote = () => {
    setEditingNote(null);
    setDrawerOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setDrawerOpen(true);
  };

  const handleFormSubmit = () => {
    setDrawerOpen(false);
    setEditingNote(null);
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Layout>
      <Sider
        className="sider"
        collapsed={collapsed}
        collapsible
        trigger={null}
        width={180}
        collapsedWidth={60}
      >
        <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
      </Sider>
      <Layout>
        <Content className="content">
          <div className="notes-container">
            <div className="header">
              <h2 className="title">
                <span className="gradient-text">Your Notes</span>
              </h2>
              <Button type="primary" onClick={handleNewNote}>
                <PlusOutlined /> New Note
              </Button>
            </div>

            <List
              grid={{ gutter: 16, column: 2 }}
              dataSource={notes}
              renderItem={(note) => (
                <List.Item>
                  <Card
                    title={note.title}
                    extra={
                      <>
                        <EditOutlined
                          style={{
                            marginRight: 12,
                            color: "blue",
                            cursor: "pointer",
                          }}
                          onClick={() => handleEditNote(note)}
                        />
                        <Popconfirm
                          title="Sei sicuro di voler eliminare questa nota?"
                          onConfirm={() => deleteNote(note._id)}
                        >
                          <DeleteOutlined
                            style={{ color: "red", cursor: "pointer" }}
                          />
                        </Popconfirm>
                      </>
                    }
                  >
                    <p className="note-text">{note.text}</p>
                    {note.book ? (
                      <p className="note-book">
                        <strong>Libro:</strong> {note.book.title}
                      </p>
                    ) : null}
                  </Card>
                </List.Item>
              )}
            />
          </div>

          <Drawer
            title={editingNote ? "Modifica Nota" : "Nuova Nota"}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            width={480}
            destroyOnClose
          >
            <NoteForm
              note={editingNote}
              onSuccess={handleFormSubmit}
              onCancel={() => setDrawerOpen(false)}
            />
          </Drawer>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Notes;
