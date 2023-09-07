export declare const pathFromSrc: (path: string) => string;
export declare const rootProjectDir: () => string;
export declare const pathFromRoot: (path: string) => string;
export declare const getLoggerFor: (destination?: string) => Record<"error" | "warn" | "info", (...args: unknown[]) => unknown>;
export declare const getWorkerLogger: () => Record<"error" | "warn" | "info", (...args: unknown[]) => unknown>;
