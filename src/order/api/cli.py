"""CLI entry point for ordercli — argument parsing and command dispatch.

This module lives in the API layer; it contains no business logic itself.
All work is delegated to the application-layer use cases.
"""

from __future__ import annotations

import argparse
import json
import sys

from src.order.application.create_order import CreateOrder
from src.order.application.list_orders import ListOrders
from src.order.application.view_order import ViewOrder
from src.order.infrastructure.file_order_repository import FileOrderRepository


def _print_json(data: dict) -> None:
    """Pretty-print a dict as JSON to stdout."""
    print(json.dumps(data, indent=2))


def _handle_create(args: argparse.Namespace, repo: FileOrderRepository) -> None:
    use_case = CreateOrder(repo)
    result = use_case.execute(args.customer, args.item or [])
    _print_json(result)


def _handle_view(args: argparse.Namespace, repo: FileOrderRepository) -> None:
    use_case = ViewOrder(repo)
    result = use_case.execute(args.id)
    _print_json(result)


def _handle_list(_args: argparse.Namespace, repo: FileOrderRepository) -> None:
    use_case = ListOrders(repo)
    result = use_case.execute()
    _print_json(result)


def build_parser() -> argparse.ArgumentParser:
    """Build the argument parser with all sub-commands."""
    parser = argparse.ArgumentParser(
        prog="ordercli",
        description="Order Management System CLI",
    )
    subparsers = parser.add_subparsers(dest="command")

    # ---- create ----
    create_parser = subparsers.add_parser("create", help="Create a new order")
    create_parser.add_argument(
        "--customer",
        type=str,
        default=None,
        help="Customer ID",
    )
    create_parser.add_argument(
        "--item",
        type=str,
        action="append",
        help="Line item in format 'productId,quantity,unitPrice'",
    )

    # ---- view ----
    view_parser = subparsers.add_parser("view", help="View a single order")
    view_parser.add_argument(
        "--id",
        type=str,
        required=True,
        help="Order ID to view",
    )

    # ---- list ----
    subparsers.add_parser("list", help="List all orders")

    return parser


def main(argv: list[str] | None = None) -> None:
    """Entry point called by the ``ordercli`` console script."""
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.command is None:
        parser.print_help()
        sys.exit(1)

    repo = FileOrderRepository()

    handlers = {
        "create": _handle_create,
        "view": _handle_view,
        "list": _handle_list,
    }

    handlers[args.command](args, repo)


if __name__ == "__main__":
    main()
