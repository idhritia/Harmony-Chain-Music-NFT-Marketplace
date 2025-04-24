// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MusicNFT.sol";

/**
 * @title RoyaltyManager
 * @dev Contract for handling royalty payments to music creators
 */
contract RoyaltyManager {
    MusicNFT public musicNFTContract;
    
    // Maps creator address to their accumulated royalties
    mapping(address => uint256) public pendingRoyalties;
    
    // Events
    event RoyaltyPaid(uint256 tokenId, address creator, uint256 amount);
    event RoyaltyWithdrawn(address creator, uint256 amount);
    
    constructor(address _musicNFTAddress) {
        musicNFTContract = MusicNFT(_musicNFTAddress);
    }
    
    /**
     * @dev Process royalty payment when a sale occurs
     * @param tokenId The ID of the token being sold
     * @param salePrice The price the token was sold for
     */
    function processRoyalty(uint256 tokenId, uint256 salePrice) external payable {
        (address creator, uint256 royaltyPercent) = musicNFTContract.getRoyaltyInfo(tokenId);
        
        uint256 royaltyAmount = (salePrice * royaltyPercent) / 100;
        require(msg.value >= royaltyAmount, "Insufficient royalty payment");
        
        // Add to creator's pending royalties
        pendingRoyalties[creator] += royaltyAmount;
        
        emit RoyaltyPaid(tokenId, creator, royaltyAmount);
    }
    
    /**
     * @dev Allow creator to withdraw their accumulated royalties
     */
    function withdrawRoyalties() external {
        uint256 amount = pendingRoyalties[msg.sender];
        require(amount > 0, "No royalties to withdraw");
        
        pendingRoyalties[msg.sender] = 0;
        
        // Transfer royalties to creator
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit RoyaltyWithdrawn(msg.sender, amount);
    }
    
    /**
     * @dev Get pending royalties for a creator
     * @param creator The address of the creator
     * @return The amount of pending royalties
     */
    function getPendingRoyalties(address creator) external view returns (uint256) {
        return pendingRoyalties[creator];
    }
    
    // Function to receive ETH
    receive() external payable {}
}
