import fs from 'fs';
import path from 'path';

export interface Category {
    name: string;
    children?: Category[];
}

const categories: Category[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'json/categories.json'), 'utf-8'),
) as Category[];

export default categories;
