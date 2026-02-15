import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { Order, OrderProps } from "../domain/Order.js";
import { OrderLineItem } from "../domain/OrderLineItem.js";
import { OrderRepository } from "../domain/OrderRepository.js";

/**
 * FileOrderRepository — Infrastructure Implementation
 *
 * Persists Order aggregates to a local JSON file.
 * Implements the OrderRepository interface defined in the domain layer.
 */

interface StoredOrder {
  orderId: string;
  customerId: string;
  status: "DRAFT";
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  total: number;
  createdAt: string;
}

interface StoreData {
  orders: StoredOrder[];
  nextSequence: number;
}

export class FileOrderRepository implements OrderRepository {
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async save(order: Order): Promise<void> {
    const data = this.readStore();
    data.orders.push(order.toJSON() as unknown as StoredOrder);
    this.writeStore(data);
  }

  async findById(orderId: string): Promise<Order | null> {
    const data = this.readStore();
    const stored = data.orders.find((o) => o.orderId === orderId);
    if (!stored) return null;
    return this.toDomain(stored);
  }

  async findAll(): Promise<Order[]> {
    const data = this.readStore();
    return data.orders.map((stored) => this.toDomain(stored));
  }

  async nextId(): Promise<string> {
    const data = this.readStore();
    const seq = data.nextSequence;
    data.nextSequence = seq + 1;
    this.writeStore(data);
    return `ORD-${String(seq).padStart(4, "0")}`;
  }

  private toDomain(stored: StoredOrder): Order {
    const items = stored.items.map((i) =>
      OrderLineItem.fromData({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        subtotal: i.subtotal,
      })
    );

    const props: OrderProps = {
      orderId: stored.orderId,
      customerId: stored.customerId,
      status: stored.status,
      items,
      total: stored.total,
      createdAt: stored.createdAt,
    };

    return Order.fromData(props);
  }

  private readStore(): StoreData {
    if (!existsSync(this.filePath)) {
      return { orders: [], nextSequence: 1 };
    }
    try {
      const raw = readFileSync(this.filePath, "utf-8");
      return JSON.parse(raw) as StoreData;
    } catch {
      return { orders: [], nextSequence: 1 };
    }
  }

  private writeStore(data: StoreData): void {
    const dir = dirname(this.filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }
}
