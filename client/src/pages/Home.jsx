import Hero from "../components/home/Hero.jsx";
import CryptoCarousel from "../components/home/CryptoCarousel.jsx";
import Testimonials from "../components/home/Testimonials.jsx";
import WhyChoosUs from "../components/home/WhyChoosUs.jsx";
import Faqs from "../components/home/Faqs.jsx";
import Slider from "../components/home/Slider.jsx";
import AnimatedSection from "../components/animation/AnimateSection";
import NewsSection from "../components/home/NewsSection.jsx";

const Home = () => {
  
  return (
    
      <div className="home">
        <AnimatedSection>
          <Hero />
          <NewsSection />
          <CryptoCarousel />
          <Testimonials />
          <WhyChoosUs />
          <Faqs />
          <Slider />
        </AnimatedSection>
      </div>
    
  );
};

export default Home;
