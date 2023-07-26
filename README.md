# Roingus for Lemmy

A [Lemmy](https://join-lemmy.org/) client written with Remix.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/en/) >= 14.0.0
- [pnpm](https://pnpm.io/) >= 6.0.0

### Setup

```sh
pnpm install
```

You will need to create a `.env` file with the following contents:

```sh
# The URL of the default Lemmy instance to use
# (e.g. https://lemmy.ml)
BASE_URL=
```

### Run

```sh
pnpm dev
```

### Build

```sh
pnpm build
```

## Deployment

### Prerequisites

- [Node.js](https://nodejs.org/en/) >= 14.0.0
- [pnpm](https://pnpm.io/) >= 6.0.0

### Setup

```sh
pnpm install
```

### Build

```sh
pnpm build
```

### Run

```sh
pnpm start
```

You will need to provide the following environment variables:

```sh
# The URL of the default Lemmy instance to use
# (e.g. https://lemmy.ml)
BASE_URL=
```

## License

[OSL-3.0](LICENSE.md)
