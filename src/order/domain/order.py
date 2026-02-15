"""Order aggregate root — enforces all order invariants."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import List

from src.order.domain.order_line_item import OrderLineItem


class OrderValidationError(Exception):
    """Raised when an order invariant is violated."""


@dataclass
class Order:
    """Aggregate root for the Order Management bounded context.

    All mutations go through this class, which enforces invariants such as
    non-empty items, positive quantities, non-negative prices, and unique
    product IDs.
    """

    order_id: str
    customer_id: str
    status: str
    items: List[OrderLineItem]
    created_at: datetime
    _total: float = field(init=False, repr=False)

    def __post_init__(self) -> None:
        self._total = round(sum(item.subtotal for item in self.items), 2)

    @property
    def total(self) -> float:
        return self._total

    # ------------------------------------------------------------------
    # Factory — validates invariants before construction
    # ------------------------------------------------------------------
    @staticmethod
    def create(
        order_id: str,
        customer_id: str,
        items: List[OrderLineItem],
    ) -> Order:
        """Create a new DRAFT order, enforcing all business rules."""
        if not customer_id:
            raise OrderValidationError("Customer ID is required")

        if not items:
            raise OrderValidationError("At least one line item is required")

        seen_product_ids: set[str] = set()
        for item in items:
            if item.quantity <= 0:
                raise OrderValidationError(
                    f"Invalid quantity for {item.product_id}: must be greater than 0"
                )
            if item.unit_price < 0:
                raise OrderValidationError(
                    f"Invalid unit price for {item.product_id}: must be >= 0"
                )
            if item.product_id in seen_product_ids:
                raise OrderValidationError(
                    f"Duplicate product ID: {item.product_id}"
                )
            seen_product_ids.add(item.product_id)

        return Order(
            order_id=order_id,
            customer_id=customer_id,
            status="DRAFT",
            items=items,
            created_at=datetime.now(timezone.utc),
        )

    # ------------------------------------------------------------------
    # Serialisation helpers (no framework dependency)
    # ------------------------------------------------------------------
    def to_dict(self) -> dict:
        return {
            "orderId": self.order_id,
            "customerId": self.customer_id,
            "status": self.status,
            "items": [item.to_dict() for item in self.items],
            "total": self.total,
            "createdAt": self.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
        }

    def to_summary_dict(self) -> dict:
        """Compact representation used by the list endpoint."""
        return {
            "orderId": self.order_id,
            "customerId": self.customer_id,
            "status": self.status,
            "total": self.total,
            "createdAt": self.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
        }

    @staticmethod
    def from_dict(data: dict) -> Order:
        items = [OrderLineItem.from_dict(i) for i in data["items"]]
        return Order(
            order_id=data["orderId"],
            customer_id=data["customerId"],
            status=data["status"],
            items=items,
            created_at=datetime.fromisoformat(
                data["createdAt"].replace("Z", "+00:00")
            ),
        )
