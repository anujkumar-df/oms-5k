/**
 * OrderLineItem — Value Object
 *
 * Represents a single line item within an order.
 * Immutable once created. Defined by its attributes, not by identity.
 */
export interface OrderLineItemProps {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export class OrderLineItem {
  readonly productId: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly subtotal: number;

  private constructor(props: OrderLineItemProps) {
    this.productId = props.productId;
    this.quantity = props.quantity;
    this.unitPrice = props.unitPrice;
    this.subtotal = Math.round(props.quantity * props.unitPrice * 100) / 100;
  }

  /**
   * Factory method that validates and creates an OrderLineItem.
   * Throws a domain error string if validation fails.
   */
  static create(props: OrderLineItemProps): OrderLineItem {
    if (props.quantity <= 0) {
      throw new Error(
        `Invalid quantity for ${props.productId}: must be greater than 0`
      );
    }
    if (props.unitPrice < 0) {
      throw new Error(
        `Invalid unit price for ${props.productId}: must be >= 0`
      );
    }
    return new OrderLineItem(props);
  }

  /**
   * Reconstruct from persisted data (no validation).
   */
  static fromData(props: OrderLineItemProps & { subtotal: number }): OrderLineItem {
    const item = new OrderLineItem(props);
    return item;
  }

  toJSON(): Record<string, unknown> {
    return {
      productId: this.productId,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      subtotal: this.subtotal,
    };
  }
}
