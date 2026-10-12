# HustleHub+

## Explanation of the system:
HustleHub+ is a freelance marketplace or a platform that connects clients with freelancers. Clients can browse and search for services, view the freelancer profiles and available gigs, place bookings/orders, make payments towards the service(s), communicate with freelancers and leave reviews.
Freelancers can create and manage gigs, manage bookings, view their earnings and transactions, communicate with clients and manage their profile and security settings.

For part 2, the original backend has been extended into a full-stack application. A React.js frontend has been developed to allow users to interact with the backend through the REST API endpoints.

The application now supports marketplace functionality including gig creation, gig browsing, gig management, bookings along with booking confirmations, transaction records and freelancer income tracking.

The backend is developed using Node.js and Express.js and the frontend is developed using React.js in Visual Studio Code. The system follows the MERN architecture with the MongoDB forming the intended database layer for persistent application data. This application provides REST API endpoints that allow the frontend application to communicate with the backend application and perform operations such as user registration, authentication and management of HustleHub+ services.

## 1. Intended Users

### 1.1 Clients

**Functions:**
- Create an account and/or login.
- Search and browse freelancer services.
- Filter services based on categories, price and ratings.
- View freelancer profiles and gig details.
- Book/order freelance services.
- Make payments.
- View booking/order history.
- Track booking status.
- Receive notifications.
- Communicate with freelancers.
- Leave reviews and ratings.
- Manage their profile and security settings.
- Reset their password if required.

### 1.2 Freelancers

**Functions:**
- Register as a freelancer.
- Log in securely.
- Create and manage gigs.
- Edit or remove existing gigs.
- View client orders.
- Accept and manage orders.
- Communicate with clients.
- Track earnings.
- View transaction records.
- View estimated tax information.
- Receive notifications.
- Manage their profile.
- Change their password and security settings.

---

## Application Features

### Authentication

Users must authenticate before accessing the protected functionality.

Authentication functionality for users include:

- User registration.
- Account/User type selection.
- Role-based access control.
- User login.
- JWT-based authentication.
- Password hashing.
- Password reset functionality.
- Protected API routes.

### Gig Management

Freelancers are able to manage their own marketplace listings.

The backend performs authorization and ownership checks before sensitive operations are completed e.g. a freelancer updates or deletes a gig that belongs to them but they cannot update or delete another freelancer’s gig.

A freelancer can:

- Create a gig(s).
- View their gig(s).
- Update their own gig(s).
- Delete their own gig(s).

### Gig Browsing

Clients and guests can browse available services through the React frontend. The frontend communicates with the Express API to retrieve the relevant gig information.

Clients and guests can:

- Browse available gigs.
- Search for gigs.
- Filter gigs.
- View gig details.
- View freelancer information.
- Select a service to book.

### Booking Functionality

Clients can initiate a booking from a gig's details page. The application does not use a real payment gateway. Instead, a simulated payment/booking confirmation is used for assessment purposes.

The booking process includes:

- Selecting a gig.
- Reviewing the gig information.
- Providing the required booking information.
- Selecting the simulated payment method.
- Confirming the booking.
- Creating a booking/order record.
- Creating an associated transaction record.
- Displaying the booking confirmation.

### Transaction and Income Tracking

Every successful booking results in a transaction record being created.

The transaction is associated with the relevant:

- Client.
- Freelancer.
- Gig.
- Booking/order.
- Amount.
- Transaction status.

The transaction information allows the system to track income generated from bookings and associate the income with the correct freelancer.

Freelancers can view:

- Earnings.
- Transactions.
- Booking-related income.
- Estimated tax information.

### Messages and Notifications

#### Messages

The messaging functionality allows clients and freelancers to communicate with each other.

Messages support:

- Client-to-freelancer communication.
- Freelancer-to-client communication.
- Sending and receiving messages.
- Conversation history.

#### Notifications

Notifications are separate from messaging and are used for system-generated alerts.

Examples include:

- Booking confirmations.
- Booking updates.
- Payment/transaction updates.
- Password reset notifications.
- Other system alerts.

Messages therefore represent user-to-user communication, while notifications represent system-generated information.

---

## Backend Structure

The backend of **HustleHub+** is built using **Node.js** and **Express.js**. It follows a modular architecture that separates application responsibilities into dedicated folders and files, making the codebase easier to maintain, test, and extend.

### Backend Project Structure

