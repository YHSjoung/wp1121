WebProgramming_HW4

I only do the basic require. Please notice that there are some small bug that I don't have time to fix it.
The most important one is that you have to enter a message in your new chat room, or you can't find it after refresh you web page.
Hope it will not affact you to give me a pass 🥹!


1. Install guide

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