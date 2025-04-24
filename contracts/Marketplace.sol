// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./MusicNFT.sol";
import "./RoyaltyManager.sol";

/**
 * @title Marketplace
 * @dev Contract for listing and trading music NFTs
 */
contract Marketplace is ReentrancyGuard {
    MusicNFT public musicNFTContract;
    RoyaltyManager public royaltyManager;
    
    // Counter for listing IDs
    uint256 private _listingIds;
    
    // Structure for market listings
    struct Listing {
        uint256 listingId;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
    }
    
    // Maps listing ID to listing details
    mapping(uint256 => Listing) public listings;
    
    // Platform fee percentage (e.g., 2.5% = 250 basis points)
    uint256 public platformFeePercent = 250;
    uint256 public constant BASIS_POINTS = 10000;
    
    // Platform fee collector address
    address payable public feeCollector;
    
    // Events
    event ListingCreated(uint256 listingId, uint256 tokenId, address seller, uint256 price);
    event ListingCancelled(uint256 listingId);
    event ListingSold(uint256 listingId, uint256 tokenId, address seller, address buyer, uint256 price);
    event PlatformFeeChanged(uint256 newFeePercent);
    
    constructor(address _musicNFTAddress, address _royaltyManagerAddress) {
        musicNFTContract = MusicNFT(_musicNFTAddress);
        royaltyManager = RoyaltyManager(_royaltyManagerAddress);
        feeCollector = payable(msg.sender);
    }
    
    /**
     * @dev Create a listing for a token
     * @param tokenId The ID of the token to list
     * @param price The listing price
     */
    function createListing(uint256 tokenId, uint256 price) external {
        require(musicNFTContract.ownerOf(tokenId) == msg.sender, "Not the token owner");
        require(price > 0, "Price must be greater than zero");
        require(musicNFTContract.getApproved(tokenId) == address(this) || 
                musicNFTContract.isApprovedForAll(msg.sender, address(this)), 
                "Marketplace not approved to transfer token");
        
        // Increment listing ID
        _listingIds++;
        
        // Create the listing
        listings[_listingIds] = Listing({
            listingId: _listingIds,
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true
        });
        
        emit ListingCreated(_listingIds, tokenId, msg.sender, price);
    }
    
    /**
     * @dev Cancel a listing
     * @param listingId The ID of the listing to cancel
     */
    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(listing.seller == msg.sender, "Not the seller");
        
        listing.isActive = false;
        
        emit ListingCancelled(listingId);
    }
    
    /**
     * @dev Buy a listed token
     * @param listingId The ID of the listing to buy
     */
    function buyListing(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");
        
        // Mark listing as inactive
        listing.isActive = false;
        
        // Calculate platform fee
        uint256 platformFee = (listing.price * platformFeePercent) / BASIS_POINTS;
        
        // Calculate royalty
        (address creator, uint256 royaltyPercent) = musicNFTContract.getRoyaltyInfo(listing.tokenId);
        uint256 royaltyFee = (listing.price * royaltyPercent) / 100;
        
        // Calculate seller amount (after deducting platform fee and royalty)
        uint256 sellerAmount = listing.price - platformFee - royaltyFee;
        
        // Process royalty payment
        if (royaltyFee > 0) {
            (bool royaltySuccess, ) = address(royaltyManager).call{value: royaltyFee}(
                abi.encodeWithSignature("processRoyalty(uint256,uint256)", listing.tokenId, listing.price)
            );
            require(royaltySuccess, "Royalty payment failed");
        }
        
        // Pay platform fee
        (bool feeSuccess, ) = feeCollector.call{value: platformFee}("");
        require(feeSuccess, "Platform fee payment failed");
        
        // Pay seller
        (bool sellerSuccess, ) = payable(listing.seller).call{value: sellerAmount}("");
        require(sellerSuccess, "Seller payment failed");
        
        // Transfer NFT to buyer
        musicNFTContract.safeTransferFrom(listing.seller, msg.sender, listing.tokenId);
        
        // Refund excess payment to buyer
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - listing.price}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit ListingSold(listingId, listing.tokenId, listing.seller, msg.sender, listing.price);
    }
    
    /**
     * @dev Change the platform fee percentage (owner only)
     * @param newFeePercent The new platform fee percentage (in basis points)
     */
    function setPlatformFee(uint256 newFeePercent) external {
        require(msg.sender == feeCollector, "Only fee collector can change fee");
        require(newFeePercent <= 1000, "Fee cannot exceed 10%"); // Max 10% (1000 basis points)
        
        platformFeePercent = newFeePercent;
        emit PlatformFeeChanged(newFeePercent);
    }
    
    /**
     * @dev Get active listings count
     * @return Count of active listings
     */
    function getActiveListingsCount() external view returns (uint256 count) {
        for (uint256 i = 1; i <= _listingIds; i++) {
            if (listings[i].isActive) {
                count++;
            }
        }
        return count;
    }
}
