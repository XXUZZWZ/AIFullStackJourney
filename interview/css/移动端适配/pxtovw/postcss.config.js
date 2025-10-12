export default {
  plugins: {
    "postcss-px-to-viewport-8-plugin": {
      viewportWidth: 375,
      viewportHeight: 667,
      unitToConvert: "px",
      unitPrecision: 5,
      viewportUnit: "vw",
      fontViewportUnit: "vw",
      selectorBlackList: ["ignore"],
      minPixelValue: 1,
      mediaQuery: false,
      propList: ["*"],
    },
  },
};
