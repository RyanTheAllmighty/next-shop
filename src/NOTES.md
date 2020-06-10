## Server Side API

### index.tsx
```js
declare global {
    namespace NodeJS {
        interface Global {
            prisma: PrismaClient;
        }
    }
}

interface CategoryPageProps {
    category: { createdAt: string; updatedAt: string } & Omit<
        CategoryGetPayload<{ include: { parent: true; children: true; products: true } }>,
        'createdAt' | 'updatedAt'
    >;
}

const CategoryPage: NextPage<CategoryPageProps> = ({ category }) => {

export async function getServerSideProps({ params }: { params: { category: string } }) {
    const prisma: PrismaClient = global.prisma || (global.prisma = new PrismaClient());
    const category = await prisma.category.findOne({
        where: { slug: params.category },
        include: { children: true, products: true, parent: true },
    });

    const parent = category.parent
        ? {
              parent: {
                  ...category.parent,
                  createdAt: category.parent.createdAt.toISOString(),
                  updatedAt: category.parent.updatedAt.toISOString(),
              },
          }
        : {};

    return {
        props: {
            category: {
                ...category,
                ...parent,
                children: category.children.map((childCategory) => ({
                    ...childCategory,
                    createdAt: childCategory.createdAt.toISOString(),
                    updatedAt: childCategory.updatedAt.toISOString(),
                })),
                products: category.products.map((product) => ({
                    ...product,
                    createdAt: product.createdAt.toISOString(),
                    updatedAt: product.updatedAt.toISOString(),
                })),
                createdAt: category.createdAt.toISOString(),
                updatedAt: category.updatedAt.toISOString(),
            },
        },
    };
}
```

### [product].tsx
```js
declare global {
    namespace NodeJS {
        interface Global {
            prisma: PrismaClient;
        }
    }
}

interface ProductPageProps {
    category: { createdAt: string; updatedAt: string } & Omit<
        CategoryGetPayload<{ include: { parent: true } }>,
        'createdAt' | 'updatedAt'
    >;
    product: { createdAt: string; updatedAt: string } & Omit<
        ProductGetPayload<{ include: { brand: true; images: true; specifications: true } }>,
        'createdAt' | 'updatedAt'
    >;
}

const ProductPage: NextPage<ProductPageProps> = () => {

export async function getServerSideProps({
    params: { category: categorySlug, product: productSlug },
}: {
    params: { category: string; product: string };
}) {
    const prisma: PrismaClient = global.prisma || (global.prisma = new PrismaClient());
    const category = await prisma.category.findOne({ where: { slug: categorySlug }, include: { parent: true } });
    const product = await prisma.product.findOne({
        where: { slug: productSlug },
        include: { brand: true, images: true, specifications: true },
    });

    const parent = category.parent
        ? {
              parent: {
                  ...category.parent,
                  createdAt: category.parent.createdAt.toISOString(),
                  updatedAt: category.parent.updatedAt.toISOString(),
              },
          }
        : {};

    return {
        props: {
            category: {
                ...category,
                ...parent,
                createdAt: category.createdAt.toISOString(),
                updatedAt: category.updatedAt.toISOString(),
            },
            product: {
                ...product,
                brand: {
                    ...product.brand,
                    createdAt: product.brand.createdAt.toISOString(),
                    updatedAt: product.brand.updatedAt.toISOString(),
                },
                images: product.images.map((image) => ({
                    ...image,
                    createdAt: image.createdAt.toISOString(),
                    updatedAt: image.updatedAt.toISOString(),
                })),
                specifications: product.specifications.map((specification) => ({
                    ...specification,
                    createdAt: specification.createdAt.toISOString(),
                    updatedAt: specification.updatedAt.toISOString(),
                })),
                createdAt: product.createdAt.toISOString(),
                updatedAt: product.updatedAt.toISOString(),
            },
        },
    };
}
```

## Build Time API

### index.tsx

```js
export async function getStaticProps({ params }: { params: { category: string } }) {
    const prisma: PrismaClient = global.prisma || (global.prisma = new PrismaClient());
    const category = await prisma.category.findOne({
        where: { slug: params.category },
        include: { children: true, products: true, parent: true },
    });

    const parent = category.parent
        ? {
              parent: {
                  ...category.parent,
                  createdAt: category.parent.createdAt.toISOString(),
                  updatedAt: category.parent.updatedAt.toISOString(),
              },
          }
        : {};

    return {
        props: {
            category: {
                ...category,
                ...parent,
                children: category.children.map((childCategory) => ({
                    ...childCategory,
                    createdAt: childCategory.createdAt.toISOString(),
                    updatedAt: childCategory.updatedAt.toISOString(),
                })),
                products: category.products.map((product) => ({
                    ...product,
                    createdAt: product.createdAt.toISOString(),
                    updatedAt: product.updatedAt.toISOString(),
                })),
                createdAt: category.createdAt.toISOString(),
                updatedAt: category.updatedAt.toISOString(),
            },
        },
    };
}

export async function getStaticPaths() {
    const prisma: PrismaClient = global.prisma || (global.prisma = new PrismaClient());
    const categories = await prisma.category.findMany();

    return {
        paths: categories.map((category) => {
            return {
                params: {
                    category: category.slug,
                },
            };
        }),
        fallback: true,
    };
}
```

### [product].tsx
```js
export async function getStaticProps({
    params: { category: categorySlug, product: productSlug },
}: {
    params: { category: string; product: string };
}) {
    const prisma: PrismaClient = global.prisma || (global.prisma = new PrismaClient());
    const category = await prisma.category.findOne({ where: { slug: categorySlug }, include: { parent: true } });
    const product = await prisma.product.findOne({
        where: { slug: productSlug },
        include: { brand: true, images: true, specifications: true },
    });

    const parent = category.parent
        ? {
              parent: {
                  ...category.parent,
                  createdAt: category.parent.createdAt.toISOString(),
                  updatedAt: category.parent.updatedAt.toISOString(),
              },
          }
        : {};

    return {
        props: {
            category: {
                ...category,
                ...parent,
                createdAt: category.createdAt.toISOString(),
                updatedAt: category.updatedAt.toISOString(),
            },
            product: {
                ...product,
                brand: {
                    ...product.brand,
                    createdAt: product.brand.createdAt.toISOString(),
                    updatedAt: product.brand.updatedAt.toISOString(),
                },
                images: product.images.map((image) => ({
                    ...image,
                    createdAt: image.createdAt.toISOString(),
                    updatedAt: image.updatedAt.toISOString(),
                })),
                specifications: product.specifications.map((specification) => ({
                    ...specification,
                    createdAt: specification.createdAt.toISOString(),
                    updatedAt: specification.updatedAt.toISOString(),
                })),
                createdAt: product.createdAt.toISOString(),
                updatedAt: product.updatedAt.toISOString(),
            },
        },
    };
}

export async function getStaticPaths() {
    const prisma: PrismaClient = global.prisma || (global.prisma = new PrismaClient());

    const categoriesWithProducts = await prisma.category.findMany({ include: { products: true } });

    return {
        paths: categoriesWithProducts.flatMap((category) => {
            return category.products.map((product) => ({
                params: {
                    category: category.slug,
                    product: product.slug,
                },
            }));
        }),
        fallback: true,
    };
}
```
