"""CreateOrder use case — orchestrates order creation."""

from __future__ import annotations

from typing import List, Tuple

from src.order.domain.order import Order, OrderValidationError
from src.order.domain.order_line_item import OrderLineItem
from src.order.domain.order_repository import OrderRepository


class CreateOrder:
    """Application service that handles the 'create order' use case.

    Parses raw item strings, delegates validation to the Order aggregate,
    and persists the result via the repository.
    """

    def __init__(self, repository: OrderRepository) -> None:
        self._repository = repository

    def execute(
        self, customer_id: str | None, raw_items: List[str]
    ) -> dict:
        """Create an order and return a JSON-serialisable response dict."""
        try:
            if not customer_id:
                raise OrderValidationError("Customer ID is required")

            if not raw_items:
                raise OrderValidationError(
                    "At least one line item is required"
                )

            items = self._parse_items(raw_items)
            order_id = self._repository.next_id()
            order = Order.create(order_id, customer_id, items)
            self._repository.save(order)

            return {"status": "success", "order": order.to_dict()}

        except OrderValidationError as exc:
            return {"status": "error", "error": str(exc)}

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------
    @staticmethod
    def _parse_items(raw_items: List[str]) -> List[OrderLineItem]:
        """Parse raw 'productId,quantity,unitPrice' strings into value objects."""
        items: List[OrderLineItem] = []
        for raw in raw_items:
            parts = raw.split(",")
            if len(parts) != 3:
                raise OrderValidationError(
                    f"Invalid item format '{raw}': expected "
                    "'productId,quantity,unitPrice'"
                )
            product_id = parts[0].strip()
            try:
                quantity = int(parts[1].strip())
            except ValueError:
                raise OrderValidationError(
                    f"Invalid item format '{raw}': expected "
                    "'productId,quantity,unitPrice'"
                )
            try:
                unit_price = float(parts[2].strip())
            except ValueError:
                raise OrderValidationError(
                    f"Invalid item format '{raw}': expected "
                    "'productId,quantity,unitPrice'"
                )
            items.append(
                OrderLineItem(
                    product_id=product_id,
                    quantity=quantity,
                    unit_price=unit_price,
                )
            )
        return items