```text
HustleHub+/
├── backend/
│   ├── config/
│   ├── certs/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── node_modules/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── .vscode/
    ├── dist/
    ├── node_modules/
    ├── public/
    ├── src/
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── vite.config.js
```

### Backend Folder and File Descriptions

| Folder/File | Description |
|---|---|
| `config/` | Contains configuration files and setup logic required by the backend, such as database connection settings. |
| `certs/` | Contains the local SSL/TLS certificates required for HTTPS communication during development. |
| `controllers/` | Contains the main application logic for backend features, including user registration, authentication, and user operations. |
| `data/` | Handles local data storage and retrieval where applicable. This functionality can be extended or replaced with database-backed storage. |
| `middleware/` | Contains middleware responsible for authentication, input validation, rate limiting, error handling, and other request-processing tasks. |
| `models/` | Defines the data structures and models used to represent application entities. |
| `routes/` | Defines the API routes and endpoints through which the frontend communicates with the backend. |
| `utils/` | Contains reusable helper functions, including security-related utilities such as password hashing and JSON Web Token (JWT) generation. |
| `node_modules/` | Contains the Node.js packages and dependencies installed for the backend. This directory is generated through package installation and should not be committed to Git. |
| `.env` | Stores environment variables and sensitive configuration values outside the source code. This file must not be committed to the repository. |
| `.gitignore` | Specifies files and directories that Git should exclude from version control, such as environment files and installed dependencies. |
| `package.json` | Contains project metadata, dependencies, and scripts required to install, configure, and run the backend. |
| `package-lock.json` | Records the resolved dependency versions to support consistent installations across development environments. |
| `server.js` | Serves as the main entry point of the backend. It configures Express, registers middleware and routes, establishes required connections, and starts the HTTPS server. |

> **Note:** The `utils/` directory is included in this structure because it is referenced in the folder descriptions. Ensure that it exists in the actual project. Similarly, retain only the folders that are present in your repository.

## Frontend Structure

The frontend of **HustleHub+** is developed using **React.js** and **Vite**. It provides the user interface through which clients and freelancers interact with the platform's features.

The frontend communicates with the Node.js and Express.js backend through **REST API requests**, enabling users to access application functionality through their respective interfaces.

### Frontend Application Sections

#### 1. Authentication

The authentication section provides the pages required for users to access the platform and create accounts.

- **Landing Page** — Introduces HustleHub+ and its core features.
- **Register Page** — Allows new users to create an account.
- **Choose Account Type** — Allows users to select the appropriate account type, such as client or freelancer.
- **Login Page** — Allows registered users to authenticate and access their accounts.
- **Forgot Password Page** — Supports the password recovery process.

#### 2. Client Functionality

The client interface allows users to discover freelancers, manage bookings, communicate with freelancers, and maintain their accounts.

- **Client Home/Browse** — Displays available services and freelancers.
- **Search Results** — Displays freelancers or gigs matching a user's search criteria.
- **Gig Details** — Displays information about a selected gig, including its description and relevant details.
- **Booking Page** — Allows clients to initiate a booking for a selected gig.
- **Booking Confirmation** — Displays confirmation details after a successful booking.
- **My Orders** — Provides an overview of the client's bookings and orders.
- **Order Details** — Displays information about a specific order.
- **Messages** — Enables communication between clients and freelancers.
- **Profile/Security** — Allows clients to manage their profile information and account security settings.

#### 3. Freelancer Functionality

The freelancer interface provides tools for managing services, tracking orders, monitoring earnings, and maintaining account information.

- **Freelancer Dashboard** — Provides an overview of the freelancer's activities and performance.
- **My Gigs** — Allows freelancers to manage the services they offer.
- **Orders** — Displays and supports the management of incoming and ongoing orders.
- **Earnings** — Provides an overview of income generated through the platform.
- **Estimated Tax** — Helps freelancers estimate their tax obligations based on relevant earnings information.
- **Transaction Records** — Displays financial transaction history.
- **Messages** — Enables communication with clients.
- **Profile/Security** — Allows freelancers to manage their profile information and account security settings.

## Frontend–Backend Communication

HustleHub+ uses a client-server architecture in which the React frontend communicates with the Express.js backend through RESTful API endpoints.

The general request flow is as follows:

1. A client or freelancer interacts with the React user interface.
2. The frontend sends an HTTP or HTTPS request to the appropriate backend API endpoint.
3. Express.js routes the request to the relevant controller, applying the required middleware.
4. The backend processes the request and interacts with the applicable data source or model.
5. The backend returns a response to the frontend.
6. The frontend updates the user interface based on the response.

