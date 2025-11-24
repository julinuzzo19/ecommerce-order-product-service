# E-Commerce Order & Product Service

Microservicio de gestión de pedidos, productos y clientes para una plataforma de e-commerce, construido con **Node.js**, **TypeScript** y **Clean Architecture**.

## 🚀 Características

- **Clean Architecture** con separación clara de capas (Domain, Application, Infrastructure)
- **Domain-Driven Design (DDD)** con agregados, entidades y value objects
- **SOLID Principles** aplicados en todo el código
- **Event-Driven Architecture** con RabbitMQ para comunicación asíncrona
- **Unit of Work Pattern** para transacciones consistentes
- **Graceful Shutdown** para cierre controlado de conexiones
- **Logging estructurado** con Winston
- **Monitorización** con New Relic
- **Testing completo** (Unit, Integration, E2E)
- **Type-safe** con TypeScript y Zod para validación
- **Dockerizado** para desarrollo y producción

## 🏗️ Arquitectura

El proyecto sigue los principios de **Clean Architecture** y **Domain-Driven Design**:

```
┌─────────────────────────────────────────────┐
│           Infrastructure Layer              │
│  (Controllers, Routes, Repositories,        │
│   External Services, Database)              │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│           Application Layer                 │
│  (Use Cases, DTOs, Schemas, Events)         │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│             Domain Layer                    │
│  (Entities, Value Objects, Interfaces,      │
│   Business Rules)                           │
└─────────────────────────────────────────────┘
```

### Dominios

- **Customer**: Gestión de clientes y sus direcciones
- **Product**: Catálogo de productos con SKU, precios y categorías
- **Order**: Procesamiento de pedidos con estados y líneas de pedido
- **Shared**: Componentes compartidos entre dominios

## 🛠️ Tecnologías

- **Runtime**: Node.js
- **Lenguaje**: TypeScript
- **Framework Web**: Express.js
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL
- **Message Broker**: RabbitMQ (amqplib)
- **Validación**: Zod
- **Logging**: Winston
- **Monitoring**: New Relic
- **Testing**: Jest, Supertest
- **Containerización**: Docker

## 📦 Requisitos Previos

- Node.js >= 18
- PostgreSQL >= 14
- RabbitMQ >= 3.11
- Docker y Docker Compose (opcional)

## 🔧 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd ecommerce-order-product-service

# Instalar dependencias
npm install

# Generar cliente de Prisma
npm run prisma:generate
```

## ⚙️ Configuración

Crear un archivo `.env.local` en la raíz del proyecto:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"

# RabbitMQ
RABBITMQ_URL="amqp://user:password@localhost:5672"

# Server
PORT=3000
NODE_ENV=development

# New Relic (opcional)
NEW_RELIC_LICENSE_KEY=your_key_here
NEW_RELIC_APP_NAME=ecommerce-order-product-service
```

### Ejecutar migraciones

```bash
# Desarrollo
npm run prisma:migrate:dev

# Producción
npm run prisma:migrate:prod
```

## 🚀 Ejecución

### Desarrollo local

```bash
npm run dev
```

### Con Docker

```bash
# Desarrollo
docker-compose up -d
npm run dev:docker

# Producción
npm run build
npm start
```

## 🧪 Testing

```bash
# Todos los tests
npm test

# Tests unitarios
npm run test:unit

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📁 Estructura del Proyecto

```
src/
├── app/                          # Punto de entrada de la aplicación
│   ├── server.ts
│   └── routes.ts
├── domain/                       # Lógica de negocio por dominio
│   ├── customer/
│   │   ├── domain/              # Entidades, interfaces, excepciones
│   │   ├── application/         # Casos de uso, DTOs, schemas
│   │   └── infrastructure/      # Controllers, routes, repositories
│   ├── order/
│   └── product/
└── shared/                       # Código compartido
    ├── domain/                   # Interfaces y value objects compartidos
    ├── application/              # Event bus, excepciones de aplicación
    └── infrastructure/           # DB, logging, middlewares, monitoring
```

## 🌐 Endpoints API

### Health Check

```http
GET /health
```

### Customers

```http
POST   /api/customers              # Crear cliente
GET    /api/customers              # Listar clientes
```

### Products

```http
POST   /api/products               # Crear producto
GET    /api/products               # Listar productos
```

### Orders

```http
POST   /api/orders                 # Crear pedido vacío
PUT    /api/orders/:id             # Actualizar pedido (agregar items)
GET    /api/orders                 # Listar pedidos
GET    /api/orders/:id             # Obtener pedido por ID
PATCH  /api/orders/:id/status      # Actualizar estado del pedido
```

### Estados de Pedido

- `PENDING`: Pedido creado, pendiente de pago
- `PAID`: Pedido pagado
- `SHIPPED`: Pedido enviado
- `CANCELLED`: Pedido cancelado
