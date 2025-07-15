import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  reducedMotion: boolean;
  particleCount: number;
  animationIntensity: 'low' | 'medium' | 'high';
}

export const usePerformanceOptimization = (): PerformanceMetrics => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    deviceType: 'desktop',
    reducedMotion: false,
    particleCount: 30,
    animationIntensity: 'high'
  });

  useEffect(() => {
    const detectDevice = (): 'mobile' | 'tablet' | 'desktop' => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    };

    const checkReducedMotion = (): boolean => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    const getParticleCount = (deviceType: string): number => {
      switch (deviceType) {
        case 'mobile': return 10;
        case 'tablet': return 20;
        default: return 30;
      }
    };

    const getAnimationIntensity = (deviceType: string, reducedMotion: boolean): 'low' | 'medium' | 'high' => {
      if (reducedMotion) return 'low';
      switch (deviceType) {
        case 'mobile': return 'low';
        case 'tablet': return 'medium';
        default: return 'high';
      }
    };

    const deviceType = detectDevice();
    const reducedMotion = checkReducedMotion();

    setMetrics({
      deviceType,
      reducedMotion,
      particleCount: getParticleCount(deviceType),
      animationIntensity: getAnimationIntensity(deviceType, reducedMotion)
    });

    const handleResize = () => {
      const newDeviceType = detectDevice();
      setMetrics(prev => ({
        ...prev,
        deviceType: newDeviceType,
        particleCount: getParticleCount(newDeviceType),
        animationIntensity: getAnimationIntensity(newDeviceType, prev.reducedMotion)
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return metrics;
};