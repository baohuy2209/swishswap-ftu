"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Offer } from "@/lib/generated/prisma/client";
import {
  acceptedForOffer,
  completedForOffer,
  declinedForOffer,
} from "@/actions/offer";
import { toast } from "sonner";
import { createOrderFromOffer, updateCancelledOrders } from "@/actions/order";
import { updateCompleteForListing } from "@/actions/listings";
import { createBillingForTypeBuySell } from "@/actions/billing";
export type OfferType = Omit<
  Offer,
  | "price_offered"
  | "pickup_time"
  | "created_at"
  | "updated_at"
  | "responded_at"
  | "sender_id"
  | "listing_id"
> & {
  listing_id: string | undefined;
  sender_id: string | undefined;
  price_offered: number | undefined;
  pickup_time: string;
  created_at: string;
  updated_at: string;
  responded_at: string;
};
export function formatDateTimeVN(date: string | Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
export function CurrentBuyOffer({ listOffers }: { listOffers: OfferType[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const data = listOffers;
  const columns: ColumnDef<OfferType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "listing_id",
      header: "Sản phẩm bán",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("listing_id")}</div>
      ),
    },
    {
      accessorKey: "sender_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Người đề nghị
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("sender_id")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Trạng thái</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">{row.getValue("status")}</div>
        );
      },
    },
    {
      accessorKey: "price_offered",
      header: () => <div className="text-center">Giá đề nghị</div>,
      cell: ({ row }) => {
        // Format the amount as a dollar amount.
        const amount = parseFloat(row.getValue("price_offered"));
        const formatted = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount);

        return <div className="text-left font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "pickup_location",
      header: () => <div className="text-center">Nơi giao dịch đề nghị</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">
            {row.getValue("pickup_location")}
          </div>
        );
      },
    },
    {
      accessorKey: "pickup_time",
      header: () => <div className="text-right">Thời gian giao dịch</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {formatDateTimeVN(row.getValue("pickup_time"))}
          </div>
        );
      },
    },
    {
      accessorKey: "note",
      header: () => <div className="text-center w-100">Ghi chú</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">
            {row.getValue("note") ? (
              <div>{row.getValue("note")}</div>
            ) : (
              <p>Không có</p>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Các hành động</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={async () => {
                    await updateCompleteForListing(row.original?.listing_id!);
                    await acceptedForOffer(row.original.id);
                    await createOrderFromOffer(row.original.id);
                    const res_billing = await createBillingForTypeBuySell(
                      row.original.id,
                    );
                    if (res_billing?.error) {
                      const formatted = new Intl.DateTimeFormat("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }).format(new Date());
                      toast(res_billing.error, { description: `${formatted}` });
                    }
                    toast("Đã chấp nhận yêu cầu mua hàng");
                  }}
                  disabled={row.original.status === "accepted" ? true : false}
                >
                  Chấp nhận
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await declinedForOffer(row.original.id);
                    // await updateCancelledOrders(row.original.id);
                    toast("Đã từ chối yêu cầu mua hàng");
                  }}
                >
                  Từ chối
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    if (row.original.status === "pending") {
                      await updateCompleteForListing(row.original?.listing_id!);
                      await acceptedForOffer(row.original.id);
                      await createOrderFromOffer(row.original.id);
                    }
                    await completedForOffer(row.original.id);
                    await updateCompleteForListing(row.original.id);
                    const res_billing = await createBillingForTypeBuySell(
                      row.original.id,
                    );
                    if (res_billing?.error) {
                      const formatted = new Intl.DateTimeFormat("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }).format(new Date());
                      toast(res_billing.error, { description: `${formatted}` });
                    }
                    toast("Hoàn thành giao dịch với người bán");
                  }}
                >
                  Hoàn thành giao dịch
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Lọc sản phẩm"
          value={
            (table.getColumn("listing_id")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("listing_id")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
