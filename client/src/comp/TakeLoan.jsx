import React, { useState } from 'react';
const { ethers } = require("ethers");

const TakeLoan = ({ signer, mainConfig }) => {
  const [tokenUri, setTokenUri] = useState('');
  const [tokenCounter, setTokenCounter] = useState(null);

  const mintNft = async () => {
    try {
      if (!tokenUri) {
        return;
      }
      const tx = await mainConfig.basicNFT.mintNft(tokenUri);
      await tx.wait();
      fetchTokenCounter();
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  const fetchTokenCounter = async () => {
    const latestCount = await mainConfig.basicNFT.getTokenCounter();
    const decimalNumber = parseInt(latestCount._hex, 16);
    setTokenCounter(2);
  };

  return (
    <div>
      <h2>Mint an NFT</h2>
      <input
        type="text"
        placeholder="Token URI"
        value={tokenUri}
        onChange={(e) => setTokenUri(e.target.value)}
      />
      <button onClick={mintNft}>Mint NFT</button>
      <p>Current Token Counter is {tokenCounter}</p>
      <button onClick={fetchTokenCounter}>Get Latest Token Counter</button>
    </div>
  );
};

export default TakeLoan;
