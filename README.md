# NestQuest Backend

REST API for property listings with user authentication. Built with Express and MongoDB.

## Features

- User signup/login with JWT
- Password reset flow via email
- CRUD for properties (protected)
- Filtering, sorting, field limiting, and pagination
- Top-rated properties shortcut

## Tech Stack

- Node.js, Express
- MongoDB, Mongoose
- JWT auth, bcrypt

## Project Structure

- app.js — Express app setup and routes
- server.js — environment loading and DB connection
- controllers/ — request handlers
- models/ — Mongoose models
- routes/ — API routes
- utils/ — helpers (errors, async wrapper, API features)
- dev-data/ — seed script and sample data

## Project Structure Tree

```
.
├── app.js
├── config.env
├── package.json
├── README.md
├── server.js
├── controllers/
│   ├── authController.js
│   ├── errorController.js
│   ├── propertyController.js
│   └── userController.js
├── dev-data/
│   ├── import-data.js
│   └── data/
│       └── properties.json
├── models/
│   ├── propertyModel.js
│   └── userModel.js
├── routes/
│   ├── propertyRouter.js
│   └── userRouter.js
└── utils/
  ├── APIFeatures.js
  ├── AppError.js
  ├── catchAsync.js
  └── email.js
```

## Requirements

- Node.js 18+ recommended
- MongoDB connection string

## Setup

1. Install dependencies:
  - `npm install`
2. Create a config file based on config.env:
  - `PORT=3000`
  - `NODE_ENV=development`
  - `DATABASE=<your mongodb connection string with <db_password> placeholder>`
  - `DATABASE_PASSWORD=<your db password>`
  - `JWT_SECRET=<your jwt secret>`
  - `JWT_EXPIRES_IN=7d`
  - `EMAIL_HOST=<smtp host>`
  - `EMAIL_PORT=<smtp port>`
  - `EMAIL_USERNAME=<smtp username>`
  - `EMAIL_PASSWORD=<smtp password>`
3. Start the server:
  - `npm start`

## Scripts

- `npm start` — start server with nodemon

## API Base URL

- `http://localhost:3000/api/v1`

## Auth

Send the JWT in the `Authorization` header:

- `Authorization: Bearer <token>`

## Endpoints

### Auth

- `POST /users/signup`
  - Body:
    - `name`, `email`, `password`, `passwordConfirm`
- `POST /users/login`
  - Body:
    - `email`, `password`
- `POST /users/forgotPassword`
  - Body:
    - `email`
- `POST /users/resetPassowrd/:token`
  - Body:
    - `password`, `passwordConfirm`

### Users

- `GET /users`
- `GET /users/:id`

### Properties

- `GET /properties` (protected)
- `POST /properties` (protected)
- `GET /properties/:id`
- `PATCH /properties/:id` (protected)
- `DELETE /properties/:id` (admin only)
- `GET /properties/top-rated`

## Query Parameters (Properties)

The properties list supports filtering, sorting, field limiting, and pagination.

- Filtering operators: `gte`, `gt`, `lte`, `lt`
  - Example: `/properties?price[gte]=1000&rating[gte]=4`
- Sorting:
  - Example: `/properties?sort=-rating,price`
- Field limiting:
  - Example: `/properties?fields=title,price,area,rating`
- Pagination:
  - Example: `/properties?page=2&limit=10`

## Property Model (Fields)

- `title` (string, required)
- `type` (sale | rent, required)
- `bedrooms` (number, required)
- `bathrooms` (number, required)
- `area` (number, required)
- `rating` (number, default 4.5)
- `reviewsCount` (number, default 0)
- `description` (string, required)
- `price` (number, required)
- `imageCover` (string)
- `images` (string[])
- `createdAt` (date)
- `location` (GeoJSON Point with `coordinates` array)

Virtual:

- `pricePerSqM`

## Seed Data (Optional)

Import or delete sample properties:

- Import: `node dev-data/import-data.js --import`
- Delete: `node dev-data/import-data.js --delete`

## Error Handling

Errors use a consistent JSON shape with `status` and `message` fields. In development, stack traces are included.

## Notes

- All property mutations require a valid JWT.
- The reset password route is spelled `resetPassowrd` in the API.
