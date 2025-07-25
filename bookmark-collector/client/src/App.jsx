import { useState, useEffect } from 'react';
import './index.css';

export default function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [newBookmark, setNewBookmark] = useState({
    title: '',
    url: '',
    category: 'general'
  });
  const [editingId, setEditingId] = useState(null);
  const [editBookmark, setEditBookmark] = useState({
    title: '',
    url: '',
    category: 'general'
  });

  useEffect(() => { fetchBookmarks(); }, []);

  const fetchBookmarks = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookmarks`);
    setBookmarks(await res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/bookmarks/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editBookmark)
      });
      setEditingId(null);
    } else {
      await fetch(`${import.meta.env.VITE_API_URL}/api/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookmark)
      });
    }
    setNewBookmark({ title: '', url: '', category: 'general' });
    fetchBookmarks();
  };

  const deleteBookmark = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/bookmarks/${id}`, {
      method: 'DELETE'
    });
    fetchBookmarks();
  };

  const startEditing = (bookmark) => {
    setEditingId(bookmark._id);
    setEditBookmark({
      title: bookmark.title,
      url: bookmark.url,
      category: bookmark.category
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  return (
    <div className="app">
      <h1>📚 Bookmark Manager</h1>
      
      <form onSubmit={handleSubmit} className="add-form">
        <input
          type="text"
          placeholder="Title"
          value={editingId ? editBookmark.title : newBookmark.title}
          onChange={(e) => editingId 
            ? setEditBookmark({...editBookmark, title: e.target.value})
            : setNewBookmark({...newBookmark, title: e.target.value})
          }
          required
        />
        <input
          type="url"
          placeholder="https://example.com"
          value={editingId ? editBookmark.url : newBookmark.url}
          onChange={(e) => editingId 
            ? setEditBookmark({...editBookmark, url: e.target.value})
            : setNewBookmark({...newBookmark, url: e.target.value})
          }
          required
        />
        <select
          value={editingId ? editBookmark.category : newBookmark.category}
          onChange={(e) => editingId 
            ? setEditBookmark({...editBookmark, category: e.target.value})
            : setNewBookmark({...newBookmark, category: e.target.value})
          }
        >
          <option value="general">General</option>
          <option value="work">Work</option>
          <option value="learning">Learning</option>
          <option value="tools">Tools</option>
        </select>
        <div className="form-actions">
          <button type="submit" className={editingId ? 'update-btn' : 'add-btn'}>
            {editingId ? 'Update' : 'Add'} Bookmark
          </button>
          {editingId && (
            <button type="button" onClick={cancelEditing} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bookmarks-list">
        {bookmarks.map((bookmark) => (
          <div key={bookmark._id} className="bookmark">
            <div className="bookmark-content">
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                <h3>{bookmark.title}</h3>
                <p>{bookmark.url}</p>
                <span className={`category ${bookmark.category}`}>
                  {bookmark.category}
                </span>
              </a>
            </div>
            <div className="bookmark-actions">
              <button 
                onClick={() => startEditing(bookmark)}
                className="edit-btn"
              >
                ✏️ Edit
              </button>
              <button 
                onClick={() => deleteBookmark(bookmark._id)}
                className="delete-btn"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Bookmark Manager by Shotayo Jubril</p>
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/privacy">Privacy</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}