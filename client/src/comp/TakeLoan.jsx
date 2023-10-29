import React, { useState } from "react";
import { Link } from "react-router-dom";
const { ethers } = require("ethers");


const TakeLoan = ({ signer, mainConfig, chainId }) => {
  const [tokenUri, setTokenUri] = useState("");
  const [tokenCounter, setTokenCounter] = useState(null);
  const [customTokenID, setCustomTokenID] = useState("");
  const [depositTokenID, setDepositTokenID] = useState("");
  const [borrowingPower, setBorrowingPower] = useState("");
  const [dusdBalance, setDUSDBalance] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [addressOfOwner, setAddressOfOwner] = useState("");

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

  const depositNFT = async () => {
    try {
      const tokenContractAddress = mainConfig.basicNFT.address; // Replace with the actual contract address
      console.log(tokenContractAddress);
      const tx = await mainConfig.lendBorrow.depositNFT(
        tokenContractAddress,
        depositTokenID
      );
      await tx.wait();
      console.log("NFT deposited successfully for Token ID:", depositTokenID);
      alert(
        "Now wait for 3 mins so that Borrowing Power Will be added on all chains"
      );
    } catch (error) {
      console.error("Error depositing NFT:", error);
    }
  };

  const checkOwnerOftNFT = async () => {
    try {
      const addressOfNFTOwner = await mainConfig.basicNFT.ownerOf(tokenId);
      setAddressOfOwner(addressOfNFTOwner);
      console.log(`Owner Of NFT is  ${addressOfOwner}`);
      // You can display the borrowing power or perform any other actions as needed.
    } catch (error) {
      console.error("Error checking borrowing power:", error);
    }
  };

  const checkBorrowingPower = async () => {
    try {
      // Call the contract's borrowingPowerInUSD function to get the borrowing power of the provided address
      const addressToCheck = await signer.getAddress();
      const borrowingPower = await mainConfig.lendBorrow.borrowingPowerInUSD(
        addressToCheck
      );
      const borrowingPowerInDecimal = parseInt(borrowingPower._hex, 16);
      setBorrowingPower(borrowingPowerInDecimal);
      console.log(
        `Borrowing power for address ${addressToCheck}: ${borrowingPower}`
      );
      // You can display the borrowing power or perform any other actions as needed.
    } catch (error) {
      console.error("Error checking borrowing power:", error);
    }
  };

  const withdrawTokens = async () => {
    if (borrowingPower <= 0) {
      alert("Check Borrowing Power First");
      return;
    } else {
      try {
        // Call the withdrawTokens function from your contract here
        const tx = await mainConfig.lendBorrow.withDrawTokens();
        await tx.wait();
        console.log("Tokens withdrawn successfully.");
        alert(
          "Now wait for 3 mins so that Borrowing Power Will be thrashed on all chains"
        );
      } catch (error) {
        console.error("Error withdrawing tokens:", error);
      }
    }
  };

  const checkDUSDBalance = async () => {
    try {
      // Call the contract's borrowingPowerInUSD function to get the borrowing power of the provided address
      const addressToCheck = await signer.getAddress();
      const dusdAmount = await mainConfig.lendBorrow.giveERC20TokensBalanceOfBorrower(
        addressToCheck
      );
      const dusdAmountInDecimal = parseInt(dusdAmount._hex, 16);
      setDUSDBalance(dusdAmountInDecimal);
      console.log(
        `DUSD Balance for address ${addressToCheck}: ${dusdAmountInDecimal}`
      );
      // You can display the borrowing power or perform any other actions as needed.
    } catch (error) {
      console.error("Error checking borrowing power:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {(chainId === 80001 && (
        <h1 className="text-xl text-center text-white mt-12">
          Active Chain is{" "}
          <span className="font-semibold text-red-500">Polygon</span>
        </h1>
      )) ||
        (chainId === 11155111 && (
          <h1 className="text-xl text-center text-white mt-12">
            Active Chain is{" "}
            <span className="font-semibold text-red-500">Sepolia</span>
          </h1>
        ))}

      <div className="shadow-[0.8px_0.8px_1px_1px_rgba(143,255,106,1)] flex flex-col gap-3 text-center p-5 px-6 max-w-6xl rounded-lg mx-auto mt-12">
        <h2 className="font-semibold text-xl text-primaryColor">Mint an NFT</h2>
        <input
          type="text"
          placeholder="Token URI"
          value={tokenUri}
          onChange={(e) => setTokenUri(e.target.value)}
          className="border border-subtitleColor focus:outline-none bg-transparent rounded-lg px-4 py-1"
        />
        <button onClick={mintNft} className="bg-cardBg rounded-lg px-4 py-1">
          Mint NFT
        </button>
      </div>

      <div className="shadow-[0.8px_0.8px_1px_1px_rgba(143,255,106,1)] flex flex-col gap-3 text-center p-5 px-6 max-w-6xl rounded-lg mx-auto mt-12">
        <h2 className="font-semibold text-xl text-primaryColor">
          Get The Latest Count of Available NFT
        </h2>
        <p className="text-subtitleColor">
          Current Token Counter is{" "}
          <span className="text-white font-medium">{tokenCounter}</span>
        </p>
        <button
          onClick={fetchTokenCounter}
          className="bg-cardBg rounded-lg px-4 py-1"
        >
          Get Latest Token Counter
        </button>
      </div>

      <div className="shadow-[0.8px_0.8px_1px_1px_rgba(143,255,106,1)] flex flex-col gap-3 text-center p-5 px-6 max-w-6xl rounded-lg mx-auto mt-12">
        <h2 className="font-semibold text-xl text-primaryColor">
          Approve Lend Borrow Contract to pull NFT
        </h2>
        <input
          type="text"
          placeholder="Nft Token ID"
          value={customTokenID}
          onChange={(e) => setCustomTokenID(e.target.value)}
          className="border border-subtitleColor focus:outline-none bg-transparent rounded-lg px-4 py-1"
        />
        <button
          onClick={approveAddress}
          className="bg-cardBg rounded-lg px-4 py-1"
        >
          Approve
        </button>
      </div>

      <h1 className="text-xl text-center text-white mt-12">
        <span className="font-semibold text-red-500">
          Wait for Owner to WhiteList Your NFT
        </span>
      </h1>

      <div className="shadow-[0.8px_0.8px_1px_1px_rgba(143,255,106,1)] flex flex-col gap-3 text-center p-5 px-6 max-w-6xl rounded-lg mx-auto mt-12">
        <h2 className="font-semibold text-xl text-primaryColor">Deposit NFT</h2>
        <input
          type="text"
          placeholder="Deposit Token ID"
          value={depositTokenID}
          onChange={(e) => setDepositTokenID(e.target.value)}
          className="border border-subtitleColor focus:outline-none bg-transparent rounded-lg px-4 py-1"
        />
        <button onClick={depositNFT} className="bg-cardBg rounded-lg px-4 py-1">
          Deposit NFT
        </button>
      </div>

      <div className="shadow-[0.8px_0.8px_1px_1px_rgba(143,255,106,1)] flex flex-col gap-3 text-center p-5 px-6 max-w-6xl rounded-lg mx-auto mt-12">
        <h2 className="font-semibold text-xl text-primaryColor">Check Owner</h2>
        <p className="subtitleColor text-primaryColor">
          Owner of NFT is {addressOfOwner}
        </p>
        <input
          type="text"
          placeholder="Token Id to Check"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="border border-subtitleColor focus:outline-none bg-transparent rounded-lg px-4 py-1"
        />
        <button
          onClick={checkOwnerOftNFT}
          className="bg-cardBg rounded-lg px-4 py-1"
        >
          Check Owner
        </button>
      </div>

      <h1 className="text-xl text-center text-white mt-12">
        <span className="font-semibold text-red-500">
          Waiting For Multi Chain call approx 3mins
        </span>
        <br />
        <span className="font-semibold text-green-500">
          Now You Can switch chain to check if you got the borrowing power or
          not
        </span>
      </h1>

      <div className="shadow-[0.8px_0.8px_1px_1px_rgba(143,255,106,1)] flex flex-col gap-3 text-center p-5 px-6 max-w-6xl rounded-lg mx-auto mt-12">
        <h2 className="font-semibold text-xl text-primaryColor">
          Borrowing Power is {borrowingPower}
        </h2>

        <button
          onClick={() => checkBorrowingPower()}
          className="bg-cardBg rounded-lg px-4 py-1"
        >
          Check Borrowing Power
        </button>
      </div>

      <div className="shadow-[0.8px_0.8px_1px_1px_rgba(143,255,106,1)] flex flex-col gap-3 text-center p-5 px-6 max-w-6xl rounded-lg mx-auto mt-12">
        <p className="font-semibold text-green-500">
          Your Borrowing Power is {borrowingPower}
        </p>

        <button
          onClick={withdrawTokens}
          className="bg-cardBg rounded-lg px-4 py-1"
        >
          Withdraw Tokens
        </button>
      </div>

      <div className="shadow-[0.8px_0.8px_1px_1px_rgba(143,255,106,1)] flex flex-col gap-3 text-center p-5 px-6 max-w-6xl rounded-lg mx-auto mt-12">
        <h2 className="font-semibold text-xl text-primaryColor">
          DUSD Token Balance is {dusdBalance}
        </h2>
        <button
          onClick={checkDUSDBalance}
          className="bg-cardBg rounded-lg px-4 py-1"
        >
          Check DUSD Balance
        </button>
      </div>

      <h1 className="text-xl text-center text-white mt-12">
        <span className="font-semibold text-red-500">
          Waiting For Multi Chain call approx 3mins
        </span>
        <br />
        <span className="font-semibold text-green-500">
          Now You Can switch chain to check if your borrowing power is removed
          not
        </span>
      </h1>

      <h1 className="text-xl text-center text-white mt-12">
        If You got the tokens then you can repay
        <br />
        <Link to='/repayloan'>
          <span className="font-semibold text-red-500">Loan Now</span>
        </Link>
      </h1>
    </div>
  );
};

export default TakeLoan;
