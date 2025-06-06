import React, { useEffect, useState } from "react";
import "./style.css";
import { t } from "i18next";

const TypingText = () => {
  const fullText = t("trusted_trading");
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleTyping = () => {
      const updatedText = isDeleting
        ? fullText.substring(0, displayText.length - 1)
        : fullText.substring(0, displayText.length + 1);

      setDisplayText(updatedText);

      if (!isDeleting && updatedText === fullText) {
        setTimeout(() => setIsDeleting(true), 1_000);
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }

      setTypingSpeed(isDeleting ? 50 : 100);
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, fullText, typingSpeed]);

  return (
    <h1
      className="
        w-[260px]  h-[90px]   text-3xl           /* mobile */
        sm:w-[320px] sm:h-[110px] sm:text-4xl    /* small tablets */
        md:w-[600px] md:h-[150px] md:text-5xl    /* laptops/desktop */
        ml-4 md:ml-10 font-extrabold text-white leading-tight
      "
    >
      {displayText}
      <span className="blinking-cursor">|</span>
    </h1>
  );
};

export default TypingText;
