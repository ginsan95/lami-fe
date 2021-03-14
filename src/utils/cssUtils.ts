export function joinClassNames(...classNames: (string | undefined)[]): string {
    return classNames.filter((val) => val).join(' ');
}
