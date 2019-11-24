interface PerformancePlugin {
    startTrace: (name: string) => void;
    incrementMetric: (name1: string, name2: string) => void;
    stopTrace: (name: string) => void;
}

interface Window {
    FirebasePerformance: PerformancePlugin;
} 	