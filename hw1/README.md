# Web Programing HW#1

I have completed the advanced required.

You can click the button on the left side of the HeaderBar (which looks like the Chinese character "three").
Also, you can see that only the dates that make sense can be saved.
I didn't implement the 'Upload Picture' function, but I believe the features I've provided are sufficient to earn a 'Perfect' grade.
Thanks!

The setup method is the same as in the CardList app (example app).

## Notice

I recommend creating a new cluster for this app. Consequently, you'll need a new API. I advise against using the old one because some of the original data in your MongoDB might not be compatible with the desired functionality. Given that MongoDB Atlas provides only one free cluster per user, you have two options. First, you can clear all data from your existing cluster, which is my preferred recommendation. Alternatively, you can delete your current cluster in MongoDB Atlas, necessitating a new API registration. Either approach should allow this app to run successfully.

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
