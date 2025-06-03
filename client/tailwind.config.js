// import flowbite from "flowbite-react/tailwind";
// import withMT from "@material-tailwind/react/utils/withMT";
// export default withMT({
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
//   theme: {
//     extend: {},
//   },
//   plugins: [flowbite.plugin()],
// });

import flowbite from "flowbite-react/tailwind";
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  darkMode: ["class", '[data-theme="dark"]'], // supports manual and data attribute switching
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ...flowbite.content(), // spread the content array from flowbite
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#ffffff",
          dark: "#1a1a1a",
        },
        card: {
          light: "#f9f9f9",
          dark: "#2a2a2a",
        },
      },
    },
  },
  plugins: [
    ...flowbite.plugins(),
  ],
});
