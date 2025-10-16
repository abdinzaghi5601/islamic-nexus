'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollToAnchor - Handles automatic scrolling to hash anchors
 *
 * This component automatically scrolls to the element with the ID matching
 * the URL hash when the page loads or when the hash changes.
 *
 * Example: /quran/2#ayah-255 will scroll to the element with id="ayah-255"
 */
export default function ScrollToAnchor() {
  const pathname = usePathname();

  useEffect(() => {
    // Get hash from URL (e.g., #ayah-255)
    const hash = window.location.hash;

    if (hash) {
      // Remove the # to get the element ID
      const elementId = hash.substring(1);

      // Small delay to ensure the page has fully rendered
      setTimeout(() => {
        const element = document.getElementById(elementId);

        if (element) {
          // Smooth scroll to the element
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center', // Center the element in the viewport
          });

          // Optional: Add a highlight effect
          element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
          }, 2000); // Remove highlight after 2 seconds
        }
      }, 100); // 100ms delay
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
