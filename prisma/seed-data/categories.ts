export interface Category {
    name: string;
    children?: Category[];
}

const categories: Category[] = [
    {
        name: 'Storage Devices',
        children: [
            {
                name: 'Internal Drives',
                children: [
                    {
                        name: 'NVMe Drives',
                    },
                ],
            },
        ],
    },
];

export default categories;
