import React from "react";
import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import "./Searchbar.css";

function Searchbar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Find a book..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="search-btn" onClick={handleSearch}>
          <SearchOutlined />
        </button>
      </div>
    </>
  );
}

export default Searchbar;
