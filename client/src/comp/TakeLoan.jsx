import React, { useState } from "react";
const { ethers } = require("ethers");

const TakeLoan = ({ signer, mainConfig }) => {
  const [tokenUri, setTokenUri] = useState("");
  const [tokenCounter, setTokenCounter] = useState(null);
  const [customTokenID, setCustomTokenID] = useState(""); // State to hold the custom tokenID value

  const mintNft = async () => {
    try {
      if (!tokenUri) {
        return;
      }
      const tx = await mainConfig.basicNFT.mintNft(tokenUri);
      await tx.wait();
      fetchTokenCounter();
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
  };

  const fetchTokenCounter = async () => {
    const latestCount = await mainConfig.basicNFT.getTokenCounter();
    const decimalNumber = parseInt(latestCount._hex, 16);
    setTokenCounter(decimalNumber);
  };

  const approveAddress = async () => {
    try {
      const lendBorrowAddress = mainConfig.lendBorrow.address;
      // Use the customTokenID directly in the approval
      const tx = await mainConfig.basicNFT.approve(
        lendBorrowAddress,
        customTokenID
      );
      await tx.wait();
      console.log("Address approved successfully for Token ID:", customTokenID);
    } catch (error) {
      console.error("Error approving address:", error);
    }
  };

  return (
    <div className=" ">
      <div className="border flex flex-col gap-3 text-center p-5 px-6 max-w-6xl rounded-lg mx-auto mt-12">
        <h2 className=" font-semibold text-xl text-primaryColor">
          Mint an NFT
        </h2>
        <input
          type="text"
          placeholder="Token URI"
          value={tokenUri}
          onChange={(e) => setTokenUri(e.target.value)}
          className=" border bg-transparent rounded-lg px-4 py-1"
        />
        <button onClick={mintNft} className=" bg-cardBg rounded-lg px-4 py-1">
          Mint NFT
        </button>

        
      </div>

      <div className="border flex flex-col gap-3 text-center p-5 px-6 max-w-6xl rounded-lg mx-auto mt-12">
        <h2 className=" font-semibold text-xl text-primaryColor">
          Get The Latest Count of Available NFT
        </h2>
        <p className="text-subtitleColor">
          Current Token Counter is{" "}
          <span className="text-white font-medium">{tokenCounter}</span>
        </p>
        <button
          onClick={fetchTokenCounter}
          className=" bg-cardBg rounded-lg px-4 py-1"
        >
          Get Latest Token Counter
        </button>
      </div>

      <div className="border flex flex-col gap-3 text-center p-5 px-6 max-w-6xl rounded-lg mx-auto mt-12">
        <h2 className=" font-semibold text-xl text-primaryColor">
          Approve Lend Borrow Contract to pull NFT
        </h2>
        <input
          type="text"
          placeholder="Nft Token ID"
          value={customTokenID}
          onChange={(e) => setCustomTokenID(e.target.value)}
          className=" border bg-transparent rounded-lg px-4 py-1"
        />
        <button
          onClick={approveAddress}
          className=" bg-cardBg rounded-lg px-4 py-1"
        >
          Approve
        </button>
      </div>
    </div>
  );
};

export default TakeLoan;
