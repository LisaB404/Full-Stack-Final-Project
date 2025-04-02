import React, { useState } from 'react';
import { Layout, Button } from 'antd';
import { PlusCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { fetchBooks } from '../hooks/useFetchBooks';
import Sidebar from '../components/Sidebar/Sidebar';
import Searchbar from '../components/Searchbar/Searchbar';
import BookDetails from '../components/BookDetails/BookDetails';
import { useLibrary } from '../hooks/LibraryContext';
import './Home.css';

const { Sider, Content } = Layout;

function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [books, setBooks] = useState([]); // Stato per i risultati della ricerca
  const [searchMade, setSearchMade] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0); // Indice iniziale per l'API
  const [query, setQuery] = useState(""); // Memorizza l'ultima ricerca
  const [hasMore, setHasMore] = useState(true); // Stato per verificare se ci sono altri risultati
  const booksPerPage = 10; // Numero di libri per pagina

    // Usa il contesto della libreria
    const { addBook } = useLibrary();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Funzione per gestire la ricerca iniziale
  const handleSearch = async (searchQuery) => {
    setSearchMade(true);
    setIsLoading(true);
    setQuery(searchQuery);  // Salva la query attuale
    setStartIndex(0);       // Resetta l'indice per una nuova ricerca
    setHasMore(true);       // Nuova ricerca: reset di "hasMore"
    const results = await fetchBooks(searchQuery, 0, booksPerPage);
    setBooks(results);
    // Se i risultati ottenuti sono inferiori a booksPerPage, non ci sono altri libri da caricare
    if (results.length < booksPerPage) {
      setHasMore(false);
    }
    setIsLoading(false);
  };

  // Funzione per caricare la pagina successiva (Load More)
  const fetchNextPage = async () => {
    const newStartIndex = startIndex + booksPerPage;
    setIsLoading(true);
    const newResults = await fetchBooks(query, newStartIndex, booksPerPage);
    if (newResults.length === 0) {
      setHasMore(false);
    }
    setBooks([...books, ...newResults]); // Aggiungi i nuovi risultati senza sovrascrivere quelli esistenti
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
              {/* Mostra loader se in caricamento */}
              {isLoading && (
                <div className="loading-container">
                  <LoadingOutlined className="loading" style={{ fontSize: 24 }} spin />
                  <p>Loading books...</p>
                </div>
              )}

              {/* Se la ricerca è stata fatta e non ci sono risultati */}
              {!isLoading && searchMade && books.length === 0 && (
                <p>Sorry! No book found.</p>
              )}

              {/* Visualizza i libri se ci sono risultati */}
              {!isLoading &&
                books.length > 0 &&
                books.map((book) => {
                  const { id, volumeInfo } = book;
                  const { title, authors, imageLinks } = volumeInfo;
                  return (
                    <div key={id} className="book">
                      <img
                        src={
                          imageLinks?.thumbnail ||
                          '../assets/img/bookcover.png'
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
                        {/* Quando si clicca ADD, aggiungiamo il libro alla libreria */}
                        <Button type="primary" onClick={() => addBook(book)}>
                          <PlusCircleOutlined /> Add
                        </Button>                   
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Se la ricerca è stata fatta e ci sono risultati */}
            {searchMade && books.length > 0 && (
              <div className="pagination">
                {hasMore ? (
                  <Button onClick={fetchNextPage} className='load-btn'>Load More</Button>
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