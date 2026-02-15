"""ListOrders use case — retrieve all orders."""

from __future__ import annotations

from src.order.domain.order_repository import OrderRepository


class ListOrders:
    """Application service that handles the 'list orders' use case."""

    def __init__(self, repository: OrderRepository) -> None:
        self._repository = repository

    def execute(self) -> dict:
        """Return all orders as a JSON-serialisable response dict."""
        orders = self._repository.find_all()
        return {
            "status": "success",
            "orders": [o.to_summary_dict() for o in orders],
            "count": len(orders),
        }
