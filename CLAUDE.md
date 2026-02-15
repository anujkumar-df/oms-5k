# OMS-5K — Project Guidelines

## Overview

This is an Order Management System (OMS). All development follows Domain-Driven Design (DDD) principles.

## Architecture: Domain-Driven Design

### Strategic Design

- Identify and respect **Bounded Contexts** — each context owns its domain logic and data
- Define clear **Context Maps** showing relationships between bounded contexts (e.g. upstream/downstream, shared kernel)
- Use **Ubiquitous Language** — code, variables, classes, and APIs must use the same terms the business uses (e.g. "Order", "Fulfillment", "Shipment", not "record", "item", "thing")

### Expected Bounded Contexts (refine as the domain evolves)

- **Order Management** — order creation, modification, cancellation, status tracking
- **Inventory** — stock levels, reservations, replenishment
- **Customer** — customer profiles, addresses, preferences
- **Product Catalog** — product definitions, pricing, categories
- **Payment** — payment processing, refunds, billing
- **Shipping & Fulfillment** — shipment tracking, carrier integration, delivery
- **Returns** — return requests, approvals, restocking

### Tactical Design Patterns

Apply these patterns within each bounded context:

- **Entities** — objects with identity that persists over time (e.g. `Order`, `Customer`)
- **Value Objects** — immutable objects defined by their attributes, not identity (e.g. `Money`, `Address`, `OrderLineItem`)
- **Aggregates** — clusters of entities/value objects with a single root entity; all mutations go through the aggregate root
- **Domain Events** — capture things that happened in the domain (e.g. `OrderPlaced`, `PaymentReceived`, `ShipmentDispatched`)
- **Repositories** — abstractions for persisting and retrieving aggregates; no raw database queries in domain logic
- **Domain Services** — stateless operations that don't belong to a single entity (e.g. pricing calculations, order validation)
- **Application Services** — orchestrate use cases by coordinating domain objects; contain no business logic themselves

### Key Rules

1. **Domain layer has zero external dependencies** — no framework imports, no database drivers, no HTTP libraries
2. **All business logic lives in the domain layer** — never in controllers, handlers, or infrastructure code
3. **Aggregates enforce invariants** — an Order aggregate ensures its own consistency (e.g. cannot ship a cancelled order)
4. **Communicate between contexts via domain events or well-defined interfaces** — never reach into another context's internals
5. **Repositories return aggregates, not raw data** — the domain works with domain objects, not database rows

## Project Structure

Organize code by bounded context, not by technical layer:

```
src/
  order/              # Order Management context
    domain/           # Entities, value objects, aggregates, domain events, repository interfaces
    application/      # Use cases / application services
    infrastructure/   # Repository implementations, external service adapters
    api/              # Controllers, routes, DTOs (if applicable)
  inventory/          # Inventory context (same structure)
  customer/           # Customer context (same structure)
  ...
  shared/             # Shared kernel — types/events used across contexts
```

Do NOT organize as `controllers/`, `models/`, `services/`, `repositories/` at the top level. Context-first, layer-second.

## Development Workflow

- Issues are filed in GitHub and automatically implemented by the Cursor Agent
- Every change must relate to OMS product development
- Follow existing code conventions and patterns when extending the codebase
- Write meaningful commit messages referencing the issue number
