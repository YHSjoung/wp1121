# 112-1 Hw2 WP Music

I have done the basic required for this app. You can set up the app by the following steps.Please notice that you have to delete all of your data in your MongoDB in order to prevent the format error!

## Run the app

### 1. setup backend `.env`

Start by copying the `.env.example` file to `.env`.

```bash
cd backend
cp .env.example .env
```

Then, fill in the `MONGO_URI` field in `.env` with your MongoDB connection string and fill in the `PORT` field with the port you want to use. After that, you're `.env` file should look like this. If you don't want to use MongoDB Atlas, you can also run a local MongoDB server with Docker. You can find the instructions [here](https://hub.docker.com/_/mongo).

```bash
PORT=8000
MONGO_URI="mongodb+srv://<username>:<password>@<cluster>.example.mongodb.net/?retryWrites=true&w=majority"
```

### 2. setup frontend `.env`

Start by copying the `.env.example` file to `.env`.

```bash
cd frontend
cp .env.example .env
```

Then, fill in the `VITE_API_URL` field in `.env` with the url of your backend server. After that, you're `.env` file should look like this. Note that the port should be the same as the one you set in the backend `.env` file.

```bash
VITE_API_URL="http://localhost:<PORT>/api"
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

Visit `http://localhost:5173` to see the app in action.
