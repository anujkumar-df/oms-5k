import { Order } from "./Order.js";

/**
 * OrderRepository — Repository Interface
 *
 * Abstraction for persisting and retrieving Order aggregates.
 * The domain layer defines this interface; infrastructure provides the implementation.
 * No database-specific details leak into the domain.
 */
export interface OrderRepository {
  /** Save a new order to the store. */
  save(order: Order): Promise<void>;

  /** Find an order by its ID. Returns null if not found. */
  findById(orderId: string): Promise<Order | null>;

  /** Return all orders. */
  findAll(): Promise<Order[]>;

  /** Generate the next sequential order ID (e.g. ORD-0001, ORD-0002). */
  nextId(): Promise<string>;
}
