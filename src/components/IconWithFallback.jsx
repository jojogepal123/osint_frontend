import React, { useState } from "react";

// Platform name mappings for various icon services
const iconMap = {
  "X (Twitter)": "twitter",
  "Google+": "google-plus",
  "Chess.com": "chesscom",
  "Picsart": "picsart",
  "X": "x",
  "x": "twitter",
};

const fallbackSources = {
  // Primary source - Iconify with specific icon sets
  iconify: (platform) => {
    // Special cases for specific platforms
    const iconifyMappings = {
      chesscom: "chess", // Map Chess.com to chess icon
      x: "simple-icons:x", // Use specific icon set for X
      twitter: "simple-icons:twitter", // Specific Twitter icon
      xtwitter: "simple-icons:x", // Handle xtwitter case
    };

    const iconName = iconifyMappings[platform] || `simple-icons:${platform}`;
    return `https://api.iconify.design/${iconName}.svg`;
  },
  // Secondary source - Font Awesome
  fontAwesome: (platform) => {
    // Special cases for Font Awesome
    const faMapping = {
      x: "twitter-x", // Font Awesome's name for X
      chesscom: "chess",
      xtwitter: "twitter-x",
    };
    const faName = faMapping[platform] || platform;
    return `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/brands/${faName}.svg`;
  },
  default: "https://api.iconify.design/lucide:help-circle.svg",
};

export default function IconWithFallback({ platform, size = 20 }) {
  const [currentSource, setCurrentSource] = useState(0);
  const normalizedPlatform =
    iconMap[platform] || platform.toLowerCase().replace(/[\s().+]/g, "");

  // Get current icon URL based on fallback state
  const getIconUrl = () => {
    const sources = Object.values(fallbackSources);
    if (currentSource >= sources.length - 1) {
      return fallbackSources.default;
    }
    const currentProvider = sources[currentSource];
    return typeof currentProvider === "function"
      ? currentProvider(normalizedPlatform)
      : currentProvider;
  };
  const handleError = (e) => {
    if (currentSource >= Object.values(fallbackSources).length - 1) {
      e.target.onerror = null;
      return;
    }
    setCurrentSource((prev) => prev + 1);
  };

  return (
    <img
      src={getIconUrl()}
      alt={platform}
      loading="lazy"
      className="object-contain"
      style={{ width: size, height: size, filter: "invert(1)" }}
      onError={handleError}
    />
  );
}
