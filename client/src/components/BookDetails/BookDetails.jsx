import React from "react";
import { useState } from "react";
import { Button, Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { fetchBookDetails } from "../../hooks/useFetchBooks";
import "./BookDetails.css";

function BookDetails({ bookId, title }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpenModal = async () => {
    setModalOpen(true);
    setLoading(true);
    try {
      // API request for book details
      const details = await fetchBookDetails(bookId);
      setBookDetails(details);
    } catch (error) {
      console.error("Error while loading book details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Remove tag HTML from description
  const descriptionHTML = bookDetails?.volumeInfo?.description;
  const plainText = descriptionHTML
    ? descriptionHTML.replace(/<[^>]*>/g, "")
    : "Description not available.";

  return (
    <div className="details-container">
      <Button type="primary" className="book-btn" onClick={handleOpenModal}>
        <InfoCircleOutlined />
        Details
      </Button>
      <Modal
        title={title}
        centered
        open={modalOpen}
        footer={null} //remove btns ok, cancel
        onCancel={() => setModalOpen(false)}
      >
        {loading && <p>Loading...</p>}
        {!loading && bookDetails && <p className="description">{plainText}</p>}
      </Modal>
    </div>
  );
}

export default BookDetails;
