interface LocalStorage {
    name: string;
    isDev: string;
}

export function getLocalStorage(key: keyof LocalStorage): string | null {
    return localStorage.getItem(key);
}

export function saveLocalStorage(key: keyof LocalStorage, value: string) {
    localStorage.setItem(key, value);
}

export function removeLocalStorage(key: keyof LocalStorage) {
    localStorage.removeItem(key);
}
