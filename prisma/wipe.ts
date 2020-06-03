import { PrismaClient } from '@prisma/client';
import { promises } from 'fs';

main();

async function main() {
    const client = new PrismaClient();

    const queryPromises = [
        'SET FOREIGN_KEY_CHECKS = 0',
        'DROP TABLE IF EXISTS `OrderItem`',
        'DROP TABLE IF EXISTS `Product`',
        'DROP TABLE IF EXISTS `ProductImage`',
        'DROP TABLE IF EXISTS `ProductSpecification`',
        'DROP TABLE IF EXISTS `_Migration`',
        'DROP TABLE IF EXISTS `Address`',
        'DROP TABLE IF EXISTS `Brand`',
        'DROP TABLE IF EXISTS `Category`',
        'DROP TABLE IF EXISTS `Customer`',
        'DROP TABLE IF EXISTS `Order`',
        'SET FOREIGN_KEY_CHECKS = 1',
    ];

    for (const query of queryPromises) {
        await client.raw(query);
    }

    console.log('Database wiped');

    client.disconnect();

    process.exit(0);
}
