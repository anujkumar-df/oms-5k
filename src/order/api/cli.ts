#!/usr/bin/env node

/**
 * ordercli — CLI entry point for the Order Management bounded context.
 *
 * Commands:
 *   create --customer <id> --item "productId,quantity,unitPrice" [--item ...]
 *   view   --id <orderId>
 *   list
 *
 * All output is JSON with a "status" field ("success" or "error").
 */

import { Command } from "commander";
import { join } from "node:path";
import { homedir } from "node:os";

import { FileOrderRepository } from "../infrastructure/FileOrderRepository.js";
import { CreateOrder } from "../application/CreateOrder.js";
import { ViewOrder } from "../application/ViewOrder.js";
import { ListOrders } from "../application/ListOrders.js";
import { OrderLineItemProps } from "../domain/OrderLineItem.js";

// Store data in ~/.oms-5k/orders.json so it persists across restarts
const DATA_DIR = process.env.OMS_DATA_DIR || join(homedir(), ".oms-5k");
const STORE_PATH = join(DATA_DIR, "orders.json");

const repository = new FileOrderRepository(STORE_PATH);

function outputSuccess(data: Record<string, unknown>): void {
  console.log(JSON.stringify({ status: "success", ...data }, null, 2));
}

function outputError(message: string): void {
  console.log(JSON.stringify({ status: "error", error: message }));
}

/**
 * Parse a raw --item flag value into OrderLineItemProps.
 * Expected format: "productId,quantity,unitPrice"
 */
function parseItem(raw: string): OrderLineItemProps {
  const parts = raw.split(",");
  if (parts.length !== 3) {
    throw new Error(
      `Invalid item format '${raw}': expected 'productId,quantity,unitPrice'`
    );
  }

  const [productId, quantityStr, unitPriceStr] = parts;
  const quantity = Number(quantityStr);
  const unitPrice = Number(unitPriceStr);

  if (isNaN(quantity)) {
    throw new Error(
      `Invalid item format '${raw}': expected 'productId,quantity,unitPrice'`
    );
  }
  if (isNaN(unitPrice)) {
    throw new Error(
      `Invalid item format '${raw}': expected 'productId,quantity,unitPrice'`
    );
  }

  return { productId: productId.trim(), quantity, unitPrice };
}

const program = new Command();
program.name("ordercli").description("Order Management CLI").version("0.1.0");

// Override Commander's default error handling to output JSON
program.configureOutput({
  writeErr: () => {},
  writeOut: () => {},
});

// --- create command ---
const createCmd = new Command("create");
createCmd
  .description("Create a new order")
  .option("--customer <id>", "Customer ID")
  .option("--item <value...>", "Line item in format: productId,quantity,unitPrice")
  .action(async (opts: { customer?: string; item?: string[] }) => {
    try {
      const customerId = opts.customer;

      if (!customerId || customerId.trim() === "") {
        outputError("Customer ID is required");
        return;
      }

      if (!opts.item || opts.item.length === 0) {
        outputError("At least one line item is required");
        return;
      }

      // Parse items — validation errors from parseItem or domain will propagate
      const items = opts.item.map((raw) => parseItem(raw));

      const createOrder = new CreateOrder(repository);
      const order = await createOrder.execute({ customerId, items });

      outputSuccess({ order: order.toJSON() });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      outputError(message);
    }
  });
program.addCommand(createCmd);

// --- view command ---
const viewCmd = new Command("view");
viewCmd
  .description("View a single order by ID")
  .option("--id <orderId>", "Order ID")
  .action(async (opts: { id?: string }) => {
    try {
      if (!opts.id || opts.id.trim() === "") {
        outputError("Order ID is required");
        return;
      }
      const viewOrder = new ViewOrder(repository);
      const order = await viewOrder.execute(opts.id);
      outputSuccess({ order: order.toJSON() });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      outputError(message);
    }
  });
program.addCommand(viewCmd);

// --- list command ---
program
  .command("list")
  .description("List all orders")
  .action(async () => {
    try {
      const listOrders = new ListOrders(repository);
      const orders = await listOrders.execute();
      outputSuccess({
        orders: orders.map((o) => o.toSummaryJSON()),
        count: orders.length,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      outputError(message);
    }
  });

program.parse(process.argv);
