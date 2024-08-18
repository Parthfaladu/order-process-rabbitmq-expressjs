# Order Process Microservices with RabbitMQ 

This project is a microservices architecture built using Docker Compose. It includes multiple services that interact with each other, such as `product-service`, `inventory-service`, `order-service`, `payment-service`, along with supporting services like `RabbitMQ` for message brokering and `MongoDB` for database storage.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Services](#services)
  - [Product Service](#product-service)
  - [Inventory Service](#inventory-service)
  - [Order Service](#order-service)
  - [Payment Service](#payment-service)
  - [RabbitMQ](#rabbitmq)
  - [MongoDB](#mongodb)
- [Setup and Installation](#setup-and-installation)
- [Running the Project](#running-the-project)
- [Stopping the Project](#stopping-the-project)
- [Volumes and Networks](#volumes-and-networks)
- [Environment Variables](#environment-variables)
- [License](#license)

## Architecture Overview
This project consists of multiple microservices that communicate with each other over a Docker network named `my-network`. Each microservice is responsible for a distinct functionality, such as managing products, inventory, orders, and payments. The services use RabbitMQ for inter-service communication and MongoDB as the database.

## Services

### Product Service
- **Directory**: `./product-service`
- **Port**: `3001`
- **Description**: Manages product information such as product details, pricing, and availability.
- **Dependencies**: MongoDB

### Inventory Service
- **Directory**: `./inventory-service`
- **Port**: `3002`
- **Description**: Tracks and manages inventory levels for products.
- **Dependencies**: MongoDB

### Order Service
- **Directory**: `./order-service`
- **Port**: `3003`
- **Description**: Handles order processing, including order creation, status tracking, and communication with the payment service.
- **Dependencies**: MongoDB, RabbitMQ

### Payment Service
- **Directory**: `./payment-service`
- **Port**: `3004`
- **Description**: Manages payment processing for orders, interacting with external payment gateways as needed.
- **Dependencies**: MongoDB, RabbitMQ

### RabbitMQ
- **Image**: `rabbitmq:management`
- **Ports**: `5672` (AMQP), `15672` (Management UI)
- **Description**: RabbitMQ is a message broker used for inter-service communication.
- **Environment**:
  - `RABBITMQ_DEFAULT_USER`: Default username for RabbitMQ management.
  - `RABBITMQ_DEFAULT_PASS`: Default password for RabbitMQ management.

### MongoDB
- **Image**: `mongo:latest`
- **Port**: `27018`
- **Description**: MongoDB is the database used by the microservices to store persistent data.
- **Volumes**: Stores data in a named volume `mongo-data`.

## Setup and Installation

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed on your machine.

### Clone the Repository
```sh
git clone https://github.com/Parthfaladu/order-process-rabbitmq-expressjs.git
cd order-process-rabbitmq-expressjs
```

### Directory Structure
- `./product-service`: Contains the codebase for the Product service.
- `./inventory-service`: Contains the codebase for the Inventory service.
- `./order-service`: Contains the codebase for the Order service.
- `./payment-service`: Contains the codebase for the Payment service.

## Running the Project

To start all services, run the following command from the root of the project:
```sh
docker-compose up --build
```
This command will build the Docker images (if not already built) and start the containers.

### Accessing the Services
- **Product Service**: http://localhost:3001
- **Inventory Service**: http://localhost:3002
- **Order Service**: http://localhost:3003
- **Payment Service**: http://localhost:3004
- **RabbitMQ Management UI**: http://localhost:15672 (Default user/password as defined in environment variables)
- **MongoDB**: Accessible on `localhost:27018`

## Stopping the Project
To stop and remove the containers, run:
```sh
docker-compose down
```

## Volumes and Networks

### Volumes
- **mongo-data**: A named volume where MongoDB data is persisted.

### Networks
- **my-network**: A Docker bridge network that allows communication between the containers.

## Environment Variables
- `NODE_ENV=development`: Set for each microservice to run in development mode.
- `RABBITMQ_DEFAULT_USER` and `RABBITMQ_DEFAULT_PASS`: Credentials for RabbitMQ Management UI.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---