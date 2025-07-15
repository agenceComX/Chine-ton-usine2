// Utilitaire pour l'optimisation des images
export const imageOptimization = {
  // Lazy loading des images
  lazyLoadImage: (src: string, alt: string = '', className: string = '') => {
    return {
      src,
      alt,
      className,
      loading: 'lazy' as const,
      decoding: 'async' as const,
    };
  },

  // Responsive images avec WebP support
  responsiveImage: (basePath: string, alt: string = '', sizes: string = '100vw') => {
    return {
      src: `${basePath}.jpg`,
      srcSet: `
        ${basePath}-320w.webp 320w,
        ${basePath}-640w.webp 640w,
        ${basePath}-1024w.webp 1024w,
        ${basePath}-1920w.webp 1920w
      `,
      sizes,
      alt,
      loading: 'lazy' as const,
      decoding: 'async' as const,
    };
  },

  // Preload des images critiques
  preloadImage: (src: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  }
};

// Hook pour optimiser les images
import { useEffect, useState } from 'react';

export const useOptimizedImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    img.src = src;
  }, [src]);

  return { imageSrc, isLoaded };
};
