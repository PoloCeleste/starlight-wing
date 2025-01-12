const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = {
  siteMetadata: {
    title: `별빛나래`,
    description: `천체 달력과 기상 정보를 확인하고, 별자리를 생성하며, 관측 일기와 천체 사진을 공유할 수 있는 종합 천문 플랫폼`,
    author: `@Chanaping`,
  },
  flags: {
    DEV_SSR: true,
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true,
        jsxPragma: `React`,
        allExtensions: true,
      },
    },
  ],
  developMiddleware: (app) => {
    app.use(
      "/api",
      createProxyMiddleware({
        target: "https://api.vworld.kr",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      })
    );
  },
};
