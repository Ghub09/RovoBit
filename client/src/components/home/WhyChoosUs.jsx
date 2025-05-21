import { useTranslation } from "react-i18next";
import ImgSrc from "../../assets/whyChooseUs.png";
import AnimatedHeading from "../../components/animation/AnimateHeading";

const WhyChoosUs = () => {
  const { t } = useTranslation();

  return (
    <section className=" whyChooseUs min-h-screen flex flex-col justify-center items-center bg-gradient">
      <AnimatedHeading>
        <h2 className="text-4xl font-bold text-white mb-10">
          {t("why_choose_us")}
        </h2>
      </AnimatedHeading>

      <div className="flex flex-col md:flex-row justify-center items-center">
        <div className="text-center w-[70vw] md:text-left md:w-[25vw] md:mr-8 mb-4 md:mb-0">
          <div className="flex justify-center items-center mb-4"></div>
          <h3 className="mt-4 font-semibold text-primary">
            {t("secure_trading")}
          </h3>
          <p className="mt-2 text-[#F5F5F5]">{t("secure_trading_desc")}</p>
        </div>
        <div className=" image mx-4 animate-up-down">
          <img src={ImgSrc} alt={t("why_choose_us")} />
        </div>
        <div className="w-[70vw] text-center md:text-right md:w-[25vw] md:ml-8 mt-4 md:mt-0">
          <h3 className="mt-4 font-semibold text-primary">
            {t("fast_transactions")}
          </h3>
          <p className="text-[#F5F5F5]">{t("fast_transactions_desc")}</p>
        </div>
      </div>
      <div className="w-[70vw] mt-8 md:w-[25vw] text-center">
        <h3 className="mt-4 font-semibold text-primary">
          {t("market_insights")}
        </h3>
        <p className=" text-[#F5F5F5]">{t("market_insights_desc")}</p>
      </div>
    </section>
  );
};

export default WhyChoosUs;
