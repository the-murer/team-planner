import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

type PaginationProps = {
  page: number;
  pages: number;
  setPage: (page: number) => void;
};

type TableComponentProps = {
  rows: Array<any>;
  columns: Array<any>;
  pagination?: PaginationProps;
  onClickEvent?: (e: any) => void;
  onDoubleClickEvent?: (e: any) => void;
};

const paginatedComponent = ({ page, pages, setPage }: PaginationProps) => (
  <div className="flex w-full justify-center">
    <Pagination
      isCompact
      showControls
      showShadow
      color="secondary"
      page={page}
      total={pages}
      onChange={(page) => setPage(page)}
    />
  </div>
);

export default function TableComponent({
  columns,
  rows,
  pagination,
  onClickEvent = () => null,
  onDoubleClickEvent = () => null,
}: TableComponentProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Table
        fullWidth
        isStriped
        aria-label="Example table with dynamic content"
        bottomContent={pagination ? paginatedComponent(pagination) : null}
        classNames={{
          wrapper: "max-h-[522px]",
          table: "max-h-[522px]",
          tr: "h-[50px]",
        }}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.key}
              onClick={() => onClickEvent(row)}
              onDoubleClick={() => onDoubleClickEvent(row)}
            >
              {(columnKey) => <TableCell>{row[columnKey]}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
