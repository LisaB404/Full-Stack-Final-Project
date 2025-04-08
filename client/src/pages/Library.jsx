import React, { useState, useEffect } from "react";
import { Layout, Button } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import { useLibrary } from "../hooks/LibraryContext";
import "./Library.css";
import Sidebar from "../components/Sidebar/Sidebar";
import BookDetails from "../components/BookDetails/BookDetails";
import "./Library.css";

const { Sider, Content } = Layout;

function Library() {
  // State to handle Sidebar collapse
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = () => setCollapsed(!collapsed);

  // Get library from context
  const { library, fetchLibrary, removeBook } = useLibrary();

  // API request
  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  // To remove books from library
  const handleRemove = (bookId) => {
    removeBook(bookId);
  };

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
          <div className="library-container">
            <h2 className="title">
              <span className="gradient-text">Your Library</span>
            </h2>
            {library.length === 0 ? (
              <p>Your library is empty. Add some books from the Home page!</p>
            ) : (
              <div className="books-container">
                {library.map((book) => {
                  // Get id and volumeInfo from book
                  const { id, volumeInfo } = book;
                  // Extract title, authors e imageLinks
                  const { title, authors, imageLinks } = volumeInfo;

                  return (
                    <div key={id} className="book">
                      <img
                        src={
                          imageLinks?.thumbnail || "../assets/img/bookcover.png"
                        }
                        alt={title}
                      />
                      <div className="book-info">
                        <p className="book-title">{title}</p>
                        <p className="book-author">
                          {authors ? authors.join(", ") : "Unknown"}
                        </p>
                      </div>
                      <div className="book-btns">
                        <BookDetails bookId={id} title={title} />
                        {/* Remove book from library */}
                        <Button
                          type="primary"
                          className="book-btn"
                          onClick={() => handleRemove(id)}
                        >
                          <MinusCircleOutlined /> Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Library;
