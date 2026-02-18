import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'; // 👈 Import Toast

function FavPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  const removeFavorite = (id) => {
    // 1. Filter out the item with the matching ID
    const updatedFavs = favorites.filter((fav) => fav.id !== id);
    
    // 2. Update UI instantly
    setFavorites(updatedFavs);
    
    // 3. Update LocalStorage
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));

    // 4. Show Notification
    toast.error("Removed from favorites!", {
      style: { background: '#333', color: '#fff' },
      icon: '🗑️'
    });
  };

  return (
    <div className="fav-main">
      <h1 className="fav-title">My Favorite Developers</h1>
      <Link to="/" className="fav-back-link">⬅️ Go Back to Search</Link>
      
      <div className="fav-list">
        {favorites.length === 0 && (
          <p style={{ color: "#ccc", gridColumn: "1/-1", fontSize: "1.2rem" }}>
            No favorites yet. Go search and save some! 🕵️‍♂️
          </p>
        )}
        
        {favorites.map(fav => (
          <div key={fav.id} className="fav-card">
            <img src={fav.avatar_url} className="fav-avatar" alt={fav.login} />
            <div className="fav-login">{fav.login}</div>
            
            {/* REMOVE BUTTON */}
            <button 
              className="remove-btn" 
              onClick={() => removeFavorite(fav.id)}
            >
              Remove ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavPage;