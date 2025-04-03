import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';
import MusicNFT from './contracts/MusicNFT.json';
import MusicMarketplace from './contracts/MusicMarketplace.json';
import Navigation from './components/Navigation';
import MintMusic from './components/MintMusic';
import MusicGallery from './components/MusicGallery';
import MyCollection from './components/MyCollection';

function App() {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(true);
  const [musicNFT, setMusicNFT] = useState(null);
  const [marketplace, setMarketplace] = useState(null);
  const [allMusic, setAllMusic] = useState([]);
  const [myMusic, setMyMusic] = useState([]);
  const [currentView, setCurrentView] = useState('gallery');

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        // Check if Web3 has been injected by MetaMask
        if (window.ethereum) {
          // Use provider from MetaMask
          const web3 = new Web3(window.ethereum);
          
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Get accounts
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
          
          // Get network ID
          const networkId = await web3.eth.net.getId();
          
          // Load MusicNFT contract
          const musicNFTData = MusicNFT.networks[networkId];
          if (musicNFTData) {
            const musicNFTInstance = new web3.eth.Contract(
              MusicNFT.abi,
              musicNFTData.address
            );
            setMusicNFT(musicNFTInstance);
            
            // Load MusicMarketplace contract
            const marketplaceData = MusicMarketplace.networks[networkId];
            if (marketplaceData) {
              const marketplaceInstance = new web3.eth.Contract(
                MusicMarketplace.abi,
                marketplaceData.address
              );
              setMarketplace(marketplaceInstance);
              
              // Load music data
              await loadMusicData(musicNFTInstance, accounts[0]);
            } else {
              console.error('MusicMarketplace contract not deployed to detected network.');
            }
          } else {
            console.error('MusicNFT contract not deployed to detected network.');
          }
        } else {
          alert('Please install MetaMask to use this application!');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading blockchain data:', error);
        setLoading(false);
      }
    };
    
    loadBlockchainData();
    
    // Handle account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
        // Reload music data when account changes
        if (musicNFT) {
          loadMusicData(musicNFT, accounts[0]);
        }
      });
    }
  }, []);
  
  // Load all music and user's collection
  const loadMusicData = async (musicNFTInstance, userAccount) => {
    try {
      const totalSupply = await musicNFTInstance.methods.getTotalMusicCount().call();
      
      const allMusicItems = [];
      const myMusicItems = [];
      
      for (let i = 1; i <= totalSupply; i++) {
        const musicInfo = await musicNFTInstance.methods.getMusicInfo(i).call();
        const tokenURI = await musicNFTInstance.methods.tokenURI(i).call();
        
        // Try to fetch metadata from IPFS or other storage
        let metadata = { 
          name: musicInfo.title,
          description: `${musicInfo.artist} - ${musicInfo.genre}`,
          image: 'https://via.placeholder.com/150' // Default image
        };
        
        try {
          // If tokenURI is an HTTP URL or IPFS gateway URL
          if (tokenURI.startsWith('http')) {
            const response = await fetch(tokenURI);
            const data = await response.json();
            metadata = data;
          }
        } catch (error) {
          console.error(`Error fetching metadata for token ${i}:`, error);
        }
        
        const music = {
          id: i,
          title: musicInfo.title,
          artist: musicInfo.artist,
          genre: musicInfo.genre,
          price: Web3.utils.fromWei(musicInfo.price, 'ether'),
          creator: musicInfo.creator,
          owner: musicInfo.currentOwner,
          isForSale: musicInfo.isForSale,
          metadata: metadata
        };
        
        allMusicItems.push(music);
        
        // Add to user's collection if they are the owner
        if (musicInfo.currentOwner.toLowerCase() === userAccount.toLowerCase()) {
          myMusicItems.push(music);
        }
      }
      
      setAllMusic(allMusicItems);
      setMyMusic(myMusicItems);
    } catch (error) {
      console.error('Error loading music data:', error);
    }
  };
  
  // Function to mint new music NFT
  const mintMusic = async (title, artist, genre, price, imageUrl) => {
    try {
      setLoading(true);
      
      // Create metadata JSON
      const metadata = {
        name: title,
        description: `${artist} - ${genre}`,
        image: imageUrl || 'https://via.placeholder.com/150'
      };
      
      // In a real app, you would upload this to IPFS or another storage
      // For simplicity, we'll use a placeholder URI
      const tokenURI = `https://example.com/api/token/${Date.now()}`; // Placeholder
      
      // Convert price from ETH to Wei
      const priceInWei = Web3.utils.toWei(price.toString(), 'ether');
      
      // Mint new token
      await musicNFT.methods.mintMusic(
        title,
        artist,
        genre,
        priceInWei,
        tokenURI
      ).send({ from: account });
      
      // Reload music data
      await loadMusicData(musicNFT, account);
      setLoading(false);
      
      // Switch to the gallery view
      setCurrentView('gallery');
    } catch (error) {
      console.error('Error minting music:', error);
      setLoading(false);
    }
  };
  
  // Function to buy music
  const buyMusic = async (tokenId, price) => {
    try {
      setLoading(true);
      
      // Convert price from ETH to Wei
      const priceInWei = Web3.utils.toWei(price.toString(), 'ether');
      
      // First approve marketplace to transfer the NFT
      await musicNFT.methods.approve(marketplace._address, tokenId)
        .send({ from: account });
      
      // Buy music through marketplace
      await marketplace.methods.createMarketSale(tokenId)
        .send({ from: account, value: priceInWei });
      
      // Reload music data
      await loadMusicData(musicNFT, account);
      setLoading(false);
    } catch (error) {
      console.error('Error buying music:', error);
      setLoading(false);
    }
  };
  
  // Function to toggle sale status
  const toggleForSale = async (tokenId) => {
    try {
      setLoading(true);
      
      // Toggle sale status
      await musicNFT.methods.toggleForSale(tokenId)
        .send({ from: account });
      
      // Reload music data
      await loadMusicData(musicNFT, account);
      setLoading(false);
    } catch (error) {
      console.error('Error toggling sale status:', error);
      setLoading(false);
    }
  };
  
  // Function to change price
  const changePrice = async (tokenId, newPrice) => {
    try {
      setLoading(true);
      
      // Convert price from ETH to Wei
      const priceInWei = Web3.utils.toWei(newPrice.toString(), 'ether');
      
      // Change price
      await musicNFT.methods.changePrice(tokenId, priceInWei)
        .send({ from: account });
      
      // Reload music data
      await loadMusicData(musicNFT, account);
      setLoading(false);
    } catch (error) {
      console.error('Error changing price:', error);
      setLoading(false);
    }
  };
  
  return (
    <div className="App">
      <Navigation 
        account={account} 
        setCurrentView={setCurrentView} 
      />
      <div className="container mt-5">
        <h1 className="text-center">Harmony Chain: Music NFT Marketplace</h1>
        <hr />
        
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading blockchain data...</p>
          </div>
        ) : (
          <div>
            {currentView === 'mint' && (
              <MintMusic mintMusic={mintMusic} />
            )}
            
            {currentView === 'gallery' && (
              <MusicGallery 
                music={allMusic} 
                account={account} 
                buyMusic={buyMusic} 
              />
            )}
            
            {currentView === 'collection' && (
              <MyCollection 
                music={myMusic}
                toggleForSale={toggleForSale}
                changePrice={changePrice}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;