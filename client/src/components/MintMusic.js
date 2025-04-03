import React, { useState } from 'react';

function MintMusic({ mintMusic }) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    mintMusic(title, artist, genre, price, imageUrl);
  };
  
  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-center">Mint New Music NFT</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Song Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="artist" className="form-label">Artist Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="artist" 
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="genre" className="form-label">Genre</label>
                <select 
                  className="form-select" 
                  id="genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                >
                  <option value="">Select Genre</option>
                  <option value="Pop">Pop</option>
                  <option value="Rock">Rock</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="R&B">R&B</option>
                  <option value="Jazz">Jazz</option>
                  <option value="Classical">Classical</option>
                  <option value="Electronic">Electronic</option>
                  <option value="Country">Country</option>
                  <option value="Folk">Folk</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Price (ETH)</label>
                <input 
                  type="number" 
                  step="0.001" 
                  min="0.001" 
                  className="form-control" 
                  id="price" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="imageUrl" className="form-label">Cover Image URL</label>
                <input 
                  type="url" 
                  className="form-control" 
                  id="imageUrl" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <div className="form-text">Optional: URL to album art or artist image</div>
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Mint Music NFT
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MintMusic;