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

const iconifyAllowList = new Set([
  "simple-icons:x",
  "simple-icons:twitter",
  "simple-icons:chess",
]);

const fallbackSources = {
  // Primary source - Iconify with specific icon sets
  iconify: (platform) => {
    const iconifyMappings = {
      chesscom: "simple-icons:chess",
      x: "simple-icons:x",
      twitter: "simple-icons:twitter",
      xtwitter: "simple-icons:x",
    };

    const iconName = iconifyMappings[platform];
    if (!iconName || !iconifyAllowList.has(iconName)) {
      return null;
    }
    return `https://api.iconify.design/${iconName}.svg`;
  },
  // Secondary source - Font Awesome
  fontAwesome: (platform) => {
    const faMapping = {
      x: "twitter-x",
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
    if (currentSource === 0) {
      const url = fallbackSources.iconify(normalizedPlatform);
      if (!url) {
        setCurrentSource(Object.values(fallbackSources).length - 1);
        return fallbackSources.default;
      }
      return url;
    }
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
