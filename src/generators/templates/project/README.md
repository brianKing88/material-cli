# Vue-Demi + TS + Vite For SFC template

> Vue.js component template for Vue 2 and 2.7 and 3.

Features

- Development environment for library mode in Vue 2.6/2.7/3
- Testing/building environment for library mode in Vue 2/3
- dts solution for library mode in Vue 2.7/3 (partial support for Vue 2.6)
- Script to adapt package.json during release

## Template Usage

To use this template, clone it down using:

```bash
npx degit ChuHoMan/vue-demi-component-template my-component
```

And do a global replace of `vue-demi-component-template` and `VueDemiComponentTemplate` with your component library name.

## Setup

Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server

```bash
# Vue 2.6.x
pnpm run dev:2
# Vue 2.7.x
pnpm run dev:2.7
# Vue 3
pnpm run dev:3
```

## How to use dist file？

### Production

Build the library for production or publish:

```bash
# build all versions
pnpm run build
```
