import { difference } from 'lodash';

const names = [
    'Liam',
    'Noah',
    'Oliver',
    'Elijah',
    'William',
    'James',
    'Benjamin',
    'Lucas',
    'Henry',
    'Alexander',
    'Mason',
    'Michael',
    'Ethan',
    'Daniel',
    'Jacob',
    'Logan',
    'Jackson',
    'Levi',
    'Sebastian',
    'Mateo',
];

export function getRandomName(existingNames: string[] = []): string {
    const remainingNames = difference(names, existingNames);
    const index = Math.floor(Math.random() * remainingNames.length);
    return remainingNames[index];
}

export default names;
