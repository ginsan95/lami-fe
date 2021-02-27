export function enumToArray<T>(values: any): T[] {
    return Object.values(values).filter(
        (val) => typeof val === 'number'
    ) as any;
}
