import { PrismaClient } from '@prisma/client';

main();

async function main() {
    const client = new PrismaClient();

    const queryPromises = [
        'SET FOREIGN_KEY_CHECKS = 0',
        'TRUNCATE TABLE `OrderItem`',
        'TRUNCATE TABLE `Product`',
        'TRUNCATE TABLE `ProductImage`',
        'TRUNCATE TABLE `ProductSpecification`',
        'TRUNCATE TABLE `Address`',
        'TRUNCATE TABLE `Brand`',
        'TRUNCATE TABLE `Category`',
        'TRUNCATE TABLE `Customer`',
        'TRUNCATE TABLE `Order`',
        'SET FOREIGN_KEY_CHECKS = 1',
    ];

    for (const query of queryPromises) {
        await client.raw(query);
    }

    console.log('Database cleared');

    client.disconnect();

    process.exit(0);
}
