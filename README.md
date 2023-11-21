Groupoomania P7

TO RUN: "NPM RUN DEV" for front and backend



This is the backend for the Mythomania project
To start scripts: npm run dev 
Technologies used:
Node.js, Express, JWT, Multer
MySQL hosted on PlanetScale
Prisma for ORM
How to use
git clone this repo
npm install
Rename the .env.development file into .env
Populate it with your personal environment variables
This repo was tested with an online PlanetScale MySQL database
How to use Prisma to interact with the DB
The db schema is inside the schema.prisma

If you want to change it, you have to run npx prisma db push