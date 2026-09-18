# Resource Booking System

A RESTful Resource Booking System developed using Java 21, Spring Boot, Spring Security, JWT, JPA/Hibernate, MySQL and React.

## Features

- JWT-based authentication
- Role-Based Access Control (RBAC)
- ADMIN and USER roles
- Resource CRUD operations for ADMIN
- Resource viewing for USER
- Create reservations for USER
- Users can view only their own reservations
- ADMIN can view all reservations
- Reservation status management
- Reservation overlap validation
- Price filtering
- Status filtering
- Pagination and sorting
- Request validation
- Global exception handling
- Swagger/OpenAPI documentation
- MySQL database integration
- Frontend built with React and Tailwind CSS

## Technology Stack

### Backend

- Java 21
- Spring Boot 3.x
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- MySQL
- Maven
- Swagger / OpenAPI

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Router

## Project Structure

```text
resource-booking-system/
│
├── src/
│   ├── main/
│   │   ├── java/com/booking/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── exception/
│   │   │   ├── repository/
│   │   │   ├── security/
│   │   │   └── service/
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│
├── resource-booking-frontend/
│
├── pom.xml
└── README.md