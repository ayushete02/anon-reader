import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "media.mycomicshop.com",
        port: "",
        pathname: "/n_iv/**",
      },
      {
        protocol: "https",
        hostname: "knowherecomics.com",
        port: "",
        pathname: "/cdn/shop/products/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
        pathname: "/s/files/**",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "i.ebayimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "comicvine.gamespot.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.yourdecoration.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images-cdn.ubuy.co.in",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www..com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
