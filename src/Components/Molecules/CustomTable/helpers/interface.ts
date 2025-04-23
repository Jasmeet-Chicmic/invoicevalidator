// types.ts
export interface TableColumn<T> {
  header: React.ReactNode;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  sortKey?: keyof T; // Optional override if accessor is not a string
}

export enum SortDirections {
  DESC = 1,
  ASC = -1,
  NONE = 0,
}
