"""ViewOrder use case — retrieve a single order by ID."""

from __future__ import annotations

from src.order.domain.order_repository import OrderRepository


class ViewOrder:
    """Application service that handles the 'view order' use case."""

    def __init__(self, repository: OrderRepository) -> None:
        self._repository = repository

    def execute(self, order_id: str) -> dict:
        """Look up an order and return a JSON-serialisable response dict."""
        order = self._repository.find_by_id(order_id)
        if order is None:
            return {
                "status": "error",
                "error": f"Order not found: {order_id}",
            }
        return {"status": "success", "order": order.to_dict()}
