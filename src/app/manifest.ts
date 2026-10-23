import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MW4 DMZ Companion",
    short_name: "DMZ Companion",
    description: "Unofficial second-screen companion for MW4 DMZ.",
    start_url: "/",
    display: "standalone",
    background_color: "#1a1d17",
    theme_color: "#1a1d17",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
