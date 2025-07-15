import React, { useState, useRef, useEffect, memo } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholder?: string;
    fallback?: string;
    loading?: 'lazy' | 'eager';
    onLoad?: () => void;
    onError?: () => void;
    width?: number;
    height?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
    src,
    alt,
    className = '',
    placeholder = '/placeholder.svg',
    fallback = '/error.svg',
    loading = 'lazy',
    onLoad,
    onError,
    width,
    height
}) => {
    const [imageSrc, setImageSrc] = useState(loading === 'eager' ? src : placeholder);
    const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
    const imgRef = useRef<HTMLImageElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Preload de l'image
    const preloadImage = (imageSrc: string) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageSrc;
        });
    };

    // Intersection Observer pour le lazy loading
    useEffect(() => {
        if (loading === 'eager') return;

        const currentImgRef = imgRef.current;
        if (!currentImgRef) return;

        observerRef.current = new IntersectionObserver(
            async (entries) => {
                const [entry] = entries;

                if (entry.isIntersecting) {
                    try {
                        await preloadImage(src);
                        setImageSrc(src);
                        setImageStatus('loaded');
                        onLoad?.();
                    } catch (error) {
                        setImageSrc(fallback);
                        setImageStatus('error');
                        onError?.();
                    } finally {
                        if (observerRef.current && currentImgRef) {
                            observerRef.current.unobserve(currentImgRef);
                        }
                    }
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        observerRef.current.observe(currentImgRef);

        return () => {
            if (observerRef.current && currentImgRef) {
                observerRef.current.unobserve(currentImgRef);
            }
        };
    }, [src, fallback, onLoad, onError, loading]);

    // Gestion de l'erreur de chargement
    const handleImageError = () => {
        if (imageSrc !== fallback) {
            setImageSrc(fallback);
            setImageStatus('error');
            onError?.();
        }
    };

    const handleImageLoad = () => {
        if (imageStatus !== 'loaded') {
            setImageStatus('loaded');
            onLoad?.();
        }
    };

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <img
                ref={imgRef}
                src={imageSrc}
                alt={alt}
                className={`transition-opacity duration-300 ${imageStatus === 'loading' && loading === 'lazy' ? 'opacity-50' : 'opacity-100'
                    } ${className}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                width={width}
                height={height}
                loading={loading}
            />

            {/* Indicateur de chargement */}
            {imageStatus === 'loading' && loading === 'lazy' && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            )}
        </div>
    );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
