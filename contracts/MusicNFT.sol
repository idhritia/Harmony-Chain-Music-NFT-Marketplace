// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MusicNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
  
    struct Music {
        string title;
        string artist;
        string genre;
        uint256 price;
        address payable creator;
        bool isForSale;
        string coverURI;
        string audioURI;
    }
    
    struct ViewMusic {
    string title;
    string artist;
    string genre;
    uint256 price;
    address payable creator;
    address owner;
    bool isForSale;
    string coverURI;
    string audioURI;
}
    
    mapping(uint256 => Music) public musicData;
    
  
    event MusicMinted(uint256 tokenId, string title, string artist, address creator);
    event MusicPriceChanged(uint256 tokenId, uint256 newPrice);
    event MusicSold(uint256 tokenId, address from, address to, uint256 price);
    
    constructor() ERC721("HarmonyChain", "HCNFT") {}
    
  
    function mintMusic(
        string memory title,
        string memory artist,
        string memory genre,
        uint256 price,
        string memory tokenURI,
        string memory coverURI,
        string memory audioURI
    ) public returns (uint256) {
        _tokenIds.increment();
        
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        musicData[newTokenId] = Music({
            title: title,
            artist: artist,
            genre: genre,
            price: price,
            creator: payable(msg.sender),
            isForSale: true,
            coverURI: coverURI,
            audioURI: audioURI
        });
        
        emit MusicMinted(newTokenId, title, artist, msg.sender);
        
        return newTokenId;
    }
    
    function changePrice(uint256 tokenId, uint256 newPrice) public {
        require(_exists(tokenId), "Music NFT does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can change price");
        
        musicData[tokenId].price = newPrice;
        emit MusicPriceChanged(tokenId, newPrice);
    }
    
   
    function getTotalMusicCount() public view returns (uint256) {
        return _tokenIds.current();
    }

    function toggleForSale(uint256 tokenId) public {
        require(_exists(tokenId), "Music NFT does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can toggle sale status");

        musicData[tokenId].isForSale = !musicData[tokenId].isForSale;
    }
    
   
    function getMusicInfo(uint256 tokenId) public view returns (
      ViewMusic memory
    ) {
        require(_exists(tokenId), "Music NFT does not exist");
        
        Music memory music = musicData[tokenId];
        
       return ViewMusic({
        title: music.title,
        artist: music.artist,
        genre: music.genre,
        price: music.price,
        creator: music.creator,
        owner: ownerOf(tokenId),
        isForSale: music.isForSale,
        coverURI: music.coverURI,
        audioURI: music.audioURI
    });
    }
}