const MusicNFT = artifacts.require("MusicNFT");
const RoyaltyManager = artifacts.require("RoyaltyManager");
const Marketplace = artifacts.require("Marketplace");

module.exports = async function(deployer) {
  // Deploy MusicNFT
  await deployer.deploy(MusicNFT);
  const musicNFT = await MusicNFT.deployed();
  
  // Deploy RoyaltyManager with MusicNFT address
  await deployer.deploy(RoyaltyManager, musicNFT.address);
  const royaltyManager = await RoyaltyManager.deployed();
  
  // Deploy Marketplace with MusicNFT and RoyaltyManager addresses
  await deployer.deploy(Marketplace, musicNFT.address, royaltyManager.address);
};
