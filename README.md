# next-shop

Shop powered by NextJS, Prisma and Nexus

<!-- toc -->

- [Development](#development)
- [Deployment](#deployment)

<!-- tocstop -->

## Development

TBA

## Deployment

Every commit to this repository is automatically built and deployed to [Vercel](https://vercel.com). It is made
available automatically at <https://next-shop-amber.now.sh>.

## Known Issues

### Prisma missing type customisation

Unfortunately due to the beta nature of Prisma, a manual SQL file (`prisma/fix.sql`) needs to be run after all
migrations because all String fields are varchar(191) and there's no way to customise that. There is a
[GitHub issue](https://github.com/prisma/prisma/issues/446) tracking that.

### nexus package on Windows

Due to a number of issue on Windows with the `nexus` package, Windows support is completely broken. You must use WSL on
Windows systems, or ideally use the devcontainer provided in this repository.

- https://github.com/graphql-nexus/nexus/issues/965
- https://github.com/graphql-nexus/nexus/issues/922
- https://github.com/graphql-nexus/nexus/issues/838
