# Harmony Chain: Music NFT Marketplace

Harmony Chain is a decentralized Music NFT Marketplace that enables artists to mint, sell, and trade their music as NFTs. Built with React.js and Solidity, it leverages blockchain technology to ensure transparency and ownership of digital assets.

## Features
- 🎵 **Mint Music NFTs**: Artists can tokenize their music into NFTs.
- 💿 **Music Gallery**: Browse and explore available music NFTs.
- 🎸 **My Collection**: View owned NFTs in a personal collection.
- 🔗 **Blockchain-Powered**: Uses Solidity smart contracts for transactions.

## Tech Stack
- **Frontend**: React.js, JavaScript, HTML, CSS
- **Blockchain**: Solidity, Hardhat
- **Storage**: IPFS for metadata storage

## Installation
### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MetaMask](https://metamask.io/) browser extension
- [Hardhat](https://hardhat.org/) for smart contract deployment

### Clone the Repository
```sh
git clone https://github.com/yourusername/HarmonyChain.git
cd HarmonyChain
```

### Install Dependencies
```sh
cd client
npm install
```

### Start the Development Server
```sh
npm start
```
The application should now be running on `http://localhost:3000`.

## Smart Contract Deployment
### Compile and Deploy Contracts
```sh
cd blockchain
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

## Troubleshooting
### Common Issues & Fixes
1. **Module Not Found**: Ensure your `components` directory is inside `src/` and imports use `./components/ComponentName`.
2. **useEffect Dependency Warning**: Include all dependencies in the dependency array.
3. **Metadata Not Used Warning**: Either use the variable in JSX or remove it.

## Contributing
Pull requests are welcome! Feel free to open an issue or suggest improvements.

## License
This project is licensed under the MIT License.

---
🔗 **GitHub Repo**: [Harmony Chain](https://github.com/yourusername/HarmonyChain)

