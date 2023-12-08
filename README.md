
# Maxwell Fong Mastermind

This project is my submission for the Mastermind take home challenge for LinkedIn REACH's Backend Apprenticeship candidacy. Assume that mastermind was an n-player, real-time game, what would that look like? This project takes that question as a point of departure and uses it to animate the main features.

My mastermind submission includes both a frontend and backend for demonstration. The frontend was made particularly to scale backend features, and for presentation purposes in general. As this is a Backend Apprenticeship, the focus here is on the Express backend and how I crafted the main features. Bellow I’ve detailed some of the main features, and challenges I encountered during the development process.


## Table of Contents
1. [Setup and Running](#setup-and-running)
   - [Backend](#backend)
   - [Frontend](#frontend)
   - [Running the Application](#running-the-application)
2. [Challenges/Requirements](#challengesrequirements)
3. [Features/Notable Optimizations](#featuresnotable-optimizations)
   - [Suggested Feature Implementation](#suggested-feature-implementation)
   - [Optional User Authentication](#optional-user-authentication)
   - [Real-Time Gameplay](#real-time-gameplay)
   - [LRU-Cache Implementation - Fast Gameplay](#lru-cache-implementation---fast-gameplay)
4. [Database Schema](#database-schema)
5. [Backend Routes](#backend-routes)
   - [V1 Endpoints](#v1-endpoints)
6. [Project Structure](#project-structure)
   - [Backend](#backend-1)
   - [Frontend Notes](#frontend-notes)
   - [Optimizing Requests](#optimizing-requests)
7. [Code Highlights](#code-highlights)
   - [Scoring Algorithm](#scoring-algorithm)
   - [Get Games Query](#get-games-query)

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
npx prisma db push 
```
This will initialize the database, and initialize the Prisma Client, which will generate in node_modules. Prisma client is needed

If the database fails to initialize, then 

### Frontend

For viewing on the frontend:

```bash
cd frontend
npm install
```

### Running

From the root directory, open up two terminal instances.

To run locally, in the first instance, cd into /backend folder, and run:

```bash
npm run dev
```

Respectively, cd into the /frontend folder, and run:
```bash
npm start
```

## Stack Explanation - Why I Chose my Stack

### Why Express?

I wanted something minimalistic, but I wanted to also have access to a rich ecosystem of libraries (e.g. Express Validator), this helped me rapidly scale the project at the onset. My choices for libraries/frameworks were between Ruby on Rails, and NextJS. Both are great frameworks, but it would have taken more steps to get the views to work as intended, especially in the case of the latter where I wanted to have a web sockets option. 

### Why Typescript?

TypeScript is my favorite way to consume JavaScript and has helped me many times by preventing "undefined" by being passed through a function unwittingly. I also find that using static types provides a useful heuristic for working through particular problems.

### Why PostgreSQL

I am most comfortable with PostgreSQL, am familiar with its syntax. My understanding is that PostgreSQL that it is more favorable for complex queries, see the one listed below for getting all of the active games. The choice of database is fairly interchangable depending on future database ACIDity concerns (see bellow).

### Why Prisma

Prisma is a flexible ORM which allows for interchangability between NoSQL and SQL databases. In addition, Prisma's ORM will generate item types based on the models in your prisma schema (see /backend/prisma/schema). Prisma has a great developer experience, but it's not without it's limitations.

The first limitation that I encountered, was because many routes needed to be alterations of a single HTTP method, the object returned will come back heavily nested. For example the games object will come back in the following shape

```typescript
 {
    id: 1,
    numGuesses: 10,
    createdAt: date,
    endsAt: date,
    players: [
        {
            id: 1,
            playerId: 2,
            player: {
                id: 2,
                username: "mfong415"
            }
        },
        {
            id: 2,
            playerId: 3,
            player: {
                id: 3,
                username: "mfong4152"
            }
        },
            //etc
        
    ]
 }
```
The issue with this is that to access the players, it becomes an additional responsibility to flatten the object, either somewhere on the backend or the frontend. This leads to lower maintainability in the code base and was distracting at times.

The second issue is that several of the types automatically generated by the Prisma Client will break when you try to include nested fields in a query. This makes understanding the code base a bit more difficult and leads to another set of types that need to be learned alongside those produced by the Prisma query. My understanding is this means that Prisma is best suited for more traditional CRUD applications where the separation of concerns is more strictly followed.

The third issue is that Prisma does not perform joins on nested queries, but instead converts the SQL query to several other WHERE-based queries before execution (https://github.com/prisma/prisma/discussions/12715). This was a drastic performance issue, which I solved by implementing an LRU Cache (library). Because of this, it's also preferable to use the $queryRaw function, but that can lead to quiet failing and extra work needed to protect against SQL injection.

## Features

### Challenges/Requirements

Per the challenge description:

"Use Random generator API (https://www.random.org/clients/http/api/) to randomly select 4 numbers from 0 ~ 7 (Duplicate numbers are allowed)"

Code for the above requirement is produced in /backend/src/controllers/game/post/_generateRandomCode.ts. A call to www.random.org is made with the respective arguments as query params.

### Suggested Feature Implementation
The following suggested optional features were implemnted

1. Hints
2. Configurable difficulty (code length and attempts, and also a time limit).
3. Score keeping.
4. Multiplayer.

### Optional User Authentication

Users can authenticate optionally. A non-signed in user can play the game without logging in, and will have access to hints. Because the game had goals for a leaderboard, signed in users do not have access to hints.

JWTs are used for authentication, and are checked by Express middleware.

### Real-Time Gameplay

Users belonging to the same game can play in real-time together through websocket implementation. The Express backend upgrades to websocket protocol for real-time gameplay.

### LRU-Cache Implementation - Blazingly Fast Gameplay

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

## API Design:

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

### Endpoint Parameters

While the majority of the routes are fairly generic in terms of their parameters, the following core routes are

POST /games/ - Create a New Game

This endpoint is used to create a new game instance. 

Request Parameters:

num: (Required) Integer. Specifies the number of elements in the secret code.
numGuesses: (Required) Integer. Defines the maximum number of guesses allowed in the game.
playerIds: (Optional) Array of Integers. Contains the IDs of players participating in the game. If omitted, then the game is only played by a single player.
endsAt: (Optional) String. A timestamp indicating when the game ends. If not provided, the game has no time limit.

Example Request:

```json

POST /api/games/
Content-Type: application/json

{
    "num": 4,
    "numGuesses": 10,
    "playerIds": [1, 2, 3],
    "endsAt": "2023-12-31T23:59:59Z"
}
```
Response:

201 Created: Game successfully created. Returns the details of the created game.
400 Bad Request: Invalid input or missing required fields.
500 Internal Server Error: Unexpected server error.

POST /games/{gameId}/guesses - Submit a Guess in a Game

This endpoint allows players to submit a guess in an ongoing game.
URL Parameters:

    gameId: (Required) Integer. The ID of the game where the guess is being made.

Request Parameters:

    Body Parameters:
        guesses: (Required) Array of Strings. The player's guess, consisting of a series of numbers or characters, depending on the game configuration.
        playerId: (Optional) Integer. The ID of the player making the guess. Required if the game is not a guest game.

Example Request:

```json

POST /api/games/123/guesses
Content-Type: application/json

{
    "guesses": ["1", "3", "5", "7"],
    "playerId": 45
}
```

```
Response:

    201 Created: Guess successfully submitted. Returns the result of the guess.
    400 Bad Request: Invalid input or missing required fields.
    401 Unauthorized: If the player is not authorized to play in the game.
    404 Not Found: Game not found with the provided gameId.
    422 Unprocessable Entity: If the guess does not meet the game rules or format.
    500 Internal Server Error: Unexpected server error.
```

## Project Folder Structure

### Backend
Routes (/routes): Defines various Express.js routes for different functionalities like users, games, authentication, and testing. Each route uses middleware for authentication and validation, and is linked to specific controller functions.

Controllers (/controllers): Contains the logic for handling requests for different routes. It includes functionalities for user management, game actions (like getting guesses, posting games), and authentication (signup, login).

Database (/database): Manages interactions with the database using Prisma, an ORM (Object-Relational Mapping) for Node.js. It includes functions for querying and manipulating data related to games, game guesses, users, etc.

Types (/types): Defines TypeScript interfaces and types for various entities like game options, errors, database models, etc. This helps in maintaining type safety throughout the application.

Utils (/utils): Utility functions for common tasks like token generation for JWT (JSON Web Tokens), error handling, and other helper methods.

Middleware (/middleware): Custom Express middleware for tasks such as request logging, JWT authentication, validation, and optional JWT authentication.

Sockets (/sockets): Setting up WebSocket for real-time bi-directional communication between clients and the server.

Validations (/validations): Contains express-validator chains for validating and sanitizing inputs for various routes.

Prisma Schema (/prisma): Defines the data model for the application using Prisma, which includes models for users, games, game players, and game guesses.

Tests (/tests): Includes unit tests for specific functionalities, such as scoring rounds in the game.

### Frontend Notes

It should be noted that the main intention of the frontend is to effectively be a dry sponge waiting for hydration from the backend, and at no point attempts to win any awards as far as design goes. 

The frontend purposely has few (less than 5) areas where it handles errors on the frontend, and likewise has no frontend validations. This was intentional in order to display errors from the backend.