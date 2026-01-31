// Performance monitoring utilities for production

// Web Vitals tracking - simplified without external dependency
export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Simple web vitals tracking without external dependency
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        // Track LCP
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          onPerfEntry({
            name: 'LCP',
            value: lastEntry.renderTime || lastEntry.loadTime
          });
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // Track FID
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            onPerfEntry({
              name: 'FID',
              value: entry.processingStart - entry.startTime
            });
          });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });

        // Track CLS
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              onPerfEntry({ name: 'CLS', value: clsValue });
            }
          });
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        // Track FCP
        const paintObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              onPerfEntry({ name: 'FCP', value: entry.startTime });
            }
          });
        });
        paintObserver.observe({ type: 'paint', buffered: true });
      } catch (e) {
        // Web vitals not available
        console.warn('Performance observers not supported');
      }
    }
  }
};

// Performance observer for monitoring
export const observePerformance = () => {
  if (typeof window === 'undefined' || !window.PerformanceObserver) {
    return;
  }

  // Long Tasks monitoring
  try {
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('Long task detected:', {
            duration: entry.duration,
            name: entry.name,
          });
        }
      }
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    // Long task observer not supported
  }

  // Layout shift monitoring
  try {
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ((entry as any).hadRecentInput) continue;
        console.log('Layout shift:', {
          value: (entry as any).value,
          sources: (entry as any).sources,
        });
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // Layout shift observer not supported
  }
};

// Measure component render time
export const measureRender = (componentName: string, callback: () => void) => {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  const renderTime = endTime - startTime;
  
  if (renderTime > 16) { // > 1 frame at 60fps
    console.warn(`Slow render detected: ${componentName}`, {
      duration: renderTime.toFixed(2) + 'ms',
    });
  }
  
  return renderTime;
};

// Track interaction timing
export const trackInteraction = (name: string, callback: () => void) => {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  if (duration > 100) {
    console.warn(`Slow interaction: ${name}`, {
      duration: duration.toFixed(2) + 'ms',
      target: '< 100ms',
    });
  }
  
  return duration;
};

// Bundle size monitor
export const logBundleSize = () => {
  if (typeof window === 'undefined') return;
  
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  console.group('Bundle Analysis');
  console.log('Scripts:', scripts.length);
  console.log('Stylesheets:', styles.length);
  console.groupEnd();
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (import.meta.env.PROD) {
    // Only enable in production
    observePerformance();
    
    // Log performance metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (import.meta.env.DEV) {
          console.log('Performance Metrics:', {
            'DNS Lookup': (perfData.domainLookupEnd - perfData.domainLookupStart).toFixed(2) + 'ms',
            'TCP Connection': (perfData.connectEnd - perfData.connectStart).toFixed(2) + 'ms',
            'Time to First Byte': (perfData.responseStart - perfData.requestStart).toFixed(2) + 'ms',
            'DOM Content Loaded': (perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart).toFixed(2) + 'ms',
            'Page Load': (perfData.loadEventEnd - perfData.loadEventStart).toFixed(2) + 'ms',
          });
        }
        
        reportWebVitals((metric) => {
          console.log('Web Vital:', metric.name, metric.value);
        });
      }, 0);
    });
  }
};
