declare global {
    interface Window {
        setIsDev: (isDev: boolean) => void;
    }
}

export {};
