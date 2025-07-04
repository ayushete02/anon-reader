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
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "gateway.lighthouse.storage",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "letsenhance.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cryptologos.cc",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.coinbase.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
