import { useTranslation } from "react-i18next";
import ImgSrc from "../../assets/whyChooseUs.png";
import AnimatedHeading from "../../components/animation/AnimateHeading";
import { motion } from "framer-motion";

const features = [
  { key: "secure_trading", desc: "secure_trading_desc" },
  { key: "fast_transactions", desc: "fast_transactions_desc" },
  { key: "market_insights", desc: "market_insights_desc" }
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: i => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.2 + i * 0.15, duration: 0.7, type: "spring" }
  })
};

const WhyChoosUs = () => {
  const { t } = useTranslation();

  return (
    <section className="whyChooseUs min-h-screen flex flex-col justify-center items-center relative z-10 py-4 overflow-hidden">
      
      {/* Animated moving background image */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <motion.img
          src={ImgSrc}
          alt=""
          aria-hidden="true"
          className="w-[80vw] max-w-[600px] opacity-30 blur-[4px] select-none moving-bg-img"
          initial={{ scale: 1, x: 0, y: 0 }}
          animate={{
            scale: [1, 1.5, 1, 0.96, 1],
            x: [0, 20, 40, 10, 0],
            y: [0, 16, -8, -14, 0]
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Section content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <AnimatedHeading>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 drop-shadow-lg text-center">
            {t("why_choose_us")}
          </h2>
        </AnimatedHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-4 w-full md:w-[95vw]">
          {features.map((f, idx) => (
            <motion.div
              key={f.key}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={idx}
              className={`
                p-4 rounded-2xl bg-[rgba(30,30,45,0.68)] backdrop-blur-xl shadow-xl 
                text-center
                hover:scale-105 transition-transform duration-300 focus-within:scale-105
              `}
              tabIndex={0}
              aria-label={t(f.key)}
            >
              <h3 className="text-primary text-2xl md:text-2xl font-bold mb-2">
                {t(f.key)}
              </h3>
              <p className="text-[#F5F5F5] text-base md:text-lg">{t(f.desc)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoosUs;