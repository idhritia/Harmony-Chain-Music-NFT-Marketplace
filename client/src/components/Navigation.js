import React from 'react';

function Navigation({ account, setCurrentView }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <a className="navbar-brand" href="#">Harmony Chain</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button 
                className="btn nav-link" 
                onClick={() => setCurrentView('gallery')}
              >
                Browse Music
              </button>
            </li>
            <li className="nav-item">
              <button 
                className="btn nav-link" 
                onClick={() => setCurrentView('mint')}
              >
                Mint Music NFT
              </button>
            </li>
            <li className="nav-item">
              <button 
                className="btn nav-link" 
                onClick={() => setCurrentView('collection')}
              >
                My Collection
              </button>
            </li>
          </ul>
          <span className="navbar-text text-white">
            {account ? (
              <small>Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</small>
            ) : (
              <small>Not Connected</small>
            )}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;