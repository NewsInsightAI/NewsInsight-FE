"use client";
import { useEffect, useState } from "react";

/**
 * Custom hook untuk mendeteksi tinggi navbar secara real-time
 * Menggunakan ResizeObserver dan querySelector untuk akurasi tinggi
 */
export const useNavbarHeight = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const updateNavbarHeight = () => {
      // Cari elemen navbar berdasarkan selector yang spesifik
      const navbar = document.querySelector(
        'nav[data-navbar="true"]'
      ) as HTMLElement;

      if (navbar) {
        // Dapatkan tinggi sebenarnya termasuk padding dan border
        const rect = navbar.getBoundingClientRect();
        setNavbarHeight(rect.height);
      } else {
        // Fallback: cari berdasarkan class atau struktur
        const navbarByClass = document.querySelector(
          ".navbar-container"
        ) as HTMLElement;
        if (navbarByClass) {
          const rect = navbarByClass.getBoundingClientRect();
          setNavbarHeight(rect.height);
        } else {
          // Fallback terakhir: cari berdasarkan fixed position
          const fixedElements = document.querySelectorAll('[class*="fixed"]');
          for (const element of fixedElements) {
            const el = element as HTMLElement;
            const style = window.getComputedStyle(el);
            if (
              style.position === "fixed" &&
              style.top === "0px" &&
              style.zIndex
            ) {
              const zIndex = parseInt(style.zIndex);
              if (zIndex >= 40) {
                // Navbar biasanya punya z-index tinggi
                const rect = el.getBoundingClientRect();
                setNavbarHeight(rect.height);
                break;
              }
            }
          }
        }
      }
    };

    // Update tinggi saat komponen mount
    updateNavbarHeight();

    // Observer untuk mendeteksi perubahan ukuran navbar
    let resizeObserver: ResizeObserver | null = null;

    const setupObserver = () => {
      const navbar =
        (document.querySelector('nav[data-navbar="true"]') as HTMLElement) ||
        (document.querySelector(".navbar-container") as HTMLElement);

      if (navbar && ResizeObserver) {
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            setNavbarHeight(entry.contentRect.height);
          }
        });

        resizeObserver.observe(navbar);
      }
    };

    // Setup observer setelah DOM ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", setupObserver);
    } else {
      setupObserver();
    }

    // Listener untuk resize window
    const handleResize = () => {
      setTimeout(updateNavbarHeight, 100); // Debounce
    };

    window.addEventListener("resize", handleResize);

    // Listener untuk perubahan orientasi (mobile)
    window.addEventListener("orientationchange", () => {
      setTimeout(updateNavbarHeight, 200);
    });

    // Cleanup
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      document.removeEventListener("DOMContentLoaded", setupObserver);
    };
  }, []);

  return navbarHeight;
};

/**
 * Hook untuk mendapatkan style padding top berdasarkan tinggi navbar
 */
export const useNavbarPadding = () => {
  const navbarHeight = useNavbarHeight();

  return {
    paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : "80px", // fallback 80px
    style: {
      paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : "80px",
    },
    className: "", // Tidak menggunakan class karena kita pakai style inline
    height: navbarHeight,
  };
};
