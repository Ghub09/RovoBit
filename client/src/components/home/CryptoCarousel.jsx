import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import AnimatedHeading from "../../components/animation/AnimateHeading";
import { useNavigate } from "react-router-dom";
import btcLogo from "../../assets/btc.png";
// import btcLogo from "../../assets/btc.svg";
import ethLogo from '../../assets/eth.png';
import bnbLogo from '../../assets/bnb.png';
import adaLogo from '../../assets/ada.png';

const CryptoCarousel = () => {
  const navigate =useNavigate();
  return (
    <section className="cryptoCarousel min-h-screen px-4 md:px-0 pt-[30vh] bg-gradient text-white text-center">
      <div>
        <AnimatedHeading>
          <h2 className="text-4xl font-bold mb-24 text-white ">
            Crypto Trading Pairs
          </h2>
        </AnimatedHeading>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="p-6 bg-[#2A2A2A] rounded-lg shadow-md">
              <img src={btcLogo} alt="BTC" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary">BTC/USDT</h3>
              <p className="mt-2 text-[#00FF7F]">+2.5%</p>
              <p className="mt-2 text-[#F5F5F5]">24h Volume: $50M</p>
              <div className="mt-4">
                <button
                  onClick={() => {
                    navigate("/trade");
                  }}
                  className="px-4 py-2 bg-[#1E90FF] text-white rounded-full hover:bg-[#00FF7F] transition-colors duration-300"
                >
                  Trade Now
                </button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="p-6 bg-[#2A2A2A] rounded-lg shadow-md">
              <img src={ethLogo} alt="ETH" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary">ETH/USDT</h3>
              <p className="mt-2 text-[#D32F2F]">-1.2%</p>
              <p className="mt-2 text-[#F5F5F5]">24h Volume: $30M</p>
              <div className="mt-4">
                <button
                  onClick={() => {
                    navigate("/trade");
                  }}
                  className="px-4 py-2 bg-[#1E90FF] text-white rounded-full hover:bg-[#00FF7F] transition-colors duration-300"
                >
                  Trade Now
                </button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="p-6 bg-[#2A2A2A] rounded-lg shadow-md">
              <img src={bnbLogo} alt="BNB" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary">BNB/USDT</h3>
              <p className="mt-2 text-[#00FF7F]">+3.8%</p>
              <p className="mt-2 text-[#F5F5F5]">24h Volume: $20M</p>
              <div className="mt-4">
                <button
                  onClick={() => {
                    navigate("/trade");
                  }}
                  className="px-4 py-2 bg-[#1E90FF] text-white rounded-full hover:bg-[#00FF7F] transition-colors duration-300"
                >
                  Trade Now
                </button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="p-6 bg-[#2A2A2A] rounded-lg shadow-md">
              <img src={adaLogo} alt="ADA" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary">ADA/USDT</h3>
              <p className="mt-2 text-[#D32F2F]">-0.5%</p>
              <p className="mt-2 text-[#F5F5F5]">24h Volume: $10M</p>
              <div className="mt-4">
                <button
                  onClick={() => {
                    navigate("/trade");
                  }}
                  className="px-4 py-2 bg-[#1E90FF] text-white rounded-full hover:bg-[#00FF7F] transition-colors duration-300"
                >
                  Trade Now
                </button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default CryptoCarousel;
