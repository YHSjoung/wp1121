WebProgramming_HW4

I have successfully implemented two key requirements. One allows you to click on URLs to open them in a new window, and the other ensures that chat room messages automatically scroll down to the bottom.

Additionally, please note that I am using PostgreSQL as my database, so please follow the provided instructions carefully to ensure the proper functioning of the app.

1. Install guide
open the terminal and type the following order:

cd ./web
yarn
cd ../server
yarn
cd ../package
yarn

2. Environment variables

(1) Web
Follow the step to build your `.env.local`:

cd ./web
cp .env.example .env.local

If you are using docker to run your database, enter the following lines in your terminal:

cd ./web
docker compose up -d

If not, please change the NEXT_PUBLIC_POSTGRES_URL in `./web/.env.local` to your own postgreSQL url.
The following is the original url in .env.local.
(
    NEXT_PUBLIC_POSTGRES_URL="postgres://postgres:postgres@localhost:5432/Messenger"
)


(2) Server
Follow the step to build your `.env.local`:

cd ./server
cp .env.example .env

3. Run guide

(1) Start the server

    cd ./server
    yarn dev

(2) Start the web

    cd ./web
    yarn dev

(3) Go to `http://localhost:3000` in your browser

Notice:
1. Please notice that your password must be more than 8 character.
2. You have to register more than one user or you can't chat with other.