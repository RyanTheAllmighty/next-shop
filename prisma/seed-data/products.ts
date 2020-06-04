import fs from 'fs';
import path from 'path';
import { ProductImage, ProductSpecification } from '@prisma/client';

export interface Product {
    brand: string;
    sku: string;
    name: string;
    description: string;
    price: number;
    images: Pick<ProductImage, 'url'>[];
    specifications: Pick<ProductSpecification, 'name' | 'value'>[];
    category: string;
}

const products: Product[] = fs
    .readdirSync(path.join(__dirname, 'json'))
    .filter((filename) => filename.startsWith('products-'))
    .map((filename) => JSON.parse(fs.readFileSync(path.join(__dirname, `json/${filename}`), 'utf-8')))
    .reduce((acc: Product[], array: Product[]) => (acc = acc.concat(array)), [])
    .filter((product: Product) => !!product.category);

export default products;
