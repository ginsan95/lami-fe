import * as storageUtils from './storageUtils';

export function isDev() {
    return storageUtils.getLocalStorage('isDev') === 'true';
}

export function setIsDev(isDev: boolean) {
    if (isDev) {
        storageUtils.saveLocalStorage('isDev', 'true');
    } else {
        storageUtils.removeLocalStorage('isDev');
    }
}

window.setIsDev = setIsDev;
