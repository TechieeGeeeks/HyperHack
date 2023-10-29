import React, { useEffect, useState } from "react";
import Navbar from "./comp/Navbar";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import TakeLoan from "./comp/TakeLoan";
import RepayLoan from "./comp/RepayLoan";
import LiquidateNFT from "./comp/LiauidateNFT";

/* Sepolia Config */
import {
  LendBorrowContractAddressOnSepolia,
  LendBorrowContractABIOnSepolia,
} from "./contract_Config/contract_Config/SEPOLIA/LendBorrowConfig";
import {
  BasicNFTContractAddressOnSepolia,
  BasicNFTContractABIOnSepolia,
} from "./contract_Config/contract_Config/SEPOLIA/BasicNFTConfig";

/* Polygon Config */
import {
  LendBorrowContractABIOnPolygon,
  LendBorrowContractAddressOnPolygon,
} from "./contract_Config/contract_Config/POLYGON/LendBorrowConfig";
import {
  BridgeContractAddressOnPolygon,
  BridgeContractABIOnPolygon,
} from "./contract_Config/contract_Config/POLYGON/BridgeConfig";
import {
  BasicNFTContractAddressOnPolygon,
  BasicNFTContractABIOnPolygon,
} from "./contract_Config/contract_Config/POLYGON/BasicNFTConfig";
import Footer from "./comp/Footer";

const { ethers } = require("ethers");

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [showConnectButton, setShowConnectButton] = useState(false);
  const [sepoliaConfig, setSepoliaConfig] = useState({
    lendBorrow: null,
    basicNFT: null,
  });
  const [polygonConfig, setPolygonConfig] = useState({
    lendBorrow: null,
    basicNFT: null,
  });
  const [chainId, setChainId] = useState(null);

  const [mainConfig, setMainConfig] = useState(null);

  const connectWallet = async () => {
    
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      try {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setSigner(signer);
        await connectContract(signer);
      } catch (error) {
        console.error(error);
        setShowConnectButton(true);
      }
    } else {
      setShowConnectButton(true);
    }
  };

  const connectContract = async (signer) => {
    const chainId = await signer.getChainId();
    if (chainId === 80001) {
      setChainId(80001);
      console.log("Polygon");
      const lendBorrowContractOnPolygon = new ethers.Contract(
        LendBorrowContractAddressOnPolygon,
        LendBorrowContractABIOnPolygon,
        signer
      );
      const nftContractOnPolygon = new ethers.Contract(
        BasicNFTContractAddressOnPolygon,
        BasicNFTContractABIOnPolygon,
        signer
      );
      setPolygonConfig({
        lendBorrow: lendBorrowContractOnPolygon,
        basicNFT: nftContractOnPolygon,
      });
      setMainConfig({
        lendBorrow: lendBorrowContractOnPolygon,
        basicNFT: nftContractOnPolygon,
      });
    } else {
      console.log("Sepolia");
      setChainId(11155111);
      const lendBorrowContractOnSepolia = new ethers.Contract(
        LendBorrowContractAddressOnSepolia,
        LendBorrowContractABIOnSepolia,
        signer
      );
      
      const nftContractOnSepolia = new ethers.Contract(
        BasicNFTContractAddressOnSepolia,
        BasicNFTContractABIOnSepolia,
        signer
      );
      setSepoliaConfig({
        lendBorrow: lendBorrowContractOnSepolia,
        basicNFT: nftContractOnSepolia,
      });
      setMainConfig({
        lendBorrow: lendBorrowContractOnSepolia,
        basicNFT: nftContractOnSepolia,
      });
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    } else {
      setShowConnectButton(true);
    }
  }, []);

  return (
    <div className="px-8 md:px-16">
      <Navbar />
      {provider ? (
        <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/takeLoan" element={<TakeLoan signer={signer} mainConfig={mainConfig} chainId={chainId}  />} />
          <Route path="/repayLoan" element={<RepayLoan signer={signer} mainConfig={mainConfig}/>}  chainId={chainId} />
          <Route path="/liquidateNFT" element={<LiquidateNFT signer={signer} mainConfig={mainConfig}  chainId={chainId}/>} />
        </Routes>
      {/* ) : (    */}
          {showConnectButton ? (
            <div>
              <button
                className="md:ml-10 font-semibold bg-primaryColor p-4 px-8 text-backgroundColor rounded-lg mt-8"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
              <p>
                If you don't have MetaMask installed, you can{" "}
                <a
                  href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  install it from the Chrome Web Store
                </a>
                .
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
      <Footer />     
    </div>
  );
};

export default App;
