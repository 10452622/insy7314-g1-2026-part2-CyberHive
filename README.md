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

## 3. Conclusion

HustleHub+ has been extended from the Part 1 authentication backend into a full-stack freelance marketplace application.

The Part 2 implementation provides clients with the ability to browse gigs and create bookings, while freelancers can create and manage their own gigs and view bookings and income generated from those bookings. Each successful booking creates an associated transaction record, allowing the system to track marketplace activity and freelancer income.

Security has been applied throughout the application through JWT authentication, role-based access control, resource ownership checks, password hashing, input validation and HTTPS/TLS, and controlled error handling.

The frontend provides the user interface while the Node.js and Express.js backend provides the REST API and business logic. Testing has been expanded to include Postman, Newman and frontend tests.
