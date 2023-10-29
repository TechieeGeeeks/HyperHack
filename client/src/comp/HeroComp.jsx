import React from "react";
import heroAnimation from "../img/heroAnimation.json";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";

const HeroComp = () => {
  return (
    <div className="md:grid md:grid-flow-col md:gap-16 md:mt-20 justify-center">
      <div className="md:hidden flex col-span-2 text-center md:text-left mt-6 md:mt-0 text-[3.5rem] md:text-[9.5rem] font-extrabold leading-tight">
        Start Making Money With NFT's
      </div>

      <div className="row-span-3 flex flex-col -mt-10">
        <Lottie animationData={heroAnimation} />

        <p className=" opacity-75 md:pl-10 text-center md:text-left text-sm">
          Welcome to the Cross Chain NFT Lending Platform, a revolutionary
          decentralized finance (DeFi) project that empowers NFT holders to
          leverage the value of their NFT assets across different blockchain
          networks. With this platform, you can borrow funds against your NFT
          holdings and maintain the health of your NFTs on various chains
          without the hassle of dealing with multiple platforms.
        </p>
        <Link to="/takeLoan">
          <button className=" w-[87%] md:ml-10 font-semibold bg-primaryColor p-4 px-8 text-backgroundColor rounded-lg mt-8">
            Take Loan
          </button>
        </Link>
      </div>

      <div className="hidden md:flex col-span-2 text-center md:text-left mt-6 md:mt-0 text-[3.5rem] md:text-[8.5rem] font-extrabold leading-tight">
        Start Making Money With NFT's
      </div>
      {/* <div class="row-span-2 col-span-2">03</div> */}
    </div>
  );
};

export default HeroComp;
