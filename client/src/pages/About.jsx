import { motion } from "framer-motion";
import Faqs from "../components/home/Faqs";
import AnimatedHeading from "../components/animation/AnimateHeading";

function About() {
  const features = [
    {
      title: "Secure Trading",
      description:
        "State-of-the-art security measures to protect your assets and transactions.",
      icon: "🔒",
    },
    {
      title: "Real-time Data",
      description:
        "Live market data and advanced charts for informed trading decisions.",
      icon: "📊",
    },
    {
      title: "Low Fees",
      description:
        "Competitive trading fees and transparent pricing structure.",
      icon: "💰",
    },
    {
      title: "24/7 Support",
      description:
        "Round-the-clock customer support to assist you with any issues.",
      icon: "🌐",
    },
  ];

  const faqs = [
    {
      question: "How do I start trading?",
      answer:
        "To start trading, simply create an account, complete the verification process, and deposit funds. You can then begin trading immediately.",
    },
    {
      question: "What are the trading fees?",
      answer:
        "Our trading fees are competitive and vary based on your trading volume. Maker fees start at 0.1% and taker fees at 0.2%.",
    },
    {
      question: "Is my crypto secure?",
      answer:
        "Yes, we implement industry-leading security measures including cold storage, 2FA, and regular security audits to protect your assets.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept various payment methods including bank transfers, credit/debit cards, and cryptocurrency deposits.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className=""
      >
        <div className="bg-gradient min-h-screen flex flex-col justify-center">
          <div className="text-center mb-12">
            <AnimatedHeading>
              <h1 className="text-4xl font-bold mb-4">About Our Platform</h1>
            </AnimatedHeading>
            <p className="text-light/60 max-w-2xl mx-auto">
              We're building the future of cryptocurrency trading with advanced
              technology, security, and user experience at our core.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-light/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <Faqs />
      </motion.div>
    </div>
  );
}

export default About;
