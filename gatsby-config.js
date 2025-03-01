const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = {
  siteMetadata: {
    title: `별빛나래`,
    description: `천체 달력과 기상 정보를 확인하고, 별자리를 생성하며, 관측 일기와 천체 사진을 공유할 수 있는 종합 천문 플랫폼`,
    author: `@Chanaping`,
  },
  graphqlTypegen: true,
  plugins: [`gatsby-plugin-typescript`, `gatsby-plugin-postcss`],
  developMiddleware: (app) => {
    // VWorld API 프록시 설정
    app.use(
        "/api", // 프록시 경로
        createProxyMiddleware({
          target: "https://api.vworld.kr", // VWorld API의 대상 URL
          changeOrigin: true, // CORS 문제 해결
          pathRewrite: {
            "^/api": "", // "/api" 경로를 제거하고 실제 API 경로로 매핑
          },
        })
    );
  },
};
