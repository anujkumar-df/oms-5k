"""OrderLineItem value object — immutable, defined by its attributes."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class OrderLineItem:
    """A single line item within an order.

    Value object: equality is based on attributes, and instances are immutable.
    """

    product_id: str
    quantity: int
    unit_price: float

    @property
    def subtotal(self) -> float:
        return round(self.quantity * self.unit_price, 2)

    def to_dict(self) -> dict:
        return {
            "productId": self.product_id,
            "quantity": self.quantity,
            "unitPrice": self.unit_price,
            "subtotal": self.subtotal,
        }

    @staticmethod
    def from_dict(data: dict) -> OrderLineItem:
        return OrderLineItem(
            product_id=data["productId"],
            quantity=data["quantity"],
            unit_price=data["unitPrice"],
        )
