import "./GradientText.css"; // Contains the gradient animation

// eslint-disable-next-line react/prop-types
const GradientText = ({ text }) => {
  return (
    <p className="gradient-text  font-bold 
                 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 
                 px-4 md:px-8">
      {text}
    </p>
  );
};

export default GradientText;
