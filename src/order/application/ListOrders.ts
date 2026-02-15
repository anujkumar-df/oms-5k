import { Order } from "../domain/Order.js";
import { OrderRepository } from "../domain/OrderRepository.js";

/**
 * ListOrders — Application Service (Use Case)
 *
 * Retrieves all orders from the store.
 */

export class ListOrders {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
}
