# Food Delivery Microservices System

A complete microservices-based **Food Delivery System** built with:

- Spring Boot 3 (Restaurant, Order, Delivery Services)
- Eureka Server (Service Discovery)
- React + Vite Frontend
- MySQL + JPA + Hibernate
- Axios API Integration
- Modern UI with TailwindCSS
- Toast Notifications, Dark Mode, Floating Cart

---

## 📌 System Architecture

**Microservices:**
- Restaurant Service → Manage restaurants & menus
- Order Service → Place & track customer orders
- Delivery Service → Assign & update delivery agents
- Eureka Server → Service registry for all services

**Frontend:**
- Modern food-ordering UI
- Admin dashboard for managing Restaurants, Orders, Deliveries
- Cart system, checkout, order tracking

---

## 🚀 Features

### **Customer Features**
- Browse restaurants
- View menu items
- Add to cart
- Floating cart preview
- Toast notifications
- Place orders
- Track order status
- Track delivery status

### **Admin Features**
- Restaurant CRUD
- Menu CRUD
- Order management with status update
- Delivery assignment + status updates
- Admin dashboard with cards, tables

### **System Features**
- Microservice communication
- Eureka registry for dynamic service discovery
- Clean API structure (REST)
- Validation + error handling
- Modern UI
---

## 🛠️ Technologies Used

### Backend (Java + Spring Boot)
- Spring Boot 3.x
- Spring Web / WebMVC
- Spring Data JPA
- Eureka Server & Eureka Client
- HikariCP
- Lombok
- MySQL Connector/J

### Frontend
- React (Vite)
- TailwindCSS
- Axios
- React Router
- Toast Notifications
- Global Cart Context

### Tools
- Postman
- MySQL Workbench
- IntelliJ / VS Code
- NPM + Node.js

---

# 📁 Project Structure

```
food-delivery-system/
  |
  |-- backend/
  |   |-- eureka-server/
  |   |-- restaurant-service/
  |   |-- order-service/
  |   |-- delivery-service/

-- frontend/
    |
    |-- src/
    |
    |-- components/
    |
    |-- pages/
```

---

## 🚄 Maven Backend Setup

## 1. Start Eureka Server


```
cd backend/eureka-server
mvn spring-boot:run
```

Openc: http://localhost:8761

- Restaurant Service
- Order Service
- Delivery Service

---

## 2. Run Restaurant Service


```
cd backend/restaurant-service
mvn spring-boot:run
```

---

## 3. Run Order Service


```
cd backend/order-service
mvn spring-boot:run
```

---

## 4. Run Delivery Service

```
cd backend/delivery-service
mvn spring-boot:run
```

---


## 📁 APIs (Postman)

## Restaurant

@@ /api/restaurants

@@ /api/restaurants/{id}/menu

## Orders

@@ /api/orders

## Delivery

@@ /api/delivery

---

##  Frontend Setup



```
cd frontend
npm run dev
```

Opens: http://localhost:5173

Pages:
- Home
- Cart
- Checkout
- Order Status
- Delivery Status
- Admin Dashboard
    - Restaurants
    - Menu
    - Orders
    - Delivery


## 🛉 UI Upgrade Features

- Modern Navbar
- Floating Cart Drawer
- Dark Mode Toggle
- Toast Notifications

---

##  🔥 Requirements


- Java 17+
- Node 18+
- MiSQL (for backend)
- Maven 3.9+



---



## 🤝 Contributing

Feel free to fork the repo and submit pull requests.  
For large changes, open an issue first to discuss the updates.

---

## 📄 License

This project is open-source and free to use.

---

## 📌 Author

Developed by **Pavan Kumar** with guidance and backend architecture support.

---

# ⭐ If you like this project, consider giving it a star on GitHub!