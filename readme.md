# School Management Application

## Description
This is a school management application built with Node.js and Express. It provides a backend API for managing various aspects of a school, including students, teachers, classes, and academic records.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/nitishkumarnitc/scaler-project.git
   ```

2. Navigate to the project directory:
   ```
   cd scaler-project
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:
   ```
   PORT=5130
   DB=mongodb+srv://your_username:your_password@cluster0.xkaan.mongodb.net/scaler?retryWrites=true&w=majority
   JWT_SECRET_KEY=your_jwt_secret_key
   ```
   Replace `your_username`, `your_password`, and `your_jwt_secret_key` with your actual MongoDB credentials and a secure JWT secret key.

## Usage

To start the server in development mode with hot reloading:
```
npm run dev
```

To start the server in production mode:
```
npm start
```

The server will start on the port specified in your `.env` file (default is 5130).

## API Endpoints

(List your API endpoints here, e.g.:)
- POST /api/auth/register
- POST /api/auth/login
- GET /api/students
- POST /api/students
- ... (add more endpoints as needed)

## Dependencies

- express: Web application framework
- mongoose: MongoDB object modeling tool
- bcryptjs: Library for hashing passwords
- jsonwebtoken: JSON Web Token implementation
- cors: Cross-Origin Resource Sharing middleware
- dotenv: Loads environment variables from .env file
- colors: Adds colors to console output

## Dev Dependencies

- nodemon: Monitors for changes and automatically restarts the server
- morgan: HTTP request logger middleware

## Scripts

- `npm start`: Starts the server
- `npm run dev`: Starts the server using nodemon for development
- `npm test`: Placeholder for running tests (currently not implemented)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Author

Nitish Kumar

## Repository

[https://github.com/nitishkumarnitc/scaler-project](https://github.com/nitishkumarnitc/scaler-project)