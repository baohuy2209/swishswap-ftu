"use client";
import { SwapType } from "@/components/sell/current-swap-offer";
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
import { formatDateVN } from "@/lib/utils";

function MainSwapTransaction({ safeListSwaps }: { safeListSwaps: SwapType[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const data = safeListSwaps;
  const columns: ColumnDef<SwapType>[] = [
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
    // {
    //   accessorKey: "category_id",
    //   header: "Loại sản phẩm",
    //   cell: ({ row }) => (
    //     <div className="capitalize">{row.getValue("category_id")}</div>
    //   ),
    // },
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
      accessorKey: "product_name",
      header: () => <div className="text-center">Tên sản phẩm</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">
            {row.getValue("product_name")}
          </div>
        );
      },
    },
    {
      accessorKey: "product_price",
      header: () => <div className="text-center">Giá</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">
            {row.getValue("product_price")}
          </div>
        );
      },
    },
    {
      accessorKey: "product_status",
      header: () => <div className="text-center">Trạng thái sản phẩm</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.getValue("product_status")}
          </div>
        );
      },
    },
    {
      accessorKey: "pickup_location",
      header: () => <div className="text-center">Địa điểm trao đổi</div>,
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
      header: () => <div className="text-center">Thời gian giao dịch</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">
            {formatDateVN(row.getValue("pickup_time"))}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Trạng thái đề nghị</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">{row.getValue("status")}</div>
        );
      },
    },
    {
      accessorKey: "Note",
      header: () => <div className="text-center w-100">Chi tiết trao đổi</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left max-w-[600px]">
            <p className="font-normal whitespace-pre-line wrap-break-word">
              {row.getValue("Note")}
            </p>
          </div>
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

export default MainSwapTransaction;
