// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./MusicNFT.sol";

contract MusicMarketplace {
    MusicNFT public nftContract;
    uint256 public platformFee = 25;
    uint256 public royaltyFee = 25;
    address payable public platformOwner;
    
    event MarketItemSold(uint256 tokenId, address seller, address buyer, uint256 price);
    
    constructor(address _nftContract) {
        nftContract = MusicNFT(_nftContract);
        platformOwner = payable(msg.sender);
    }
    
   
    function createMarketSale(uint256 tokenId) public payable {
        address seller = nftContract.ownerOf(tokenId);
        MusicNFT.ViewMusic memory info = nftContract.getMusicInfo(tokenId);
        uint256 price = info.price;
        address payable creator = payable(info.creator); 
        bool isForSale = info.isForSale;

        
        require(isForSale, "NFT not for sale");
        require(msg.value >= price, "Please submit the asking price");
        
        
        uint256 fee = (price * platformFee) / 1000;
        uint256 royaltyCut = (price * royaltyFee) / 1000;
        uint256 sellerAmount = price - fee - royaltyCut;
         

        nftContract.safeTransferFrom(seller, msg.sender, tokenId);
        
       
        payable(seller).transfer(sellerAmount);
        
        creator.transfer(royaltyCut);
        platformOwner.transfer(fee);
      
        
        emit MarketItemSold(tokenId, seller, msg.sender, price);
        
        
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }
}