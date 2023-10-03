# 112-1-Hw2-WP Music

I have done the basic required for this app. You can set up the app by the following steps.Please notice that you have to delete all of your data in your MongoDB in order to prevent the format error!

## Run the app

Follow the instructions in this section to run the app locally.

### 1. setup backend `.env`

Start by copying the `.env.example` file to `.env`.

```bash
cd backend
cp .env.example .env
```

Then, fill in the `MONGO_URL` field in `.env` with your MongoDB connection string and fill in the `PORT` field with the port you want to use. After that, you're `.env` file should look like this. If you don't want to use MongoDB Atlas, you can also run a local MongoDB server with Docker. You can find the instructions [here](https://hub.docker.com/_/mongo).

```bash
PORT=8000
MONGO_URL="mongodb+srv://<username>:<password>@<cluster>.example.mongodb.net/?retryWrites=true&w=majority"
```

### 2. setup frontend `.env`

Start by copying the `.env.example` file to `.env`.

```bash
cd frontend
cp .env.example .env
```

Then, fill in the `VITE_API_URL` field in `.env` with the url of your backend server. After that, you're `.env` file should look like this. Note that the port should be the same as the one you set in the backend `.env` file.

```bash
VITE_API_URL="http://localhost:8000/api"
```

### 3. start the backend server

```bash
cd backend
yarn dev
```

### 4. start the frontend server

```bash
cd frontend
yarn dev
```

Visit `http://localhost:5173` to see the app in action. That's it, you're done! If you want to set up the whole project from scratch, you can follow the instructions below.

## eslint and prettier

The setup process is very similar to the one in the [previous project](https://github.com/ntuee-web-programming/112-1-unit1-todo-list). However, please keep in mind that we use different configuration files this time, frontend configuration is also different from that of backend, this may effect your homework grade. The required plugins can be found in `package.json`, if you can't run the linter or formatter, make sure you have all of the plugins installed correctly.

The `lint` script is required in homeworks, please add these lines in your `package.json`.

```json
{
...
  "scripts": {
    "lint": "eslint src",
    "format": "prettier --write src"
  }
...
}
```

## Frontend Setup

### 1. Create a vite project

`yarn create vite` will create a new directory, which is the `frontend` directory, for you with everything set up. You'll need to answer a few questions to set up the project. If you don't understand some of them, don't worry, just follow the suggestions listed below. You'll (hopefully) understand all these questions as the course progresses.

```bash
$ cd frontend
$ yarn create vite
yarn create v1.22.19
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
[4/4] 🔨  Building fresh packages...
success Installed "create-vite@4.4.1" with binaries:
      - create-vite
      - cva
? Project name: › vite-project # type `frontend` here
? Select a framework: › - Use arrow-keys. Return to submit.
    Vanilla
    Vue
❯   React # choose React
    Preact
    Lit
    Svelte
    Solid
    Qwik
    Others
? Select a variant: › - Use arrow-keys. Return to submit.
❯   TypeScript # choose TypeScript
    TypeScript + SWC
    JavaScript
    JavaScript + SWC
```

That's it, you're done. You can now start the dev server by running `yarn dev`.

