const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
});


// module.exports = {
//   content: [
//     './src/**/*.{js,jsx,ts,tsx}',
//   ],
//   theme: {
//     extend: {
//       backgroundImage: {
//         'right-arrow': "url('https://cdn.iconscout.com/icon/free/png-64/right-arrow-1438234-1216195.png')",
//       },
//       transitionProperty: {
//         'height': 'height',
//         'spacing': 'margin, padding',
//       },
//       fontFamily: {
//         'custom': ['fangsong', '-webkit-pictograph', 'cursive', 'Georgia', 'Times New Roman', 'Times', 'serif'],
//       },
//       boxShadow: {
//         'custom': '0px 0px 10px 0px rgba(2, 101, 167, 0.801)',
//       },
//     },
//   },
//   plugins: [
//     function ({ addUtilities, addComponents }) {
//       const newUtilities = {
//         '.hover\\:rotate-10': {
//           'transform': 'rotate(10deg)',
//         },
//         '.transition-all': {
//           'transition': 'all 2s ease',
//         },
//         '.reveal': {
//           'transform': 'translateY(150px)',
//           'opacity': '0',
//         },
//         '.reveal.active': {
//           'transform': 'translateY(0px)',
//           'opacity': '1',
//         },
//       };
//       addUtilities(newUtilities, ['responsive', 'hover']);

//       const components = {
//         '.arr': {
//           'backgroundImage': 'url("https://cdn.iconscout.com/icon/free/png-64/right-arrow-1438234-1216195.png")',
//           'backgroundSize': 'cover',
//           'marginTop': '20px',
//           'marginLeft': '-5px',
//           'width': '15px',
//           'height': '15px',
//         },
//         '.brr': {
//           'backgroundImage': 'url("https://cdn.iconscout.com/icon/free/png-64/right-arrow-1438234-1216195.png")',
//           'backgroundSize': 'cover',
//           'marginTop': '20px',
//           'marginLeft': '-5px',
//           'width': '15px',
//           'height': '15px',
//         },
//         '.comm': {
//           'width': '100%',
//           'background': 'rgb(247, 189, 189)',
//           'height': '2%',
//           'padding': '0.5%',
//         },
//         '.comm1': {
//           'width': '0%',
//           'height': '100%',
//           'background': 'rgb(255, 23, 23)',
//           'transition': 'all 5s ease',
//         },
//         '.comm2': {
//           'width': '0%',
//           'height': '100%',
//           'background': 'rgb(241, 44, 44)',
//           'transition': 'all 5s ease',
//         },
//         '.comm3': {
//           'width': '0%',
//           'height': '100%',
//           'background': 'rgb(250, 61, 61)',
//           'transition': 'all 5s ease',
//         },
//       };
//       addComponents(components);
//     },
//   ],
//   corePlugins: {
//     preflight: false, // Disable Tailwind's base styles
//   },
// };
