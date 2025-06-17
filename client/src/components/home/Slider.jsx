import React from "react";
import AnimatedHeading from "../../components/animation/AnimateHeading";

const Slider = () => {
  return (
    <div>
      <section className="slide bg-gradient">
        <div className="heading flex justify-center">
          <AnimatedHeading>
            <h2 className="w-[90vw] sm:w-[70vw] lg:w-[60vw] text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl py-12 sm:py-16 font-bold leading-snug">
              Trade Cryptocurrency Safely and Securely<br />
              Your Assets, Our Top Priority
            </h2>
          </AnimatedHeading>
        </div>

        <div className="overflow-hidden whitespace-nowrap h-16 sm:h-20 bg-transparent text-secondary py-3 flex justify-center items-center text-lg sm:text-xl md:text-2xl font-bold border-t-[.5px] border-[#EAEAEA]">
          <marquee behavior="scroll" direction="left">
            <span className="px-8 sm:px-16">Bitcoin (BTC)</span>
            <span className="px-8 sm:px-16">Ethereum (ETH)</span>
            <span className="px-8 sm:px-16">Tether (USDT)</span>
            <span className="px-8 sm:px-16">USD Coin (USDC)</span>
            <span className="px-8 sm:px-16">Binance Coin (BNB)</span>
            <span className="px-8 sm:px-16">Ripple (XRP)</span>
            <span className="px-8 sm:px-16">Cardano (ADA)</span>
            <span className="px-8 sm:px-16">Binance USD (BUSD)</span>
          </marquee>
        </div>
      </section>
    </div>
  );
};

export default Slider;
