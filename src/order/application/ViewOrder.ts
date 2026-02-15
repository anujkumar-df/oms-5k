import { Order } from "../domain/Order.js";
import { OrderRepository } from "../domain/OrderRepository.js";

/**
 * ViewOrder — Application Service (Use Case)
 *
 * Retrieves a single order by ID.
 */

export class ViewOrder {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }
    return order;
  }
}
