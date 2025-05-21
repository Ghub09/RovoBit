import React from "react";
import AnimatedHeading from "../../components/animation/AnimateHeading";

const Slider = () => {
  return (
    <div>
      <section className="slide bg-gradient ">
        <div className="heading flex justify-center">
          <AnimatedHeading>
            <h2 className="w-[60vw] text-center text-4xl py-20 font-bold">
            Trade Cryptocurrency Safely and Securely
            Your Assets, Our Top Priority
            </h2>
          </AnimatedHeading>
        </div>

        <div className="overflow-hidden whitespace-nowrap h-20 bg-transparent text-secondary py-3 flex justify-center items-center text-2xl font-bold border-t-[.5px] border-[#EAEAEA]">
          <marquee behavior="scroll" direction="left">
            <span className="px-16">Bitcoin (BTC)</span>
            <span className="px-16">Ethereum (ETH)</span>
            <span className="px-16">Tether (USDT)</span>
            <span className="px-16">USD Coin (USDC)</span>
            <span>Binance Coin (BNB)</span>
            <span className="px-16">Ripple (XRP)</span>
            <span className="px-16">Cardano (ADA)</span>
            <span className="px-16">Binance USD (BUSD)</span>
          </marquee>
        </div>
      </section>
    </div>
  );
};

export default Slider;
