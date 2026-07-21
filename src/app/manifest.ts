import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Ramble | Kalamazoo, MI",
    short_name: "The Ramble",
    description:
      "Weekly group rides in Kalamazoo, MI — Mondays and Thursdays.",
    start_url: "/",
    display: "standalone",
    background_color: "#1a100c",
    theme_color: "#c84b11",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
