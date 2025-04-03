// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MusicNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Structure to store music metadata
    struct Music {
        string title;
        string artist;
        string genre;
        uint256 price;
        address payable creator;
        bool isForSale;
    }
    
    // Mapping from token ID to Music
    mapping(uint256 => Music) public musicData;
    
    // Events
    event MusicMinted(uint256 tokenId, string title, string artist, address creator);
    event MusicPriceChanged(uint256 tokenId, uint256 newPrice);
    event MusicSold(uint256 tokenId, address from, address to, uint256 price);
    
    constructor() ERC721("HarmonyChain", "HCNFT") {}
    
    // Mint new music NFT
    function mintMusic(
        string memory title,
        string memory artist,
        string memory genre,
        uint256 price,
        string memory tokenURI
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
            isForSale: true
        });
        
        emit MusicMinted(newTokenId, title, artist, msg.sender);
        
        return newTokenId;
    }
    
    // Change music price
    function changePrice(uint256 tokenId, uint256 newPrice) public {
        require(_exists(tokenId), "Music NFT does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can change price");
        
        musicData[tokenId].price = newPrice;
        emit MusicPriceChanged(tokenId, newPrice);
    }
    
    // Toggle sale status
    function toggleForSale(uint256 tokenId) public {
        require(_exists(tokenId), "Music NFT does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can toggle sale status");
        
        musicData[tokenId].isForSale = !musicData[tokenId].isForSale;
    }
    
    // Buy music NFT
    function buyMusic(uint256 tokenId) public payable {
        require(_exists(tokenId), "Music NFT does not exist");
        require(musicData[tokenId].isForSale, "Music NFT is not for sale");
        require(msg.value >= musicData[tokenId].price, "Insufficient funds");
        
        address seller = ownerOf(tokenId);
        address buyer = msg.sender;
        uint256 price = musicData[tokenId].price;
        
        // Transfer ownership
        _transfer(seller, buyer, tokenId);
        
        // Pay the seller
        payable(seller).transfer(price);
        
        // Set status to not for sale after purchase
        musicData[tokenId].isForSale = false;
        
        emit MusicSold(tokenId, seller, buyer, price);
        
        // Return excess funds
        if (msg.value > price) {
            payable(buyer).transfer(msg.value - price);
        }
    }
    
    // Get total supply of NFTs
    function getTotalMusicCount() public view returns (uint256) {
        return _tokenIds.current();
    }
    
    // Get music information
    function getMusicInfo(uint256 tokenId) public view returns (
        string memory title,
        string memory artist,
        string memory genre,
        uint256 price,
        address creator,
        bool isForSale,
        address currentOwner
    ) {
        require(_exists(tokenId), "Music NFT does not exist");
        
        Music memory music = musicData[tokenId];
        
        return (
            music.title,
            music.artist,
            music.genre,
            music.price,
            music.creator,
            music.isForSale,
            ownerOf(tokenId)
        );
    }
}