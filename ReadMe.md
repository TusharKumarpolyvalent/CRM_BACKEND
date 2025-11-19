# BACKEND-MYSQL

A Node.js backend API for user management built with Express and Prisma ORM, using MySQL as the database.

---

## Table of Contents

1. [Setup & Installation](#setup--installation)
2. [Project Structure](#project-structure)
3. [API Endpoints](#api-endpoints)
   - [Add User API](#add-user-api)

---

## Setup & Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure your database connection in `src/config/prisma.js` and `prisma/schema.prisma`.

3. Run Prisma migrations:

   ```bash
   npx prisma migrate deploy
   ```

4. Start the server:
   ```bash
   npm start
   ```

---

## Project Structure

```
src/
├── config/
│   └── prisma.js              # Prisma client configuration
├── controllers/
│   └── user.controller.js      # User endpoint handlers
├── routes/
│   ├── api.route.js            # Main API router
│   └── user.route.js           # User routes
├── services/
│   └── users.service.js        # User business logic
├── utils/
│   ├── Constant.js             # Validation utilities & constants
│   └── Regex.js                # Regular expressions for validation
└── testconnection.js           # Database connection test

prisma/
├── schema.prisma               # Prisma data model
└── migrations/                 # Database migration history
```

---

## API Endpoints

### Add User API

**Endpoint:** `POST /user/add`

**Purpose:** Create a new user record in the database.

#### Request

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "userPhone": "+1234567890",
  "userPassword": "Abcdef@1",
  "firstName": "John",
  "lastName": "Doe",
  "userEmail": "john.doe@example.com",
  "role": "admin"
}
```

#### Field Validation Rules

The following validation rules are applied in `src/controllers/user.controller.js`:

| Field          | Type   | Rules                                                                                 | Error Message                                                                                       |
| -------------- | ------ | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `userPhone`    | string | Must pass `validatePhone()` (defined in `src/utils/Constant.js`)                      | `Please enter a valid phone`                                                                        |
| `userPassword` | string | Must pass `validatePassword()` (min 6 chars, starts with uppercase, has special char) | `Password must contain at least 6 characters, starting with an uppercase and one special character` |
| `firstName`    | string | Length: 3–20 characters                                                               | `First name must be minimum 3 characters and maximum 20 characters long only`                       |
| `lastName`     | string | Length: max 20 characters                                                             | `Last name must be maximum 20 characters long`                                                      |
| `userEmail`    | string | Must pass `validateEmail()` (defined in `src/utils/Constant.js`)                      | `Please enter a valid email`                                                                        |
| `role`         | string | Length: 3–20 characters                                                               | `Role must be minimum 3 characters and maximum 20 characters long`                                  |

#### Success Response

**Status:** `201 Created`

**Response Body:**

```json
{
  "message": "User created successfully",
  "data": {
    "id": 1,
    "userPhone": "+1234567890",
    "userPassword": "Abcdef@1",
    "firstName": "John",
    "lastName": "Doe",
    "userEmail": "john.doe@example.com",
    "role": "admin",
    "createdAt": "2025-11-19T12:00:00.000Z"
  }
}
```

The `data` object contains the user record as persisted in the database. Exact fields depend on your Prisma schema in `prisma/schema.prisma`.

#### Error Response

**Status:** `500 Internal Server Error`

**Response Body (example):**

```json
{
  "message": "Internal Server Error",
  "error": "Please enter a valid email"
}
```

> **Note:** Currently, validation errors return a 500 status. Consider updating the controller to return `400 Bad Request` for client input errors in future improvements.

#### Implementation Details

**Controller:** `src/controllers/user.controller.js`

- Validates all input fields against defined rules
- Calls the service layer to create the user

**Service:** `src/services/users.service.js`

- Executes `prisma.users.create(data)` to insert the record into the database
- Returns the created user record

**Flow:**

```
POST /user/add
    ↓
user.route.js (route handler)
    ↓
user.controller.js (addUser function)
    ↓
Validation (throws on error)
    ↓
users.service.js (createUser)
    ↓
Prisma (users.create)
    ↓
MySQL Database
    ↓
Response (201 + user data OR 500 + error)
```

#### Usage Examples

**curl:**

```bash
curl -X POST "http://localhost:3000/user/add" \
  -H "Content-Type: application/json" \
  -d '{
    "userPhone": "+1234567890",
    "userPassword": "Abcdef@1",
    "firstName": "John",
    "lastName": "Doe",
    "userEmail": "john.doe@example.com",
    "role": "admin"
  }'
```

**Node.js (fetch):**

```javascript
async function addUser() {
  const res = await fetch('http://localhost:3000/user/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userPhone: '+1234567890',
      userPassword: 'Abcdef@1',
      firstName: 'John',
      lastName: 'Doe',
      userEmail: 'john.doe@example.com',
      role: 'admin',
    }),
  });
  const data = await res.json();
  console.log(res.status, data);
}

addUser();
```

**JavaScript (Node.js built-in http module):**

```javascript
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/user/add',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', JSON.parse(data));
  });
});

req.on('error', (e) => console.error('Error:', e));

req.write(
  JSON.stringify({
    userPhone: '+1234567890',
    userPassword: 'Abcdef@1',
    firstName: 'John',
    lastName: 'Doe',
    userEmail: 'john.doe@example.com',
    role: 'admin',
  })
);

req.end();
```

#### Troubleshooting

- **Validation error responses:** Ensure all request fields are strings and match the validation rules above.
- **Database connection error:** Check `src/config/prisma.js` and `prisma/schema.prisma` for correct DB credentials.
- **Missing or invalid fields:** Verify the request body includes all required fields with correct types.

#### Recommended Improvements

1. **HTTP Status Codes:** Return `400 Bad Request` for validation errors instead of `500`.
2. **Password Security:** Hash passwords before storing (use bcrypt or similar).
3. **Error Handling:** Differentiate between validation errors and server errors.
4. **Logging:** Add structured logging for debugging and monitoring.
5. **Rate Limiting:** Consider adding rate limiting to prevent abuse.

---

## Contributing

Please follow the existing code structure and commit message guidelines defined in `commitlint.config.js`.

---

## License

See repository for license information.
