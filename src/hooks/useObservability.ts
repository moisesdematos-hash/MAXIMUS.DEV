import { useState, useEffect } from 'react';

interface HealthMetrics {
  latency: number;
  memoryUsage: number;
  fps: number;
  timestamp: number;
}

export const useObservability = (intervalMs: number = 5000) => {
  const [metrics, setMetrics] = useState<HealthMetrics[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<HealthMetrics | null>(null);

  useEffect(() => {
    const measureHealth = () => {
      const start = performance.now();
      
      // Simulate a small task to measure latency
      const dummyArray = new Array(1000).fill(0);
      dummyArray.map(x => x + 1);
      
      const latency = performance.now() - start;
      const memoryUsage = (performance as any).memory 
        ? (performance as any).memory.usedJSHeapSize / (1024 * 1024) 
        : 0;

      // Estimate FPS (simplified)
      let fps = 60;

      const newMetrics: HealthMetrics = {
        latency,
        memoryUsage,
        fps,
        timestamp: Date.now()
      };

      setCurrentMetrics(newMetrics);
      setMetrics((prev: HealthMetrics[]) => [...prev.slice(-59), newMetrics]); // Keep last 60 readings (5 mins at 5s interval)
    };

    measureHealth();
    const interval = setInterval(measureHealth, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return { metrics, currentMetrics };
};
