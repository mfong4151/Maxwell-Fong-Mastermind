
# Maxwell Fong Mastermind

This project is my submission for the Mastermind take home challenge for Linkedin REACH's Backend Apprenticeship candidacy. Assume that mastermind was an n-player, real-time game, what would that look like? This project takes that question as a point of departure, and uses it to animate the main features.

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

## Features/ Notable Optimziations

- Optional user authentication
- Adjustable difficulty
- Multiplayer game
- websockets
- scoreboard

### Optional User Authentication

Users can authenticate optionally. A non-signed in user can play the game without logging in, and will have access to hints. Because the game had goals for a leaderboard, signed in users do not have access to hints.

JWTs are used for authentication, and are checked by Express middleware.

### Suggested Feature Implementation

The following optional features suggested in the extension ideas are as follows:

1. Hints
2. Configurable difficulty (code length and attempts, and also a time limit).
3. Score keeping.
4. Multiplayer.

### Real-Time Gameplay

Users belonging to the same game can play in real-time together through websocket implementation. The Express backend upgrades to websocket protocol for real-time gameplay.

### LRU-Cache Implementation - Fast Gameplay

For the POST request for creating a new game guess, an LRU cache is implemented to do the following:

1. Cache the most recently called game.
2. Cache the game's players.

The reason for this is the original algorithms for checking permissions on a game guess were computationally expensive. Originally, POSTing a new game would cause a 2-second delay. Originally, the process for validating a new game guess would include:

1. Querying the database for the games players (given by the gameplayer table) to get the player ids.
2. Querying the database for the game's secret code, end date, number of guesses.
3. Querying the database for the guesses, and the aggregate of guesses.
4. Doing an O(n) linear scan through the players to see if they're permitted to play in this game by unpacking several nested objects.
5. Checking if the game has already been won, or if we've exceeded the limit of games.

The improved algorithm works as follows:

1. Check the LRU cache(s) for game state settings and players. If either does not exist, then query the database. Skip steps 2 and 3 if so.

2. Cache the game settings, which include the game's secret code, end date, number of guesses. 

3. Cache the playerIds as a gameId-set<number> pair, where the items set are the playerIds

4. Do a much smaller query to get guesses associated with the game.

5. Do a O(1) key into the playerId set to check if the players are allowed.

6. Run several checks to see if the game has already been won, or we've exceeded the game.

This second method, while slightly slower on the first query, is much faster 

(For any confusion as to why there are so many queries, see below on the section about Prisma.)
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