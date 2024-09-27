import React, { useState, useEffect } from 'react';
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

  // Fetch all contacts
  const fetchContacts = async () => {
    try {
      const response = await fetch(`${baseURL}/contacts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setContacts(data.data);
      } else {
        console.error('Failed to fetch contacts');
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // Add new contact
  const addContact = async () => {
    if (!name || !email || !imgUrl) {
      alert('All fields are required!');
      return;
    }

    const newContact = {
      name: name,
      email: email,
      img_url: imgUrl
    };

    try {
      const response = await fetch(`${baseURL}/contacts/new`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newContact)
      });

      const data = await response.json();
      if (data.success) {
        setName('');
        setEmail('');
        setImgUrl('');
        fetchContacts();
      } else {
        console.error('Failed to add contact');
      }
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  // Delete contact by id
  const deleteContact = async (id) => {
    try {
      const response = await fetch(`${baseURL}/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchContacts();
      } else {
        console.error('Failed to delete contact');
      }
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
