"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

export default function useMenuScroll() {
  const [
    activeCategory,
    setActiveCategory,
  ] = useState("");

  const sectionsRef =
    useRef<
      Record<
        string,
        HTMLDivElement | null
      >
    >({});

  const registerSection = (
    category: string,
    element:
      | HTMLDivElement
      | null
  ) => {
    sectionsRef.current[
      category
    ] = element;
  };

  const scrollToCategory = (
    category: string
  ) => {
    const section =
      sectionsRef.current[
        category
      ];

    if (!section) return;

    section.scrollIntoView({
      behavior: "smooth",

      block: "start",
    });
  };

  useEffect(() => {
    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting
              ) {
                const id =
                  entry.target.getAttribute(
                    "data-category"
                  );

                if (id) {
                  setActiveCategory(
                    id
                  );
                }
              }
            }
          );
        },
        {
          threshold: 0.35,

          rootMargin:
            "-100px 0px -50% 0px",
        }
      );

    Object.values(
      sectionsRef.current
    ).forEach((section) => {
      if (section) {
        observer.observe(
          section
        );
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    activeCategory,

    registerSection,

    scrollToCategory,
  };
}