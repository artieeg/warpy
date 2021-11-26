const withTM = require("next-transpile-modules")(["@warpy/components"]);

module.exports = withTM({
  future: {
    webpack5: true,
  },
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // @todo remove this once storybook is fixed
    // !! WARN !!
    // ignoreBuildErrors: true,
  },
});

/*
module.exports = {
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      "react-native$": "react-native-web",
    };
    config.resolve.extensions = [
      ".web.js",
      ".web.ts",
      ".web.tsx",
      ".tsx",
      ...config.resolve.extensions,
    ];
    return config;
  },
};
*/
