import React, { useState } from 'react';

function MyCollection({ music, toggleForSale, changePrice }) {
  const [editPriceId, setEditPriceId] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  
  const handlePriceChange = (id) => {
    changePrice(id, newPrice);
    setEditPriceId(null);
    setNewPrice('');
  };
  
  return (
    <div>
      <h2 className="text-center mb-4">My Music NFT Collection</h2>
      
      {music.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          You don't own any music NFTs yet. Browse the marketplace or mint your own!
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {music.map((item) => (
            <div className="col" key={item.id}>
              <div className="card h-100">
                <img 
                  src={item.metadata.image || "https://via.placeholder.com/150"} 
                  className="card-img-top p-3" 
                  alt={item.title}
                  style={{ height: '200px', objectFit: 'contain' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">
                    <strong>Artist:</strong> {item.artist}<br />
                    <strong>Genre:</strong> {item.genre}<br />
                    <strong>Price:</strong> {item.price} ETH<br />
                    <strong>Status:</strong> {item.isForSale ? 'For Sale' : 'Not For Sale'}
                  </p>
                </div>
                <div className="card-footer">
                  <div className="d-grid gap-2">
                    <button 
                      className={`btn ${item.isForSale ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => toggleForSale(item.id)}
                    >
                      {item.isForSale ? 'Remove from Sale' : 'Put on Sale'}
                    </button>
                    
                    {editPriceId === item.id ? (
                      <div className="input-group mt-2">
                        <input 
                          type="number" 
                          className="form-control" 
                          placeholder="New price in ETH" 
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          min="0.001"
                          step="0.001"
                        />
                        <button 
                          className="btn btn-outline-primary" 
                          onClick={() => handlePriceChange(item.id)}
                        >
                          Update
                        </button>
                        <button 
                          className="btn btn-outline-secondary" 
                          onClick={() => setEditPriceId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => {
                          setEditPriceId(item.id);
                          setNewPrice(item.price);
                        }}
                      >
                        Change Price
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCollection;