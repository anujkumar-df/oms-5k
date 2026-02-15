"""FileOrderRepository — JSON-file-backed implementation of OrderRepository."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import List, Optional

from src.order.domain.order import Order
from src.order.domain.order_repository import OrderRepository


class FileOrderRepository(OrderRepository):
    """Persist orders to a local JSON file so they survive restarts.

    Default storage location: ``~/.oms-5k/orders.json``
    """

    def __init__(self, storage_path: str | None = None) -> None:
        if storage_path is None:
            storage_dir = Path.home() / ".oms-5k"
        else:
            storage_dir = Path(storage_path).parent
        storage_dir.mkdir(parents=True, exist_ok=True)

        self._path = (
            Path(storage_path)
            if storage_path
            else storage_dir / "orders.json"
        )
        self._orders: List[Order] = self._load()

    # ------------------------------------------------------------------
    # OrderRepository interface
    # ------------------------------------------------------------------
    def next_id(self) -> str:
        """Return the next sequential ID like ORD-0001."""
        seq = len(self._orders) + 1
        return f"ORD-{seq:04d}"

    def save(self, order: Order) -> None:
        self._orders.append(order)
        self._flush()

    def find_by_id(self, order_id: str) -> Optional[Order]:
        for order in self._orders:
            if order.order_id == order_id:
                return order
        return None

    def find_all(self) -> List[Order]:
        return list(self._orders)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------
    def _load(self) -> List[Order]:
        if not self._path.exists():
            return []
        try:
            with open(self._path, "r", encoding="utf-8") as fh:
                data = json.load(fh)
            return [Order.from_dict(d) for d in data]
        except (json.JSONDecodeError, KeyError):
            return []

    def _flush(self) -> None:
        with open(self._path, "w", encoding="utf-8") as fh:
            json.dump(
                [o.to_dict() for o in self._orders],
                fh,
                indent=2,
            )
