// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title MusicNFT
 * @dev Contract for minting and managing music NFTs with royalty information
 */
contract MusicNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Struct to store music metadata and royalty info
    struct MusicMetadata {
        string audioURI;        // URI to the audio file (MP3)
        string coverImageURI;   // URI to the cover image
        address creator;        // Original creator address
        uint256 royaltyPercent; // Royalty percentage (out of 100)
    }
    
    // Maps token ID to its metadata
    mapping(uint256 => MusicMetadata) public musicData;
    
    // Events
    event MusicNFTMinted(uint256 tokenId, address creator, string audioURI, string coverImageURI);
    
    constructor() ERC721("HarmonyChainMusic", "HCM") {}
    
    /**
     * @dev Mint a new music NFT
     * @param recipient The address that will own the NFT
     * @param tokenURI The IPFS URI for the token metadata
     * @param audioURI The URI to the audio file (MP3)
     * @param coverImageURI The URI to the cover image
     * @param royaltyPercent The percentage of sales that go to the creator as royalty
     * @return The ID of the newly minted NFT
     */
    function mintMusicNFT(
        address recipient,
        string memory tokenURI,
        string memory audioURI,
        string memory coverImageURI,
        uint256 royaltyPercent
    ) public returns (uint256) {
        require(royaltyPercent <= 30, "Royalty cannot exceed 30%");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        // Store the music-specific metadata
        musicData[newTokenId] = MusicMetadata({
            audioURI: audioURI,
            coverImageURI: coverImageURI,
            creator: msg.sender,
            royaltyPercent: royaltyPercent
        });
        
        emit MusicNFTMinted(newTokenId, msg.sender, audioURI, coverImageURI);
        
        return newTokenId;
    }
    
    /**
     * @dev Get royalty information for a token
     * @param tokenId The ID of the token
     * @return creator The creator address
     * @return royaltyPercent The royalty percentage
     */
    function getRoyaltyInfo(uint256 tokenId) public view returns (address creator, uint256 royaltyPercent) {
        require(_exists(tokenId), "Token does not exist");
        MusicMetadata memory metadata = musicData[tokenId];
        return (metadata.creator, metadata.royaltyPercent);
    }
    
    /**
     * @dev Get music content URIs
     * @param tokenId The ID of the token
     * @return audioURI The audio file URI
     * @return coverImageURI The cover image URI
     */
    function getMusicContent(uint256 tokenId) public view returns (string memory audioURI, string memory coverImageURI) {
        require(_exists(tokenId), "Token does not exist");
        MusicMetadata memory metadata = musicData[tokenId];
        return (metadata.audioURI, metadata.coverImageURI);
    }
}
