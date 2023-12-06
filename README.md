
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

## Database Schema:

```bash
User
+----------------+-----------------+
| Field          | Type            |
+----------------+-----------------+
| id             | Int             |
| username       | String          |
| hashedPassword | String          |
| games          | GamePlayer[]    |
| guesses        | GameGuess[]     |
| createdAt      | DateTime        |
| updatedAt      | DateTime        |
+----------------+-----------------+

Game
+------------+-------------+
| Field      | Type        |
+------------+-------------+
| id         | Int         |
| numGuesses | Int         |
| secretCode | String[]    |
| createdAt  | DateTime    |
| updatedAt  | DateTime    |
| endsAt     | DateTime    |
| players    | GamePlayer[]|
| guesses    | GameGuess[] |
+------------+-------------+

GamePlayer
+------------+---------+
| Field      | Type    |
+------------+---------+
| id         | Int     |
| playerId   | Int     |
| gameId     | Int     |
| createdAt  | DateTime|
| updatedAt  | DateTime|
| game       | Game    |
| player     | User    |
+------------+---------+

GameGuess
+--------------+------------+
| Field        | Type       |
+--------------+------------+
| id           | Int        |
| playerId     | Int?       |
| gameId       | Int        |
| numCorrectLoc| Int        |
| numCorrectNum| Int        |
| guesses      | String[]   |
| isGameWon    | Boolean    |
| createdAt    | DateTime   |
| updatedAt    | DateTime   |
| game         | Game       |
| player       | User?      |
+--------------+------------+


```

## Backend Routes:

API Documentation for Mastermind Game Project
Base URL

/api

### V1 Endpoints

User Endpoints
    GET /users/games: Retrieve current games for a user.
    GET /users/: Get user details.
    GET /users/profiles: Get user profile information.

Game Endpoints
    GET /games/{gameId}/guesses: Retrieve guesses for a specific game.
    GET /games/{id}: Get details of a specific game.
    POST /games/: Create a new game.
    POST /games/{gameId}/guesses: Submit a guess in a game.
    POST /games/{gameId}/players: Add players to a game.

Authentication Endpoints
    POST /auth/signup: Register a new user.
    POST /auth/login: Login for existing users.

NEEDS DOCUMENTATION ON PARAMETERS


## Problems: 

### Optimizing requests

At one point, I attempted to optimizing game loading by combining the requests. In other words, when a game is sent to the frontend, so are the guesses.

## To do:
- Frontend