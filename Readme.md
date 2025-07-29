Ride Booking API
================

A TypeScript-based RESTful API for a ride-sharing platform, built with Node.js, Express, and MongoDB. The API supports rider, driver, and admin functionalities, including user authentication, ride requests, ride acceptance, status updates, and administrative tasks like driver approval and user management.

Table of Contents
-----------------

*   [Features](#features)
*   [Tech Stack](#tech-stack)
*   [Project Structure](#project-structure)
*   [Prerequisites](#prerequisites)
*   [Installation](#installation)
*   [Environment Variables](#environment-variables)
*   [Running the API](#running-the-api)
*   [API Endpoints](#api-endpoints)
*   [Testing with Postman](#testing-with-postman)
*   [Video Demonstration](#video-demonstration)
*   [Troubleshooting](#troubleshooting)
*   [Deployment](#deployment)
*   [Contributing](#contributing)
*   [License](#license)

Features
--------

*   **User Authentication**: Register and login for riders, drivers, and admins with JWT-based authentication.
*   **Rider Features**:
    *   Request rides with pickup and destination coordinates.
    *   Cancel rides within a 5-minute window.
    *   View ride history.
*   **Driver Features**:
    *   Set online/offline availability.
    *   Accept ride requests.
    *   Update ride status (picked up, in transit, completed).
    *   View earnings history.
*   **Admin Features**:
    *   Approve drivers.
    *   Block/unblock users.
    *   View all users and rides.
*   **Error Handling**: Robust validation and logging for errors (e.g., invalid ObjectId, unavailable driver).
*   **Logging**: Combined and error logs stored in the `logs` directory.

Tech Stack
----------

*   **Language**: TypeScript
*   **Framework**: Node.js, Express
*   **Database**: MongoDB with Mongoose
*   **Authentication**: JSON Web Tokens (JWT)
*   **Validation**: Joi
*   **Logging**: Winston
*   **Testing**: Postman
*   **Dependencies**: bcrypt, dotenv      

Prerequisites
-------------

*   **Node.js**: v18.x or higher
*   **npm**: v9.x or higher
*   **MongoDB**: Local or cloud instance (e.g., MongoDB Atlas)
*   **Postman**: For testing API endpoints
*   **Git**: For version control

Installation
------------

1.  **Clone the Repository**:
    
        git clone https://github.com/mahadi-zulfiker/Ride-Management-Backend
        cd Ride-Management-Backend
    
2.  **Install Dependencies**:
    
        npm install
    
3.  **Set Up MongoDB**:
    *   Install MongoDB locally or use MongoDB Atlas.
    *   Ensure MongoDB is running on `mongodb://localhost:27017/ride_booking` or update the connection string in `.env`.

Environment Variables
---------------------

Create a `.env` file in the project root with the following variables:

    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/ride_booking
    JWT_SECRET=your_jwt_secret_key
    NODE_ENV=development

*   **PORT**: Port for the Express server.
*   **MONGODB\_URI**: MongoDB connection string.
*   **JWT\_SECRET**: Secret key for JWT signing (generate a secure key).
*   **NODE\_ENV**: Set to `development` or `production`.

Running the API
---------------

1.  **Start MongoDB**:
    *   Local: `mongod`
    *   Atlas: Ensure the cluster is active.
2.  **Start the Server**:
    
        npm run dev
    
    *   Uses `ts-node-dev` for development with auto-reload.
    *   The API will run on `http://localhost:3000`.
3.  **Production Build**:
    
        npm run build
        npm start
    

API Endpoints
-------------

All endpoints are prefixed with `http://localhost:3000`.

### Authentication

*   **POST /auth/register**: Register a rider, driver, or admin.
    *   Body: `{ "email", "password", "name", "role", "vehicleInfo" (for drivers) }`
*   **POST /auth/login**: Login and get JWT token.
    *   Body: `{ "email", "password" }`

### Rider

*   **POST /rides/request**: Request a ride.
    *   Headers: `Authorization: Bearer <riderToken>`
    *   Body: `{ "pickup": { "latitude", "longitude" }, "destination": { "latitude", "longitude" } }`
*   **PATCH /rides/:id/cancel**: Cancel a ride.
    *   Headers: `Authorization: Bearer <riderToken>`
*   **GET /rides/me**: View ride history.
    *   Headers: `Authorization: Bearer <riderToken>`

### Driver

*   **PATCH /drivers/availability**: Set online/offline status.
    *   Headers: `Authorization: Bearer <driverToken>`
    *   Body: `{ "isOnline": true/false }`
*   **PATCH /rides/:id/accept**: Accept a ride.
    *   Headers: `Authorization: Bearer <driverToken>`
*   **PATCH /rides/:id/status**: Update ride status.
    *   Headers: `Authorization: Bearer <driverToken>`
    *   Body: `{ "status": "picked_up"/"in_transit"/"completed" }`
*   **GET /drivers/earnings**: View earnings.
    *   Headers: `Authorization: Bearer <driverToken>`

### Admin

*   **GET /users**: View all users.
    *   Headers: `Authorization: Bearer <adminToken>`
*   **GET /rides**: View all rides.
    *   Headers: `Authorization: Bearer <adminToken>`
*   **PATCH /drivers/approve/:id**: Approve a driver.
    *   Headers: `Authorization: Bearer <adminToken>`
*   **PATCH /users/block/:id**: Block/unblock a user.
    *   Headers: `Authorization: Bearer <adminToken>`
    *   Body: `{ "block": true/false }`

Testing with Postman
--------------------

1.  **Import Collection**:
    *   Import `postman_collection.json` into Postman.
2.  **Set Environment Variables**:
    *   Create a Postman environment named `RideBookingAPI` with:
        
            {
               "baseUrl": "http://localhost:3000",
                "riderToken": "",
                "driverToken": "",
                "adminToken": "",
                "rideId": "",
                "riderId": "",
                "driverId": "",
                "unapprovedDriverId": "",
                "unapprovedDriverToken": ""
            }
        
3.  **Testing Flow**:
    *   **Register Users**: Run `Register Rider`, `Register Driver`, and `Register Admin`.
    *   **Login Users**: Run `Login Rider`, `Login Driver`, and `Login Admin`. Save tokens via test scripts.
    *   **Approve Driver**: Run `Approve Driver` with `adminToken`.
    *   **Set Driver Online**: Run `Set Availability` with `driverToken` and `{ "isOnline": true }`.
    *   **Request Ride**: Run `Request Ride` with `riderToken`. Save `rideId`.
    *   **Accept Ride**: Run `Accept Ride` with `driverToken`.
    *   **Update Status**: Run `Update Ride Status` endpoints.
    *   **View Earnings**: Run `Earnings` with `driverToken`.
    *   **Admin Tasks**: Run `Get All Users`, `Get All Rides`, and `Block User`.
    *   **Edge Cases**: Test invalid tokens, unapproved drivers, offline drivers, etc.
4.  **Common Issues**:
    *   **Invalid ObjectId**: Ensure `driverId` and `rideId` are clean (no newlines). Fixed by updating Postman variables.
    *   **Invalid or unavailable driver**: Ensure driver is approved (`isApproved: true`) and online (`isOnline: true`).

Video Demonstration
-------------------

A video is included to demonstrate the API:

*   **Overview**: Project structure and setup.
*   **Postman Demo**: End-to-end flow (register, login, approve driver, set online, request/accept ride, update status, view earnings, admin tasks).
*   **Edge Cases**: Handling invalid tokens, unapproved/offline drivers, and blocked users.

Video link: \[Insert link or note it’s submitted separately\].

Deployment
----------

To deploy the API (e.g., on Render or Heroku or vercel):

1.  **Build the Project**:
    
        npm run build
    
2.  **Set Environment Variables**:
    *   Configure `PORT`, `MONGODB_URI`, `JWT_SECRET`, and `NODE_ENV=production` on the hosting platform.
3.  **Deploy**:
    *   Push to a GitHub repository and connect to the hosting service.
    *   Use a MongoDB Atlas cluster for production.
4.  **Example Render Config**:
    *   Node.js environment.
    *   Build command: `npm install && npm run build`.
    *   Start command: `npm start`.

Contributing
------------

*   Fork the repository.
*   Create a feature branch (`git checkout -b feature/your-feature`).
*   Commit changes (`git commit -m "Add feature"`).
*   Push to the branch (`git push origin feature/your-feature`).
*   Open a pull request.

License
-------

MIT License. See [LICENSE](LICENSE) for details.