This separation of responsibilities improves maintainability, supports modular development, and allows the frontend and backend to evolve independently.

## Security Decisions

### Password Hashing

Prevents passwords from being stored as plain text.

### JWT Authentication

Ensures protected API requests can only be accessed by authenticated users.

### Role-Based Access Control

Role-based access control is used to ensure that users can only perform actions permitted for their role.

The main roles are:

- Client.
- Freelancer.

### Resource Ownership

The application checks whether a resource belongs to the authenticated user before allowing sensitive operations. This protects the system against unauthorized access to resources.

### Input Validation

Prevents invalid or potentially malicious input from being processed.

### HTTPS/TLS

Encrypts communication between the frontend and backend.

### Error Handling

Prevents internal system information from being exposed through error responses.

### Environment Variables

Keeps sensitive configuration and secrets outside the source code.

### .gitignore

Prevents sensitive files such as .env from being committed to the repository.

---

## 2. MERN Architecture

### 2.1 Architecture Overview

**React.js (Frontend)**

↓

**HTTPS/TLS**

↓

**Node.js + Express.js (Backend)**

- Authentication
- User/Role Management
- Gig Management
- Booking Management
- Transaction Management
- Messages
- Notifications
- Security Middleware

↓

**MongoDB (Database)**

## Running the application
### Backend:
**Prerequisites:**
Required software:
•	Node.js.
•	npm.
•	Visual Studio Code.
•	Git.
•	MongoDB.

**Install backend dependencies:**
1.	Open a terminal to navigate to backend folder: cd backend
2.	Install dependencies: npm install
Environment variables:
Copy and paste the .env file available in arc into the program opened in Visual Studio Code.

**Start the backend:**
The start command is defined in package.json (node server.js).

### Frontend:
1.	Open a terminal to navigate to backend folder: cd frontend
2.	Install dependencies: npm install

**Start the frontend:**
The start command is npm run dev or npm start. The frontend communicates with backend API.

## Testing

For part 2, testing was extended include both the backend and frontend components.

### Backend API Testing

Tested using Postman.

The Postman collection covers key endpoints including:

- Registration.
- Login.
- Authentication.
- Gig creation.
- Gig retrieval.
- Gig updating.
- Gig deletion.
- Booking creation.
- Booking retrieval.
- Transaction creation.
- Protected routes.
- Invalid requests.
- Unauthorised requests.

### Frontend Testing

The frontend includes basic automated tests to demonstrate component rendering and user interaction.

Testing includes functionality such as:

- Component rendering.
- Form interaction.
- User input.
- Authentication-related interactions.
- Booking-related interactions.

The frontend tests can be executed using the testing command configured in the React project.

### Newman Testing

The newman tests verify that the API endpoints return the expected response and that operations are protected and reject authorized requests.

Newman is used to execute the Postman collection from the command line:

```bash
newman run "HustleHub+2.postman_collection.json" -e "HustleHub Local.postman_enviroment.json"
```

### Security and Authorization Testing

Testing also includes unauthorised and invalid scenarios.

Examples include:

- Registering with invalid information.
- Logging in with incorrect credentials.
- Accessing protected endpoints without a JWT.
- Using an invalid JWT.
- Attempting to modify another user's gig.
- Attempting to delete another user's gig.
- Attempting to access another user's resources.
- Submitting invalid gig information.
- Submitting invalid booking information.
- Exceeding configured rate limits.

These tests demonstrate that authentication, authorisation, validation and ownership controls are applied to sensitive operations.

---

## Demonstration Video

The demonstration video showcases the key features and functionality of HustleHub+, including the client and freelancer interfaces.

**YouTube Link:** [Watch the HustleHub+ Demonstration Video](https://youtu.be/VDY50vO1tt0)

## 3. Conclusion

HustleHub+ has been extended from the Part 1 authentication backend into a full-stack freelance marketplace application.

The Part 2 implementation provides clients with the ability to browse gigs and create bookings, while freelancers can create and manage their own gigs and view bookings and income generated from those bookings. Each successful booking creates an associated transaction record, allowing the system to track marketplace activity and freelancer income.

Security has been applied throughout the application through JWT authentication, role-based access control, resource ownership checks, password hashing, input validation and HTTPS/TLS, and controlled error handling.

The frontend provides the user interface while the Node.js and Express.js backend provides the REST API and business logic. Testing has been expanded to include Postman, Newman and frontend tests.
