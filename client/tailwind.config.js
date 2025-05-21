import flowbite from "flowbite-react/tailwind";
import withMT from "@material-tailwind/react/utils/withMT";
export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {},
  },
  plugins: [flowbite.plugin()],
});
