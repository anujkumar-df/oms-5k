"""OrderRepository interface — abstraction for persisting Order aggregates.

The domain layer defines the interface; infrastructure provides implementations.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import List, Optional

from src.order.domain.order import Order


class OrderRepository(ABC):
    """Repository contract for the Order aggregate."""

    @abstractmethod
    def next_id(self) -> str:
        """Generate the next sequential order ID (e.g. ORD-0001)."""

    @abstractmethod
    def save(self, order: Order) -> None:
        """Persist an order (insert or update)."""

    @abstractmethod
    def find_by_id(self, order_id: str) -> Optional[Order]:
        """Return an order by its ID, or None if not found."""

    @abstractmethod
    def find_all(self) -> List[Order]:
        """Return all persisted orders."""
