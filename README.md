# HustleHub+

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

---

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
newman run HustleHub.postman_collection.json
```

If .env is required:

```bash
newman run HustleHub.postman_collection.json -e HustleHub.postman_enviroment.json
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

## 3. Conclusion

HustleHub+ has been extended from the Part 1 authentication backend into a full-stack freelance marketplace application.

The Part 2 implementation provides clients with the ability to browse gigs and create bookings, while freelancers can create and manage their own gigs and view bookings and income generated from those bookings. Each successful booking creates an associated transaction record, allowing the system to track marketplace activity and freelancer income.

Security has been applied throughout the application through JWT authentication, role-based access control, resource ownership checks, password hashing, input validation and HTTPS/TLS, and controlled error handling.

The frontend provides the user interface while the Node.js and Express.js backend provides the REST API and business logic. Testing has been expanded to include Postman, Newman and frontend tests.
