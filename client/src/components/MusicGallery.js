import React from 'react';

function MusicGallery({ music, account, buyMusic }) {
  return (
    <div>
      <h2 className="text-center mb-4">Browse Music NFTs</h2>
      
      {music.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          No music NFTs available yet. Be the first to mint one!
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
                    <strong>Price:</strong> {item.price} ETH
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      Creator: {item.creator.substring(0, 6)}...{item.creator.substring(item.creator.length - 4)}
                    </small>
                  </p>
                </div>
                <div className="card-footer">
                  {item.isForSale ? (
                    item.owner.toLowerCase() !== account.toLowerCase() ? (
                      <button 
                        className="btn btn-primary w-100" 
                        onClick={() => buyMusic(item.id, item.price)}
                      >
                        Buy Now
                      </button>
                    ) : (
                      <span className="badge bg-success">You own this NFT</span>
                    )
                  ) : (
                    <span className="badge bg-secondary">Not For Sale</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MusicGallery;