# Nova Boilerplate NextJS

This boilerplate is a [NextJS](https://nextjs.org/) app which gives the user the skeleton to start a new Nova frontend application.

⚡ Next.js with App Router support

🔥 Type checking TypeScript

📏 Linter with ESLint

💖 Code Formatter with Prettier

## Development setup

You will need nodejs installed. The recommended way to install node is with [nvm](https://github.com/nvm-sh/nvm) by running `nvm install` in the repository root; this will get the specific version of node from `.nvmrc` that the project expects.

## Installing dependencies

To install the dependencies, run:

```bash
npm install
```

## Connecting to an existing instance

You can tell the boilerplate project to connect to the instance by providing the `WANDELAPI_BASE_URL` and `CELL_ID` environment variables. For example, if your instance is at `my.instance.wandelbots.io` and your cell is called `cell`.
Remember to replace the IP address with the one of your [Cloud-Instance](https://portal.wandelbots.io/de/instances).

```bash
echo "WANDELAPI_BASE_URL=http://my.instance.wandelbots.io\nCELL_ID=cell\nNOVA_USERNAME=wb\nNOVA_PASSWORD=password" > .env.local
```

```bash
WANDELAPI_BASE_URL=http://my.instance.wandelbots.io
CELL_ID=cell
```

## Running the dev server

Once everything is set up, you can run the NextJS dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture notes

The boilerplate is structurally pretty simple since it needs no url changes, like a basic React SPA. Some things to note:

- Selected environment variables from the runtime server context are injected into the browser by SSR of the layout, see `runtimeEnv.ts`. This allows the docker image to be configurable on startup without rebuilding Next
- We use a lot of [MobX](https://mobx.js.org/the-gist-of-mobx.html) observables and computed properties for state management
