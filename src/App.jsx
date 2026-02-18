import { Routes, Route } from 'react-router-dom';
import SearchPage from './SearchPage';
import FavPage from './FavPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} /> {/* 👈 Add this */}
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/favorites" element={<FavPage />} />
      </Routes>
    </>
  );
}
export default App;