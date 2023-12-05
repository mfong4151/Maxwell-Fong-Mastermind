
# Maxwell Fong Mastermind

## Setup and running

### Backend
To set up locally, from the project root, in the terminal execute the following to install dependencies:

```bash
cd backend
npm install
```
Afterwards, create a .env file in /backend, inside paste the following

```bash
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/mastermind?schema=public"
```
Of course substituting <username> and <password> for your username and password respectively. If another database currently has the name "mastermind", then feel free to change the name as well.

Next execute the following command in /backend:

```bash
npx prisma generate
```
This will create the Prisma Client, which will generate in node_modules.

### Frontend

For viewing on the frontend:

```bash
cd frontend
npm install
```

### Running

From the root directory, open up two terminal instances.

In the first instance, cd into /backend folder, and run:
```bash
npm run build
```

Then
```bash
npm run start
```

Respectively, cd into the /frontend folder, and run:
```bash
npm start
```

## Requirements

Per the challenge description:

"Use Random generator API (https://www.random.org/clients/http/api/) to randomly select 4 numbers from 0 ~ 7 (Duplicate numbers are allowed)"

Code for the above requirement is produced in /backend/src/controllers/game/utils.ts. A call to www.random.org is made with the respective arguments as query params.

## Features

- Optional user authentication
- Adjustable difficulty
- Multiplayer game
- websockets
- scoreboard

## Backend Routes:

POST api/v1/games
POST api/v1/games/:gameId/guesses
GET api/v1/games

POST api/v1/auth/login
POST api/v1/auth/signup

## Problems: 

### Optimizing requests

At one point, I attempted to optimizing game loading by combining the requests. In other words, when a game is sent to the frontend, so are the guesses.

## To do:
- Frontend