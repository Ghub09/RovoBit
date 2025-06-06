import { useTranslation } from "react-i18next";
import CountUp from "react-countup";
import HeroImgSrc from "../../assets/hero.png";
import TypingText from "../TypingText/TypingText";

const Hero = () => {
  const { t } = useTranslation();

  const counts = [
    {
      index: 1,
      end: 73,
      symbol: "M $",
      text: t("trading_volume"),
    },
    {
      index: 2,
      end: 30,
      symbol: "+",
      text: t("integrated_trade"),
    },
    {
      index: 3,
      end: 20,
      symbol: "M +",
      text: t("users"),
    },
  ];

  return (
    <section className="heroSection min-h-screen bg-gradient border px-6 py-12 flex flex-col justify-center items-center font-sans">
      <div className="wrapper flex flex-col md:flex-row justify-center items-center w-full max-w-7xl">
        <div className="first text-center md:text-left md:mr-12 mb-10 md:mb-0">
          <div className="heading space-y-4">
            {/* <h1 className="text-4xl md:text-6xl ml-10 font-extrabold text-white leading-tight">
              {t("trusted_trading")}
            </h1> */}
            <TypingText/>
            <p className="text-3xl md:text-4xl ml-10 text-primary">
              {t("trade_safely")}
            </p>
          </div>
        </div>

        <div className="second">
          <div className="heroImage w-[70vw] md:w-[30vw] rotate-[-27deg] animate-up-down">
            <img src={HeroImgSrc} alt={t("hero")} className="w-full h-auto" />
          </div>
        </div>
      </div>

      <div className="overView mt-16 w-full flex flex-col md:flex-row justify-evenly items-center text-center gap-8">
        {counts.map((count) => (
          <div className="stat flex flex-col items-center" key={count.index}>
            <p className="count text-3xl font-semibold text-primary">
              <CountUp end={count.end} duration={2} /> {count.symbol}
            </p>
            <p className="text-base text-tertiary3 mt-2">{count.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
