[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/dxPbR2Gs)
# 🎨 UniHue: Campus Life, Mapped.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg) ![Status](https://img.shields.io/badge/status-Active_Development-orange.svg)
![Tech Stack](https://img.shields.io/badge/stack-MERN_Stack-blueviolet) ![GIS](https://img.shields.io/badge/GIS-GeoServer_Enabled-green)

**UniHue** is a next-generation social platform developed for university students in Ankara, combining campus life and social events within a geographically based (Web GIS) interface.

---

## 📖 Project Overview (Abstract)

University students have difficulty tracking on-campus activities (e.g., coffee breaks, club meetings) and city-wide events (e.g., theater, opera, concerts). **UniHue** gathers these heterogeneous event datasets in a single, map-based center.

The project offers a customized experience based on users’ **institutional email addresses** (e.g., `@hacettepe.edu.tr`). The system is built on a NoSQL database architecture and supports advanced spatial queries as well as OGC-standard (WMS/WFS) map services.

## ✨ Key Features

### 1. 🔐 Smart Authentication
* [cite_start]**Domain-Based Customization:** When a user registers with a university email address, the system automatically recognizes the university, updates the interface (logo/theme) accordingly, and highlights relevant campus events[cite: 24, 25].
* **JWT (JSON Web Token):** Secure session management.

### 2. 👥 User Roles and Management (User Types)
[cite_start]The system includes 3 main roles with different authorization levels[cite: 12, 15, 16]:

| Role | Permissions |
| :--- | :--- |
| **Standard Student** (Viewer) | Views events on the map, applies filters, and examines details. |
| **Verified Student** (Verified Creator) | [cite_start]Can create (CRUD) their own real-time events using Point data type on the map[cite: 20, 21]. |
| **Campus Admin** (Admin) | Manages official university events and controls WMS/WFS layers. |

### 3. 🗺️ Advanced GIS Integration
* [cite_start]**GeoServer Integration:** Campus boundaries and building structures are served via GeoServer using **WMS (Web Map Service)** and **WFS (Web Feature Service)** protocols[cite: 38, 39].
* [cite_start]**Bonus Layers:** In addition to point-based event data, campus boundaries are processed as Polygon geometries[cite: 23].
* [cite_start]**Filtering:** Users can filter data by event type (Theater, Opera, Cafe) and location[cite: 22].

### 4. 🚀 Performance and Technology
* [cite_start]**NoSQL Database:** MongoDB is used to efficiently manage heterogeneous event data[cite: 26, 27].
* [cite_start]**API Documentation:** All backend services are documented using Swagger UI[cite: 37].
* [cite_start]**Performance Tests:** System behavior under load was tested and reported using Artillery/JMeter[cite: 28, 29].

---

## 🛠️ Technical Architecture (Tech Stack)

[cite_start]This project was developed using a Full-Stack JavaScript architecture[cite: 4].

* **Frontend:** React.js, Leaflet.js (Map), Bootstrap 5
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (NoSQL) & Mongoose ODM
* **GIS Server:** GeoServer (Localhost/Ngrok Tunneling)
* **Tools:** Swagger (Docs), Postman (API Test), Artillery (Load Test)

---

## ⚙️ Installation and Setup

To run the project in a local environment, follow the steps below:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/kullaniciadi/UniHue-WebGIS.git
    cd UniHue-WebGIS
    ```

2.  **Install Dependencies:**
    ```bash
    # Backend
    cd server
    npm install
    
    # Frontend
    cd ../client
    npm install
    ```

3.  **Configure Environment Variables (.env):**
    Create a `.env` file in the `server` directory and enter your MongoDB URI.

4.  **Start the Application:**
    ```bash
    # Server (Port 5000)
    npm start
    
    # Client (Port 3000)
    npm start
    ```

---

## 📊 Performance and Indexing Report

[cite_start]*(This section will include performance test graphs and indexing experiments in the assignment submission [cite: 17, 19, 29])*

* **Indexing Experiment:** It was observed that spatial queries using a `2dsphere` index in MongoDB performed %X faster compared to non-indexed queries.
* **Stress Test:** In Artillery tests conducted with 100 virtual users, the average response time was measured as X ms.

---

## 📡 API Endpoints

All API documentation is accessible via `/api-docs`. [cite_start]Main services[cite: 31, 32, 33, 34, 35]:

* `GET /api/events` - Retrieves all spatial data.
* `POST /api/events` - Adds a new spatial feature.
* `PATCH /api/events/:id` - Updates geometry or attributes.
* `DELETE /api/events/:id` - Deletes a spatial feature.

---

*GMT 458 - Web GIS Final Assignment / 2026*
