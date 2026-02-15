import { OrderLineItem, OrderLineItemProps } from "./OrderLineItem.js";

/**
 * Order — Aggregate Root (Entity)
 *
 * The central aggregate for the Order Management bounded context.
 * All mutations go through this aggregate root.
 * Enforces business invariants on creation and state transitions.
 */

export type OrderStatus = "DRAFT";

export interface OrderProps {
  orderId: string;
  customerId: string;
  status: OrderStatus;
  items: OrderLineItem[];
  total: number;
  createdAt: string;
}

export interface CreateOrderInput {
  orderId: string;
  customerId: string;
  items: OrderLineItemProps[];
  createdAt: string;
}

export class Order {
  readonly orderId: string;
  readonly customerId: string;
  readonly status: OrderStatus;
  readonly items: OrderLineItem[];
  readonly total: number;
  readonly createdAt: string;

  private constructor(props: OrderProps) {
    this.orderId = props.orderId;
    this.customerId = props.customerId;
    this.status = props.status;
    this.items = props.items;
    this.total = props.total;
    this.createdAt = props.createdAt;
  }

  /**
   * Factory method to create a new Order aggregate.
   * Enforces all business invariants:
   * - Customer ID is required
   * - At least one line item is required
   * - No duplicate product IDs
   * - Individual line item validation delegated to OrderLineItem
   */
  static create(input: CreateOrderInput): Order {
    // Validate customer ID
    if (!input.customerId || input.customerId.trim() === "") {
      throw new Error("Customer ID is required");
    }

    // Validate at least one item
    if (!input.items || input.items.length === 0) {
      throw new Error("At least one line item is required");
    }

    // Check for duplicate product IDs
    const seenProductIds = new Set<string>();
    for (const itemProps of input.items) {
      if (seenProductIds.has(itemProps.productId)) {
        throw new Error(`Duplicate product ID: ${itemProps.productId}`);
      }
      seenProductIds.add(itemProps.productId);
    }

    // Create line items (each validates itself)
    const items = input.items.map((props) => OrderLineItem.create(props));

    // Calculate total
    const total =
      Math.round(items.reduce((sum, item) => sum + item.subtotal, 0) * 100) /
      100;

    return new Order({
      orderId: input.orderId,
      customerId: input.customerId,
      status: "DRAFT",
      items,
      total,
      createdAt: input.createdAt,
    });
  }

  /**
   * Reconstruct an Order from persisted data (no validation).
   */
  static fromData(props: OrderProps): Order {
    return new Order(props);
  }

  toJSON(): Record<string, unknown> {
    return {
      orderId: this.orderId,
      customerId: this.customerId,
      status: this.status,
      items: this.items.map((item) => item.toJSON()),
      total: this.total,
      createdAt: this.createdAt,
    };
  }

  /**
   * Return a summary representation for list views.
   */
  toSummaryJSON(): Record<string, unknown> {
    return {
      orderId: this.orderId,
      customerId: this.customerId,
      status: this.status,
      total: this.total,
      createdAt: this.createdAt,
    };
  }
}
