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

const products: Product[] = [
    {
        brand: 'Crucial',
        sku: 'CT500P1SSD8',
        name: 'Crucial P1 500GB 3D NAND NVMe PCIe M.2 SSD',
        description:
            'Crucial P1 500GB 3D NAND NVMe PCIe M.2 SSD, 500GB with sequential reads/writes up to 2,000/1,750 MB/s, 5-Year limited warranty',
        price: 115.0,
        images: [
            { url: 'https://cdn1.centrecom.com.au/images/upload/0071473_0.jpeg' },
            { url: 'https://cdn2.centrecom.com.au/images/upload/0071474_0.jpeg' },
            { url: 'https://cdn3.centrecom.com.au/images/upload/0071475_0.jpeg' },
        ],
        specifications: [
            {
                name: 'Capacity',
                value: '500GB',
            },
            {
                name: 'Interface',
                value: 'NVMe',
            },
            {
                name: 'Form Factor',
                value: 'M.2 2280',
            },
        ],
        category: 'NVMe Drives',
    },
];

export default products;
