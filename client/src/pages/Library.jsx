import React, { useState } from "react";
import { Layout } from "antd";
import { useLibrary } from '../hooks/LibraryContext';
import './Library.css';
import Sidebar from '../components/Sidebar/Sidebar';
import './Library.css'

const {Sider, Content} = Layout

function Library() {
  // Definiamo lo stato per gestire il collapse del Sidebar
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);

  // Recuperiamo la libreria dal contesto
  const { library } = useLibrary();

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
          <div className="container">
            <h2 className="title">
              <span className="gradient-text">Your Library</span>
            </h2>
            {library.length === 0 ? (
              <p>Your library is empty. Add some books from the Home page!</p>
            ) : (
              <div className="books-container">
                {library.map((book) => {
                  // Estraiamo id e volumeInfo dal libro
                  const { id, volumeInfo } = book;
                  // Da volumeInfo estraiamo title, authors e imageLinks
                  const { title, authors, imageLinks } = volumeInfo;
                  return (
                    <div key={id} className="book">
                      <img
                        src={
                          imageLinks?.thumbnail ||
                          "../../public/assets/img/bookcover.png"
                        }
                        alt={title}
                      />
                      <div className="book-info">
                        <p className="book-title">{title}</p>
                        <p className="book-author">
                          {authors ? authors.join(", ") : "Unknown"}
                        </p>
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

  
  export default Library