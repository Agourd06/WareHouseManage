# Warehouse Management App

A modern mobile application built with React Native and Expo for efficient warehouse inventory management.

## 🎯 Project Overview

This application helps warehouse managers modernize and simplify their stock management by providing an intuitive interface for:
- Quick stock management using barcode scanning and manual entry
- Real-time product tracking
- Simplified product addition through an interactive form
- Multi-warehouse inventory management

## ⚡ Key Features

- **Authentication**
  - Secure access with personal secret codes
  
- **Product Management**
  - Barcode scanning integration
  - Manual barcode entry
  - Add/remove stock quantities
  - Product information display
  - New product creation form
  
- **Product Listing**
  - Detailed product view
  - Stock status indicators
  - Edit history tracking
  - Stock operations (restock/discharge)
  
- **Advanced Features**
  - Search and filtering
  - Dynamic sorting
  - PDF report export
  
- **Statistics Dashboard**
  - Total products count
  - Out-of-stock items
  - Total stock value
  - Most added/removed products

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- json-server (for backend)

### Installation

1. Clone the repository:   
   ```bash
   git clone https://github.com/Agourd06/WareHouseManage.git
   cd WareHouseManage
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start                  
   ```

4. Scan the QR code with your Expo Go app on your mobile device.


## 📘 API Documentation

### Endpoints

#### Products
```
GET    /products
POST   /products
PUT    /products/:id
DELETE /products/:id
```

#### Warehouse Managers
```
GET    /warehousemans
POST   /warehousemans
PUT    /warehousemans/:id
DELETE /warehousemans/:id
```

#### Statistics
```
GET    /statistics
PUT    /statistics

