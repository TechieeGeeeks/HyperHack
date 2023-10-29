import React, { useEffect } from 'react'
import { useState } from 'react'

const TakeLoan = ({signer, mainConfig}) => {
  const [tokenUri, setTokenUri] = useState('');
  const [message, setMessage] = useState('');

  const mintNft = async () => {
    try {
      if (!tokenUri) {
        setMessage('Please enter a token URI.');
        return;
      }
      const tx = await mainConfig.basicNFT.mintNft(tokenUri);
      await tx.wait();
      setMessage('NFT minted successfully!');
    } catch (error) {
      console.error('Error minting NFT:', error);
      setMessage('Error minting NFT.');
    }
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
      <p>{message}</p>
    </div>
  );
}

export default TakeLoan