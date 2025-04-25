"use client"
import Web3 from 'web3'
import { useState, useEffect } from "react"
import Navbar from "../components/nav";
import MusicNFT from '../contracts/MusicNFT.json';
import MusicMarketplace from '../contracts/MusicMarketplace.json';
import MusicGallery from '../components/gallery';
import MintMusic from '../components/mint';
import Collection from '../components/collection';

export default function Home() {
  const [contracts, setContracts] = useState({
    account: "",
    musicNFT: null,
    marketplace: null
  });
  const [view, setView] = useState('');
  const [allMusic, setAllMusic] = useState([]);
  const [myMusic, setMyMusic] = useState([]);


  useEffect(() => {
    const initBlockchain = async () => {
      const eth = window.ethereum;
      if (eth) {
        const web3Instance = new Web3(eth);
        const accounts = await eth.request({ method: 'eth_requestAccounts' });
        const account = accounts[0]
        const networkId = await web3Instance.eth.net.getId()

        const nftData = MusicNFT.networks[networkId];
        const marketplaceData = MusicMarketplace.networks[networkId];
        if (!nftData || !marketplaceData) {
          alert("Contracts not deployed to this network");
          return;
        }
        const musicNFT = new web3Instance.eth.Contract(MusicNFT.abi, nftData.address);
        const marketplace = new web3Instance.eth.Contract(MusicMarketplace.abi, marketplaceData.address);

        setContracts({ account, musicNFT, marketplace });


        await loadMusicData(musicNFT, accounts[0]);


      } else {
        alert('Please install MetaMask to use this application!');
      }
    }
    initBlockchain();
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on("accountsChanged", async (accounts) => {
      setContracts(prev => ({ ...prev, account: accounts[0] }));
      if (contracts.musicNFT) {
        await loadMusicData(contracts.musicNFT, accounts[0]);
      } else {
        alert("Contracts not loaded!");
        return;
      }
    });
  }, [contracts.musicNFT]);


  const loadMusicData = async (musicNFTInstance, userAccount) => {
    try {
      const totalSupply = await musicNFTInstance.methods.getTotalMusicCount().call();

      const allMusicItems = [];
      const myMusicItems = [];

      for (let i = totalSupply; i >= 1; i--) {
        let musicInfo = await musicNFTInstance.methods.getMusicInfo(i).call();

        const tokenURI = await musicNFTInstance.methods.tokenURI(i).call();


        let metadata = {
          name: musicInfo.title,
          description: `${musicInfo.artist} - ${musicInfo.genre}`,
          image: '/music.png'
        };



        const music = {
          id: i,
          title: musicInfo.title,
          artist: musicInfo.artist,
          genre: musicInfo.genre,
          price: Web3.utils.fromWei(musicInfo.price, 'ether'),
          creator: musicInfo.creator,
          owner: musicInfo.owner,
          isForSale: musicInfo.isForSale,
          coverURI: musicInfo.coverURI,
          audioURI: musicInfo.audioURI,
          metadata: metadata
        };

        if (music.isForSale) {
          allMusicItems.push(music);
        }


        if (musicInfo.owner.toLowerCase() === userAccount.toLowerCase()) {
          myMusicItems.push(music);
        }
      }


      setAllMusic(allMusicItems);
      setMyMusic(myMusicItems);

    } catch (error) {
      console.error('Error loading music data:', error);
    }
  };

  const mintMusic = async (title, artist, genre, price, imageUrl, audioUrl) => {
    try {



      const metadata = {
        name: title,
        description: `${artist} - ${genre}`,
        image: imageUrl || '/music.png'
      };


      const tokenURI = `https://example.com/api/token/${Date.now()}`;


      const priceInWei = Web3.utils.toWei(price.toString(), 'ether');

      if (!contracts.musicNFT) return;

      const receipt = await contracts.musicNFT.methods.mintMusic(
        title,
        artist,
        genre,
        priceInWei,
        tokenURI,
        imageUrl,
        audioUrl
      ).send({ from: contracts.account });

      const tokenId = receipt.events.MusicMinted.returnValues.tokenId;


      await contracts.musicNFT.methods.approve(contracts.marketplace._address, tokenId)
        .send({ from: contracts.account });

      await loadMusicData(contracts.musicNFT, contracts.account);



      setView('');
    } catch (error) {
      console.error('Error minting music:', error);

    }
  };


  const buyMusic = async (tokenId, price) => {
    try {



      const priceInWei = Web3.utils.toWei(price.toString(), 'ether');
      console.log("converted price!")
      if (!contracts.marketplace) return;

      await contracts.marketplace.methods.createMarketSale(tokenId)
        .send({ from: contracts.account, value: priceInWei });
      console.log("Sale done!")

      await loadMusicData(contracts.musicNFT, contracts.account);

    } catch (error) {
      console.error('Error buying music:', error);

    }
  };


  const toggleForSale = async (tokenId) => {
    try {


      await contracts.musicNFT.methods.toggleForSale(tokenId)
        .send({ from: contracts.account });


      await loadMusicData(contracts.musicNFT, contracts.account);

    } catch (error) {
      console.error('Error toggling sale status:', error);

    }
  };


  const changePrice = async (tokenId, newPrice) => {
    try {



      const priceInWei = Web3.utils.toWei(newPrice.toString(), 'ether');


      await contracts.musicNFT.methods.changePrice(tokenId, priceInWei)
        .send({ from: contracts.account });


      await loadMusicData(contracts.musicNFT, contracts.account);

    } catch (error) {
      console.error('Error changing price:', error);

    }
  };

  return (

    <main className="flex-grow">
      <Navbar account={contracts.account} setCurrentView={setView} />
      {view == "" && <MusicGallery allMusic={allMusic} account={contracts.account} buyMusic={buyMusic} />}
      {view == "mint" && <MintMusic mintMusic={mintMusic} />}
      {view == "collection" && <Collection music={myMusic} toggleForSale={toggleForSale} changePrice={changePrice} />}
    </main>
  );
}
