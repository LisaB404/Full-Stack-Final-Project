import React, { useState } from "react";
import { Layout, Button } from "antd";
import { PlusCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { fetchBooks } from "../../hooks/useFetchBooks";
import Sidebar from "../../components/Sidebar/Sidebar";
import Searchbar from "../../components/Searchbar/Searchbar";
import BookDetails from "../../components/BookDetails/BookDetails";
import { useLibrary } from "../../hooks/LibraryContext";
import "./Home.css";

const { Sider, Content } = Layout;

function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [books, setBooks] = useState([]); // State for book results
  const [searchMade, setSearchMade] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0); // API initial index
  const [query, setQuery] = useState(""); // Memorize last search
  const [hasMore, setHasMore] = useState(true); // Check if there are other results
  const booksPerPage = 10;

  // Library context
  const { addBook } = useLibrary();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Function for initial search
  const handleSearch = async (searchQuery) => {
    setSearchMade(true);
    setIsLoading(true);
    setQuery(searchQuery); // save query
    setStartIndex(0); // reset index for new search
    setHasMore(true); // new search: reset hasMore results
    const results = await fetchBooks(searchQuery, 0, booksPerPage);
    setBooks(results);
    // If there are fewer results than booksPerPage, there are no more books to display
    if (results.length < booksPerPage) {
      setHasMore(false);
    }
    setIsLoading(false);
  };

  // Load more books
  const fetchNextPage = async () => {
    const newStartIndex = startIndex + booksPerPage;
    setIsLoading(true);
    const newResults = await fetchBooks(query, newStartIndex, booksPerPage);
    if (newResults.length === 0) {
      setHasMore(false);
    }
    setBooks([...books, ...newResults]); // Add new results to the existing ones
    setStartIndex(newStartIndex);
    setIsLoading(false);
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
          <div className="home-container">
            <h1 className="title">
              <span className="gradient-text">The Wonderland of Books</span>
            </h1>
            <p>Find books and add them to your Library.</p>
            <Searchbar onSearch={handleSearch} />

            <div className="books-container">
              {/* Display loader */}
              {isLoading && (
                <div className="loading-container">
                  <LoadingOutlined
                    className="loading"
                    style={{ fontSize: 24 }}
                    spin
                  />
                  <p>Loading books...</p>
                </div>
              )}

              {/* Search completed but with no results */}
              {!isLoading && searchMade && books.length === 0 && (
                <p>Sorry! No book found.</p>
              )}

              {/* Render books found */}
              {!isLoading &&
                books.length > 0 &&
                books.map((book) => {
                  const { id, volumeInfo } = book;
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
                        {/* Add book to library */}
                        <Button type="primary" className="book-btn" onClick={() => addBook(book)}>
                          <PlusCircleOutlined /> Add
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {searchMade && books.length > 0 && (
              <div className="pagination">
                {hasMore ? (
                  <Button onClick={fetchNextPage} className="load-btn">
                    Load More
                  </Button>
                ) : (
                  <p>No more results to show.</p>
                )}
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Home;
