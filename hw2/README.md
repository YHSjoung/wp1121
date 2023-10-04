# 112-1 Hw2 WP Music

I have implemented three of the "perfect" requirements for this app.

First, a warning will pop up if you fail to update the list or card. If you forget to enter the "Name" of a list or leave it blank, a message will appear saying, "Please enter the list name." The same goes for the card.

Second, the app checks whether a list or card with the same name already exists when you add a new one. If you use a duplicate name, a warning will pop up.

Third, you can also change the cover image of each music list. This was the most challenging part of the homework for me, and I suggest you try it at least once!

To set up the app, please follow the steps below. Note that you must delete all of your data in your MongoDB to prevent any format errors! Have a great day!

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

### 2. setup backend picture folder

Start by copying the `storePic.example` folder to `storePic`

```bash
cd backend
cp -r storePic.example storePic
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
