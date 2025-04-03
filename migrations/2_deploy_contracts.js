const MusicNFT = artifacts.require("MusicNFT");
const MusicMarketplace = artifacts.require("MusicMarketplace");

module.exports = async function(deployer) {
  // Deploy MusicNFT contract
  await deployer.deploy(MusicNFT);
  const musicNFT = await MusicNFT.deployed();
  
  // Deploy MusicMarketplace contract with MusicNFT address
  await deployer.deploy(MusicMarketplace, musicNFT.address);
};