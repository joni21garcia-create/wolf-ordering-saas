"use client";

import { motion } from "framer-motion";

interface Props {
  restaurant: any;
}

export default function SocialLinks({
  restaurant,
}: Props) {
  const socials = [
    {
      name: "Instagram",
      url: restaurant.instagram,
      icon: "📸",
    },
    {
      name: "Facebook",
      url: restaurant.facebook,
      icon: "👍",
    },
    {
      name: "TikTok",
      url: restaurant.tiktok,
      icon: "🎵",
    },
  ].filter((social) => social.url);

if (socials.length === 0) {
  return null;
}

return null;
}
