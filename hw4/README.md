# Install guide
## Instsall packages
```bash
cd ./web
yarn
cd ../server
yarn
cd ../package
yarn
```
## Environment variables
### Web
Create `./web/.env.local` file and add the following lines:
```text
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```
### Server
Create `./server/.env` file and add the following lines:
```text
PORT=4000
```
# Run guide

1. Start the server
    ```bash
    cd ./server
    yarn dev
    ```
2. Start the web
    ```bash
    cd ./web
    yarn dev
    ```
3. Go to `http://localhost:3000` in your browser

# Setup guide
1. Create folers
    Create two folders: `web`, `package` and `server` in the root directory of the project.
    * `web` folder will contain a NextJS project.
    * `server` folder will contain an ExpressJS project and serve as the backend.
    * `package` folder will contain serveral shared files between the `web` and `server` projects, such as types definitions, constants, etc.
2. Initialize git
    ```bash
    git init
    ```


## Web folder setup
Go to the `web` folder, run `yarn create next-app .` to create a NextJS project. Select the default options for the questions.
```bash
cd ./web
yarn create next-app .
```
### TypeScript setup
1. Add a path to the `tsconfig.json` file
    ```json
    {
        "compilerOptions": {
            "paths": {
                "@package/*": ["../package/*"],
            },
        }
    }
    ```
### Prettier and ESLint setup
In the `web` folder, follow the below instructions to setup Prettier and ESLint.
1. Install prettier and prettier plugins
    ```bash
    yarn add -D prettier prettier-plugin-tailwindcss @trivago/prettier-plugin-sort-imports
    ```
2. Install eslint and eslint plugins
    ```bash
    yarn add -D eslint typescript @typescript-eslint/parser eslint-config-prettier @typescript-eslint/eslint-plugin
    ```
3. Copy and paste the `./web/.eslintrc.json` file and `./web.prettierrc.cjs` file from this repo to your project root

### Shadcn UI setup
1. Setup Shadcn UI
    ```bash
    # In the ./web folder
    npx shadcn-ui@latest init
    ```
2. Answer the questions carefully since **some of the default options are not compatible with our setup**.

    * Would you like to use TypeScript (recommended)? `yes`
    * Which style would you like to use? › `New York`
        * I personally prefer New York style, but you can choose any style you like.
    * Which color would you like to use as base color? › `Slate`
        * You can choose any color you like.
    * Where is your global CSS file? › › `src/app/globals.css`
        * **IMPORTANT**: You must enter `src/app/globals.css` here. Otherwise, the setup will fail.
    * Do you want to use CSS variables for colors? › `yes`
    * Where is your tailwind.config.js located? › `tailwind.config.ts`
        * **IMPORTANT**: We are using TypeScript, so you must enter `tailwind.config.ts` here.
    * Configure the import alias for components: › `@/components`
    * Configure the import alias for utils: › `@/lib/utils/shadcn`
    * Are you using React Server Components? › `yes`
### Environment variables setup
1. Copy and paste the `./web/.env.example` file into the `./web/.env.local`
2. Fill in the environment variables in the `./web/.env.local` file

### Next redirect setup
In this tutorial, we will show how to do user authentication with NextJS and ExpressJS. Therefore, we need to redirect api routes to the ExpressJS server.

In `./web/next.config.js`, add the following lines:
```js
const nextConfig = {
    ...
    async redirects() {
        return [
        {
            source: "/api/:path*",
            destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
            permanent: true,
        },
        ];
    },
    ...
};
```

Also, remember to add `NEXT_PUBLIC_API_URL` to the `./web/.env.local` file. For example, if `server` runs at port 4000, then you have to set: 
```text
# ./web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
``` 
```text
# ./server/.env
PORT=4000
``` 

### Git setup
`yarn create next-app` will automatically initialize a git repository. However, we have already initialized a git repository in the root directory of the project. Therefore, we need to remove the git repository in the `web` folder.
```bash
cd ./web
rm -rf .git
```

## Server folder setup
In the `server` folder, run `yarn init -y` to create a NodeJS project.
```bash
cd ./server
yarn init -y
```
### TypeScript setup
1. Install TypeScript and ts-node
    ```bash
    yarn add -D ts-node typescript @types/node
    ```
2. Create `tsconfig.json` file
    ```bash
    yarn tsc --init
    ```
3. Add a path to the `tsconfig.json` file
    ```json
    {
        "compilerOptions": {
            "paths": {
                "@package/*": ["../package/*"],
            },
        }
    }
    ```
### Prettier and ESLint setup
In the `server` folder, follow the below instructions to setup Prettier and ESLint.
1. Install prettier and prettier plugins
    ```bash
    yarn add -D prettier prettier-plugin-tailwindcss @trivago/prettier-plugin-sort-imports
    ```
2. Install eslint and eslint plugins
    ```bash
    yarn add -D eslint typescript @typescript-eslint/parser eslint-config-prettier @typescript-eslint/eslint-plugin
    ```
3. Copy and paste the `./server/prettierrc.cjs` file from this repo to your project root.

4. Setup ESLint
    In the `server` folder, run the following command to setup ESLint.
    ```bash
    npx eslint --init
    ```


    * How would you like to use ESLint? · `To check syntax and find problems`
    * What type of modules does your project use? · `JavaScript modules (import/export)`
    * Which framework does your project use? · `None of these`
    * Does your project use TypeScript? · `Yes`
    * Where does your code run? · `Node`
        * **IMPORTANT**: Press `space` to select, `a` to toggle all, `i` to invert selection. If you only press `Enter`, the setup will become `browser` instead of `node`.
    * What format do you want your config file to be in? · `JSON`
    * Would you like to install them now? · `Yes`
    * Which package manager do you want to use? · `yarn`
5. Add `lint` and `format` scripts to `package.json`
    ```json
    {
        "scripts": {
            "lint": "eslint .",
            "format": "prettier --write ."
        },
    }
    ```

### ExpressJS setup
1. Install ExpressJS
    ```bash
    yarn add express cors body-parser nodemon dotenv
    yarn add -D @types/express @types/cors @types/body-parser
    ```
2. Add `start` and `dev` scripts to `package.json`
    ```json
    {
        "scripts": {
            "start":"ts-node src/index.ts",
            "dev": "nodemon src/index.ts",
            ...
        },
    }
    ```
3. Create `src/index.ts` file
    ```ts
    import express from 'express';

    const app = express();
    const port = process.env.PORT || 3000;

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
    ```

### Environment variables setup
1. Create `./server/.env` file. Copy and paste all the content in `./server/.env.example` file into the `./server/.env` file.
2. Fill in the environment variables in the `./server/.env` file
3. Create `./server/.gitignore` file and add the following lines
    ```text
    node_modules
    .env
    ```

If you completed all the steps above, you should be able to run `yarn dev` in the `./server` folder and you will see "Hello World!" at `http://localhost:<YOUR PORT NUMBER>` in your browser.

## Package folder setup
### Init yarn
In the `package` folder, run `yarn init -y` to create a NodeJS project.
```bash
cd ./package
yarn init -y
```
### Prettier and ESLint setup
In the `package` folder, follow the below instructions to setup Prettier and ESLint.
1. Install prettier and prettier plugins
    ```bash
    yarn add -D prettier prettier-plugin-tailwindcss @trivago/prettier-plugin-sort-imports
    ```
2. Install eslint and eslint plugins
    ```bash
    yarn add -D eslint typescript @typescript-eslint/parser eslint-config-prettier @typescript-eslint/eslint-plugin
    ```
3. Copy and paste the `./package/.eslintrc.json` file and `./package.prettierrc.cjs` file from this repo to your project root
