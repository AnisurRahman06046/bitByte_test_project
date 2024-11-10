
# Product Catalog API
## Overview
This project is a RESTful API for managing a product catalog, built using NestJS. The API allows users to manage products (CRUD operations) and provides functionality for sorting, filtering, and pagination. It also includes basic role-based authentication for administrative access to product management operations.

## Livesite : api documentation
https://bitbyte-test-project.onrender.com/api
### Note: It is deployed on Render so it takes time to load the api due to Render's free tier limitations.

### Credentials :
***Admin*** : 
- Email : admin123@gmail.com
- Password : admin12345

#### Note: If you create a user then change the role from user to admin from your database. By default the role is kept user.

## Features
- ####  Product Management (Admin Only): Create, update, and delete products (with authentication).
- #### Product Retrieval (Public): Retrieve a list of products with pagination, sorting by price or creation date, and filtering by category, Retrieve details of a single product by its ID.
- #### Error Handling: Handles errors for missing required fields, non-existent products, and invalid query parameters.
- #### Validation: Request data is validated using NestJS validation pipes to ensure data integrity.
- #### Authentication: Basic role-based authentication: only admin users can access product management routes (POST, PATCH, DELETE).


### Technologies Used:
- **NestJS**: Framework for building efficient, reliable, and scalable server-side applications.
- **TypeScript**: Typed superset of JavaScript for cleaner and maintainable code.
- **Postgres**: Relational database for storing products data.
- **Prisma**: As ORM.
- **Swagger**: For api documentation.
- **Bcrypt**: For password hashing.
- **Neon**: For database hosting.


## Clone the repository:
```bash
https://github.com/AnisurRahman06046/bitByte_test_project.git
```
Navigate to the project directory and open the project on code editor.

### Install dependencies:
```bash
npm install
```
### add .env at the root directory and copy from the .env.example
### Run :
```bash
npm run start:dev
```

### Recommendation: 
Run the project from your local machine by completing the initial setup cause on Render it takes time to load api.

### Findings
- Need to implement caching. 
- Need to implement unit testing. 

### Learning curve:
- Exploring redis for caching.
- Exploring unit testing specially in nestjs.

### Deployment:
- **Backend**: Render


