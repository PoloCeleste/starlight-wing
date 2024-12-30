import React, { useEffect } from "react";
import { Link, navigate } from "gatsby";
import { api, authStore } from "../../api/apiClient";
import Layout from "../layout/Layout";

const Post: React.FC<Post> = (results) => {
  useEffect(() => {
    authStore.getAccessToken() ? "" : navigate("/login");
  }, []);
  return (
    <Layout title={`${results}번째 게시물`}>
      <div></div>
    </Layout>
  );
};

export default Post;
