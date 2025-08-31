# Sample Lunar API

A simple RESTful API built with Node.js, Express.js, and MongoDB (native driver).  
Includes user authentication (JWT) and product management.

---

- User Authentication (Register/Login with JWT)
- Hashed password
-  Role-based Authorization (Admin/User)
-  Product Management (CRUD operations)
-  Protected routes using JWT middleware
- Only admin can delete products
- pagination and search
- Created by(auto from logged in user)

## ⚙️ Setup Instructions

- In login role is set default as user, we have to change the role to admin in db. Then login again and put the token, then we have to delete the product.

### 1. Clone the repository
```bash
git clone https://github.com/amaljosesebastian14-afk/sample--lunar.git
cd sample--lunar