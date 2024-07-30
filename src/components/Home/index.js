import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./index.css";

const access_key = "FqYyFu5zeEe_G5Bg0XOepCbmjP1Nc4fdYfRpREwK3mc";
const categories = [
  { displayText: "Mountain", key: "mountain" },
  { displayText: "Flowers", key: "flowers" },
  { displayText: "Beaches", key: "beaches" },
  { displayText: "Cities", key: "cities" },
];

const Home = () => {
  const [searchInput, setSearchInput] = useState("");
  const [photos, setPhotos] = useState([]);
  const [category, setCategory] = useState(categories[0].key);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredPhoto, setHoveredPhoto] = useState(null);

  const fetchResults = async (query) => {
    if (!query) return setPhotos([]);

    setLoading(true);
    setError(null);
    try {
      const url = `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${access_key}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch photos");
      const data = await response.json();
      setPhotos(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(category);
  }, [category]);

  useEffect(() => {
    if (searchInput.length > 0) {
      fetchResults(searchInput);
    } else {
      setCategory(categories[0].key);
      fetchResults(categories[0].key);
    }
  }, [searchInput]);

  return (
    <div className='home-container'>
      <h1 className='heading'>Fetching Photos From Unsplash</h1>
      <div className='input-container'>
        <input
          type='text'
          placeholder='Search..'
          className='input'
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
        />
        <FaSearch className='icon' onClick={() => fetchResults(searchInput)} />
      </div>
      {loading && (
        <div className='loader'>
          <div className='wrapper'>
            <div className='circle'></div>
            <div className='line-1'></div>
            <div className='line-2'></div>
            <div className='line-3'></div>
            <div className='line-4'></div>
          </div>
        </div>
      )}
      {error && <p className='error'>{error}</p>}
      {searchInput.length === 0 && (
        <div className='buttons-container'>
          {categories.map((eachButton) => (
            <button
              key={eachButton.key}
              className='category-button'
              onClick={() => setCategory(eachButton.key)}>
              {eachButton.displayText}
            </button>
          ))}
        </div>
      )}
      <div className='photos-container'>
        {photos.length > 0 ? (
          photos.map((photo) => (
            <div
              key={photo.id}
              className='photo-wrapper'
              onMouseEnter={() => setHoveredPhoto(photo)}
              onMouseLeave={() => setHoveredPhoto(null)}>
              <img
                src={photo.urls.small}
                alt={photo.description || "Photo"}
                className='photo'
              />
              {hoveredPhoto === photo && (
                <div className='photo-details'>
                  <a
                    href={photo.links.html}
                    target='_blank'
                    rel='noopener noreferrer'>
                    View on Unsplash
                  </a>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No photos found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
