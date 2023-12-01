
# Setup and running

## Backend
To set up locally, from the project root, in the terminal use:

```bash
cd backend
npm install
```
Afterwards, create a .env file in /backend, inside paste the following

```bash
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/mastermind?schema=public"
```
Of course substituting <username> and <password> for your username and password respectively. If another database currently has the name "mastermind", then feel free to change the name as well.

## Frontend

For viewing on the frontend:

```bash
cd backend
npm install
```

Features: 
- user auth
- Multiplayer game


Backend Routes:

POST api/v1/games
PATCH api/v1/games
GET api/v1/games

POST api/v1/scores
GET api/v1/scores
PATCH api/v1/scores

POST api/v1/users
PATCH api/v1/users# Maxwell-Fong-Mastermind
