import { Order } from "../domain/Order.js";
import { OrderLineItemProps } from "../domain/OrderLineItem.js";
import { OrderRepository } from "../domain/OrderRepository.js";

/**
 * CreateOrder — Application Service (Use Case)
 *
 * Orchestrates the creation of a new order.
 * Coordinates between the domain (Order aggregate) and infrastructure (repository).
 * Contains no business logic itself — that lives in the Order aggregate.
 */

export interface CreateOrderCommand {
  customerId: string;
  items: OrderLineItemProps[];
}

export class CreateOrder {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(command: CreateOrderCommand): Promise<Order> {
    const orderId = await this.orderRepository.nextId();
    const createdAt = new Date().toISOString();

    const order = Order.create({
      orderId,
      customerId: command.customerId,
      items: command.items,
      createdAt,
    });

    await this.orderRepository.save(order);
    return order;
  }
}
