import { schema, use } from 'nexus';
import { prisma } from 'nexus-plugin-prisma';

use(prisma());

schema.objectType({
    name: 'Brand',
    definition(t) {
        t.model.id();
        t.model.name();
        t.model.slug();
        t.model.description();

        t.model.createdAt();
        t.model.updatedAt();
    },
});

schema.objectType({
    name: 'Category',
    definition(t) {
        t.model.id();
        t.model.name();
        t.model.slug();
        t.model.description();

        t.model.children();
        t.model.parent();

        t.model.products();

        t.model.createdAt();
        t.model.updatedAt();
    },
});

schema.objectType({
    name: 'ProductImage',
    definition(t) {
        t.model.id();
        t.model.url();
        t.model.description();

        t.model.product();

        t.model.createdAt();
        t.model.updatedAt();
    },
});

schema.objectType({
    name: 'ProductSpecification',
    definition(t) {
        t.model.id();
        t.model.name();
        t.model.value();

        t.model.product();

        t.model.createdAt();
        t.model.updatedAt();
    },
});

schema.objectType({
    name: 'Product',
    definition(t) {
        t.model.id();
        t.model.name();
        t.model.slug();
        t.model.description();
        t.model.price();
        t.model.sku();

        t.model.brand();
        t.model.category();
        t.model.images();
        t.model.specifications();

        t.model.createdAt();
        t.model.updatedAt();
    },
});

schema.queryType({
    definition(t) {
        t.crud.products({
            filtering: true,
        });
        t.crud.brands();
        t.crud.categories({
            filtering: true,
        });
        t.crud.productImages();
        t.crud.productSpecifications();
    },
});

schema.mutationType({
    definition(t) {
        t.crud.createOneCategory();
        t.crud.updateOneCategory();
        t.crud.upsertOneCategory();
        t.crud.deleteOneCategory();
        t.crud.updateManyCategory();
        t.crud.deleteManyCategory();

        t.crud.createOneBrand();
        t.crud.updateOneBrand();
        t.crud.upsertOneBrand();
        t.crud.deleteOneBrand();
        t.crud.updateManyBrand();
        t.crud.deleteManyBrand();

        t.crud.createOneProductImage();
        t.crud.updateOneProductImage();
        t.crud.upsertOneProductImage();
        t.crud.deleteOneProductImage();
        t.crud.updateManyProductImage();
        t.crud.deleteManyProductImage();

        t.crud.createOneProductSpecification();
        t.crud.updateOneProductSpecification();
        t.crud.upsertOneProductSpecification();
        t.crud.deleteOneProductSpecification();
        t.crud.updateManyProductSpecification();
        t.crud.deleteManyProductSpecification();

        t.crud.createOneProduct();
        t.crud.updateOneProduct();
        t.crud.upsertOneProduct();
        t.crud.deleteOneProduct();
        t.crud.updateManyProduct();
        t.crud.deleteManyProduct();
    },
});
