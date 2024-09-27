import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = import.meta.env.VITE_BEARER_TOKEN;

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${baseURL}/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(response.data.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const addContact = async () => {
    if (!name || !email || !imgUrl) {
      alert('All fields are required!');
      return;
    }

    try {
      await axios.post(`${baseURL}/contacts/new`, {
        name,
        email,
        img_url: imgUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setName('');
      setEmail('');
      setImgUrl('');
      fetchContacts();
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`${baseURL}/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <main className="main_container">
      <h1 className="main_container-heading">Contact Apps</h1>
      <section className="main_container_add_contact">
        <h2>Add New Contact</h2>
        <div className="container_add_contact">
          <input
            className="form"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <input
            className="form"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="form"
            type="text"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            placeholder="Image URL"
          />
          <button onClick={addContact} className="button1">Add</button>
        </div>
      </section>
      <section className="main_container_contact_list">
        <h2>Contact List</h2>
        <div id="contact">
          {contacts.map((contact) => (
            <div className="contact_card" key={contact.id}>
              <div className="contact_info">
                <img
                  src={contact.img_url || 'https://via.placeholder.com/50'}
                  alt={contact.name}
                  className="contact_img"
                />
                <div className="contact_info_text">
                  <h3>{contact.name}</h3>
                  <p>{contact.email}</p>
                </div>
              </div>
              <button
                className="delete_button"
                onClick={() => deleteContact(contact.id)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default App;
