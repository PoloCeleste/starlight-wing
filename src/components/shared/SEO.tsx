import React from "react";

interface SEOProps {
  title?: string;
  description?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description }) => {
  const defaultTitle = "별빛나래";
  const defaultDescription =
    "천체 달력과 기상 정보를 확인하고, 별자리를 생성하며, 관측 일기와 천체 사진을 공유할 수 있는 종합 천문 플랫폼";

  return (
    <>
      <title>{title ? `${title} | ${defaultTitle}` : defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
    </>
  );
};

export default SEO;
