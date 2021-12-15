module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "QuickStake",
  },
  plugins: [
    "gatsby-plugin-image",
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "G-JDNZMBXMXC",
        includeInDevelopment: false,
        defaultDataLayer: { platform: "gatsby" },
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
  ],
};
