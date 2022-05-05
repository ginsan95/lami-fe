interface LocalStorage {
    name: string;
    isDev: string;
    hostIp: string;
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

export function getSessionStorage(key: keyof LocalStorage): string | null {
    return sessionStorage.getItem(key);
}

export function saveSessionStorage(key: keyof LocalStorage, value: string) {
    sessionStorage.setItem(key, value);
}

export function removeSessionStorage(key: keyof LocalStorage) {
    sessionStorage.removeItem(key);
}
