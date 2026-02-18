import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function SearchPage() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(""); // Input field
  const [userdata, setUserData] = useState(null); // Data store 
  const [error, setError] = useState(null);
  const [repos, setRepos] = useState([])
  const [favorites, setFavorites] = useState([]);

  // When load first time, get "favs" from storage
useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("favorites")) || [];
  setFavorites(saved);
}, []); // Empty array means runs only when page is load

  useEffect(() => {
    // If input is empty dont Fetch
    // If input is empty, clear data and don't fetch
  if (!search) {
    setUserData(null);
    setRepos([]);
    setError(null);
    return;
  }

   const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    // 1. Fetch User Data
    const userRes = await fetch(`https://api.github.com/users/${search}`);
    if (!userRes.ok) throw new Error("User Not Found!");
    const userData = await userRes.json();
    setUserData(userData);

    // 2. Fetch Repos 
    try {
      const repoRes = await fetch(`https://api.github.com/users/${search}/repos?sort=created&per_page=5`);
      if (!repoRes.ok) throw new Error(); // Error only for repos
      const repoData = await repoRes.json();
      setRepos(repoData);
    } catch (repoErr) {
    
      setRepos([]); // Empty the repo so the olds user's ones not show
    }

  } catch (err) {
    setUserData(null);
    setRepos([]);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

    // Debouncing logic (setTimeout)
    const timer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer); // Cleanup!
  }, [search]);

// ADD TO FAV BUTTON 
const addFavorite = () => {
  if (!userdata) return;
  // GET Old saved Fav's
  const currentFavs = JSON.parse(localStorage.getItem("favorites")) || []
// Check Duplication
const exists = currentFavs.find(f => f.id === userdata.id)
if (!exists) {
  // Made a new array and Save it
  const updated = [...currentFavs, {id: userdata.id, login: userdata.login, avatar_url: userdata.avatar_url}]
  localStorage.setItem("favorites", JSON.stringify(updated));
  setFavorites(updated);
 toast.success('Successfully saved to favorites!', {
      style: { background: '#333', color: '#fff' },
    }); 
  } else {
    toast.error('Already in your favorites!', {
      style: { background: '#333', color: '#fff' },
    });
  }
}



  return (
 <div style={{textAlign: "center", color: "white" }}>

<nav style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
        <h1  className="my-header">Github User Finder</h1>
        <Link to="/favorites" style={{ color: "gold", fontWeight: "bold" }} className="nav-btn">
          View Favorites ➡️
        </Link>
      </nav>
<input 
type="text"
placeholder="Type username..."
onChange={(e) => setSearch(e.target.value)}
        style={{color: "#fafafa" }}
        />
        {loading && <p>Searching...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

{userdata && (
  <>
    {/* User Info Section */}
    <div style={{ marginTop: "20px" }}>
      <img
        src={userdata.avatar_url}
        width="150"
        style={{ borderRadius: "50%" }}
        alt={userdata.login}
        className="user-avatar"
      />
      <button onClick={addFavorite} className="fav-btn">
  ⭐ Save Favorite
</button>
      <h2>{userdata.name || userdata.login}</h2>
      <p className="bio">{userdata.bio}</p>
      <p className="repo-count">Repos: {userdata.public_repos}</p>
    </div>

    {/* Repositories Section */}
    <div style={{ marginTop: "20px", textAlign: "left" }} className="repo-card">
      <h3>Latest Repositories:</h3>
      {repos.length > 0 ? (
        repos.map((repo) => (
          <div
            key={repo.id}
            style={{
              border: "1px solid gray",
              margin: "10px 0",
              padding: "10px",
            }}
          >
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "lightblue" }}
            >
              {repo.name}
            </a>
            <p>{repo.description || "No description available"}</p>
          </div>
        ))
      ) : (
        <p>No repos found for this user.</p>
      )}
    </div>
  </>
)}




 </div>
  );
}
export default SearchPage;