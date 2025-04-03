// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./MusicNFT.sol";

contract MusicMarketplace {
    MusicNFT public nftContract;
    uint256 public platformFee = 25; // 2.5% fee
    address payable public platformOwner;
    
    // Structure for marketplace items
    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool sold;
    }
    
    // Events
    event MarketItemCreated(uint256 tokenId, address seller, uint256 price);
    event MarketItemSold(uint256 tokenId, address seller, address buyer, uint256 price);
    
    constructor(address _nftContract) {
        nftContract = MusicNFT(_nftContract);
        platformOwner = payable(msg.sender);
    }
    
    // List NFT on marketplace
    function createMarketItem(uint256 tokenId, uint256 price) public {
        require(price > 0, "Price must be greater than 0");
        require(nftContract.ownerOf(tokenId) == msg.sender, "Only owner can list NFT");
        
        // Ensure the contract is approved to transfer the NFT
        require(nftContract.getApproved(tokenId) == address(this) || 
                nftContract.isApprovedForAll(msg.sender, address(this)), 
                "Marketplace not approved to transfer NFT");
        
        emit MarketItemCreated(tokenId, msg.sender, price);
    }
    
    // Buy NFT from marketplace
    function createMarketSale(uint256 tokenId) public payable {
        address seller = nftContract.ownerOf(tokenId);
        (, , , uint256 price, , bool isForSale, ) = nftContract.getMusicInfo(tokenId);
        
        require(isForSale, "NFT not for sale");
        require(msg.value >= price, "Please submit the asking price");
        
        // Calculate platform fee
        uint256 fee = (price * platformFee) / 1000;
        uint256 sellerAmount = price - fee;
        
        // Pay seller
        payable(seller).transfer(sellerAmount);
        
        // Pay platform fee
        platformOwner.transfer(fee);
        
        // Transfer NFT to buyer
        nftContract.buyMusic{value: price}(tokenId);
        
        emit MarketItemSold(tokenId, seller, msg.sender, price);
        
        // Return excess funds
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }
    
    // Update platform fee - only owner can do this
    function updatePlatformFee(uint256 _platformFee) public {
        require(msg.sender == platformOwner, "Only platform owner can update fee");
        require(_platformFee <= 100, "Fee cannot exceed 10%"); // Maximum 10%
        platformFee = _platformFee;
    }
    
    // Withdraw platform earnings - only owner can do this
    function withdrawFunds() public {
        require(msg.sender == platformOwner, "Only platform owner can withdraw");
        platformOwner.transfer(address(this).balance);
    }
}