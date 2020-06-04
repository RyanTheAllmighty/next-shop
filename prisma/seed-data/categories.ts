import fs from 'fs';
import path from 'path';

export interface Category {
    name: string;
    children?: Category[];
}

const categories: Category[] = fs
    .readdirSync(path.join(__dirname, 'json'))
    .filter((filename) => filename.startsWith('categories-'))
    .map((filename) => JSON.parse(fs.readFileSync(path.join(__dirname, `json/${filename}`), 'utf-8')))
    .reduce((acc: Category[], array: Category[]) => (acc = acc.concat(array)), []) as Category[];

export default categories;
