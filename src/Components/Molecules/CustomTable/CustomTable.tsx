// CustomTable.tsx
import { Key, ReactNode, useState } from 'react';
import { SortDirections, TableColumn } from './helpers/interface';
import { Invoice } from '../InvoiceList/helpers/interface';

interface CustomTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  noDataText?: string;
  handleSort?: (sortkey: keyof Invoice, sortDirection: SortDirections) => void;
}

export default function CustomTable<T>({
  columns,
  data,
  rowKey,
  handleSort,
  noDataText = 'No records found.',
}: CustomTableProps<T>) {
  const [sortDirection, setSortDirection] = useState<SortDirections>(
    SortDirections.ASC
  );

  const handleSortChange = (sortKey: keyof Invoice) => {
    handleSort?.(
      sortKey,
      sortDirection === SortDirections.ASC
        ? SortDirections.DESC
        : SortDirections.ASC
    );
    setSortDirection((prev) =>
      prev === SortDirections.ASC ? SortDirections.DESC : SortDirections.ASC
    );
  };

  function isRenderable(value: unknown): value is ReactNode {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null ||
      value === undefined
    );
  }

  function renderCellValue<R>(
    row: R,
    col: {
      accessor: keyof R | ((row: R) => ReactNode);
      render?: (row: R) => ReactNode;
    }
  ): ReactNode {
    if (col.render) {
      return col.render(row);
    }

    if (typeof col.accessor === 'function') {
      return col.accessor(row);
    }

    const value = row[col.accessor];

    return isRenderable(value) ? value : '-';
  }

  return (
    <div className="invoice-list__table-container">
      <table className="invoice-list__table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col?.header)}
                className={`${col.className} ${col?.sortable ? 'pointer' : ''}`}
                style={{ userSelect: 'none' }}
                onClick={() =>
                  col?.sortable
                    ? handleSortChange(col?.sortKey as keyof Invoice)
                    : undefined
                }
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((col) => (
                  <td key={col?.accessor as Key} className={col.className}>
                    {renderCellValue(row, col)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                <div className="no-text-outer">
                  <h5 className="no-text">{noDataText}</h5>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
