"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { RiSearchLine } from "react-icons/ri";
import BaseDropdown from "./BaseDropdown";
import { DataTableRowClickEvent } from "primereact/datatable";
import BaseInput from "./BaseInput";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { getTranslationSync } from "@/i18n/i18n";

export interface ColumnConfig<T> {
  field: keyof T | string;
  header: string;
  sortable?: boolean;
  body?: (rowData: T) => React.ReactNode;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  className?: string;
  headerClassName?: string;
}

interface BaseTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  className?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T | string)[];
  emptyMessage?: string;
  loading?: boolean;
  tableClassName?: string;
  paginatorClassName?: string;
  globalFilterFields?: (keyof T | string)[];
  onRowClick?: (rowData: T) => void;
  rowClassName?: (rowData: T) => string;
  serverSide?: boolean;
  totalRecords?: number;
  onPageChange?: (first: number, rows: number) => void;
  onSearchChange?: (searchText: string) => void;
  onSortChange?: (field: string, order: 1 | -1 | 0) => void;
  currentPage?: number;
  externalSearchValue?: string;
}

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

const BaseTable = <T extends Record<string, unknown>>({
  data,
  columns,
  className = "",
  rowsPerPageOptions = [10, 25, 50, 100],
  defaultRowsPerPage = 10,
  searchable = true,
  searchPlaceholder = t("baseTableConstants.search"),
  searchFields,
  emptyMessage = t("baseTableConstants.noRecordsFound"),
  loading = false,
  tableClassName = "",
  paginatorClassName = "",
  globalFilterFields,
  onRowClick,
  rowClassName,
  serverSide = false,
  totalRecords,
  onPageChange,
  onSearchChange,
  onSortChange,
  currentPage,
  externalSearchValue,
}: BaseTableProps<T>) => {
  const [searchValue, setSearchValue] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(defaultRowsPerPage);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<1 | -1 | 0>(0);

  useEffect(() => {
    if (serverSide && typeof externalSearchValue === "string") {
      setSearchValue(externalSearchValue);
    }
  }, [serverSide, externalSearchValue]);

  useEffect(() => {
    if (serverSide && currentPage && currentPage > 0) {
      setFirst((currentPage - 1) * rows);
    }
  }, [serverSide, currentPage, rows]);

  const fieldsToSearch = useMemo(() => {
    if (searchFields) return searchFields as string[];
    if (globalFilterFields) return globalFilterFields as string[];
    return columns?.map((col) => col.field as string);
  }, [searchFields, globalFilterFields, columns]);

  const getNestedValue = useCallback((obj: T, path: string): unknown => {
    return path.split(".").reduce((current: unknown, key: string) => {
      if (current && typeof current === "object" && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  }, []);

  const filteredData = useMemo(() => {
    if (serverSide) return data;

    if (!searchValue.trim()) return data;

    return data.filter((item) => {
      return fieldsToSearch.some((field) => {
        const value = getNestedValue(item, field as string);
        return value
          ?.toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
    });
  }, [data, searchValue, fieldsToSearch, getNestedValue, serverSide]);

  const sortedData = useMemo(() => {
    if (serverSide) return filteredData;

    if (!sortField || sortOrder === 0) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, sortField);
      const bValue = getNestedValue(b, sortField);

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const compareResult = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 1 ? compareResult : -compareResult;
    });
  }, [filteredData, sortField, sortOrder, getNestedValue, serverSide]);

  const paginatedData = useMemo(() => {
    if (serverSide) return data;
    return sortedData.slice(first, first + rows);
  }, [sortedData, first, rows, data, serverSide]);

  const handleSort = (field: string) => {
    let nextOrder: 1 | -1 | 0 = sortOrder;

    if (sortField === field) {
      if (sortOrder === 1) {
        nextOrder = -1;
      } else if (sortOrder === -1) {
        nextOrder = 0;
      } else {
        nextOrder = 1;
      }
    } else {
      nextOrder = 1;
    }

    setSortField(nextOrder === 0 ? null : field);
    setSortOrder(nextOrder);

    if (serverSide && onSortChange) {
      onSortChange(field, nextOrder);
    }
  };

  const handlePageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setRows(event.rows);

    if (serverSide && onPageChange) {
      onPageChange(event.first, event.rows);
    }
  };

  useEffect(() => {
    if (!serverSide || !onSearchChange) return;

    const handler = setTimeout(() => {
      onSearchChange(searchValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchValue, serverSide, onSearchChange]);

  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <FaSort className="text-coolGray ml-2" />;
    }
    if (sortOrder === 1) {
      return <FaSortUp className="text-obsidianBlack ml-2" />;
    }
    if (sortOrder === -1) {
      return <FaSortDown className="text-obsidianBlack ml-2" />;
    }
    return <FaSort className="text-coolGray ml-2" />;
  };

  const headerTemplate = (column: ColumnConfig<T>) => (
    <div
      className={`flex items-center ${
        column.sortable !== false ? "cursor-pointer select-none" : ""
      }`}
      onClick={() =>
        column.sortable !== false && handleSort(column.field as string)
      }
    >
      <span className="font-semibold text-obsidianBlack">{column.header}</span>
      {column.sortable !== false && renderSortIcon(column.field as string)}
    </div>
  );

  const handleRowClick = (event: DataTableRowClickEvent) => {
    if (onRowClick) {
      onRowClick(event.data as T);
    }
  };

  const hasData = sortedData.length > 0;
  const start = hasData ? first + 1 : 0;
  const end = Math.min(first + rows, sortedData.length);
  const total = serverSide ? totalRecords ?? data.length : sortedData.length;

  return (
    <div className={`${className} w-full bg-lightGray`}>
      {searchable && (
        <div className="mb-4 flex flex-col md:flex-row md:justify-between gap-4 p-4">
          <div className="relative w-full md:w-auto md:flex-2">
            <BaseInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchPlaceholder}
              icon={<RiSearchLine />}
              className="pl-10 py-2 border border-lightGrayGamma rounded-[8px] text-textBase font-light focus:ring-0 focus:outline-none focus:border-lightGrayGamma w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-textSm text-obsidianBlack font-light">
              {t("baseTableConstants.showing")}
            </span>
            <BaseDropdown
              value={rows.toString()}
              options={rowsPerPageOptions?.map((option) => ({
                label: option.toString(),
                value: option.toString(),
              }))}
              onChange={(value: string) => {
                setRows(Number(value));
                setFirst(0);
                if (serverSide && onPageChange) {
                  onPageChange(0, Number(value));
                }
              }}
              className="w-[80px] border border-lightGrayGamma rounded-[8px] py-1 px-2 text-textBase font-light"
            />
            <span className="text-textSm text-obsidianBlack font-light">
              {t("baseTableConstants.entries")}
            </span>
          </div>
        </div>
      )}

      <div className={`overflow-x-auto ${tableClassName}`}>
        <DataTable
          value={paginatedData}
          loading={loading}
          emptyMessage={emptyMessage}
          onRowClick={onRowClick ? handleRowClick : undefined}
          rowClassName={rowClassName}
          className="border border-lightGrayGamma rounded-[8px]"
          pt={{
            wrapper: {
              className: "rounded-[8px] overflow-hidden",
            },
            thead: {
              className: "bg-offWhite",
            },
            headerRow: {
              className: "border-b border-lightGrayGamma",
            },
            column: {
              headerCell: {
                className: "px-4 py-3 text-left",
              },
              bodyCell: {
                className:
                  "px-4 py-3 text-textMd font-light text-obsidianBlack xl:leading-[100%]",
              },
            },
            tbody: {
              className: "bg-white",
            },
            bodyRow: {
              className:
                "border-b border-lightGrayGamma last:border-b-0 hover:bg-offWhite transition-colors",
            },
          }}
        >
          {columns?.map((col) => (
            <Column
              key={col.field as string}
              field={col.field as string}
              header={headerTemplate(col)}
              body={col.body}
              style={col.style}
              headerStyle={col.headerStyle}
              className={col.className}
              headerClassName={col.headerClassName}
              sortable={false}
            />
          ))}
        </DataTable>
      </div>

      {(serverSide ? totalRecords ?? data.length : sortedData.length) > 0 && (
        <div className={`mt-4 ${paginatorClassName}`}>
          <Paginator
            first={first}
            rows={rows}
            totalRecords={
              serverSide ? totalRecords ?? data.length : sortedData.length
            }
            onPageChange={handlePageChange}
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            className="border border-lightGrayGamma rounded-[8px] p-3"
            pt={{
              root: {
                className: "bg-white",
              },
              pageButton: (options: { context: { active: boolean } }) => ({
                className: `min-w-[2rem] h-8 mx-1 rounded-[4px] ${
                  options.context.active
                    ? "bg-obsidianBlack text-white"
                    : "text-obsidianBlack hover:bg-offWhite"
                }`,
              }),
              firstPageButton: {
                className:
                  "min-w-[2rem] h-8 mx-1 rounded-[4px] text-obsidianBlack hover:bg-offWhite disabled:opacity-50",
              },
              prevPageButton: {
                className:
                  "min-w-[2rem] h-8 mx-1 rounded-[4px] text-obsidianBlack hover:bg-offWhite disabled:opacity-50",
              },
              nextPageButton: {
                className:
                  "min-w-[2rem] h-8 mx-1 rounded-[4px] text-obsidianBlack hover:bg-offWhite disabled:opacity-50",
              },
              lastPageButton: {
                className:
                  "min-w-[2rem] h-8 mx-1 rounded-[4px] text-obsidianBlack hover:bg-offWhite disabled:opacity-50",
              },
            }}
          />
        </div>
      )}

      <div className="mt-2 text-textSm text-coolGray font-light">
        {t("baseTableConstants.showing")} {start} to {end}{" "}
        {t("baseTableConstants.of")} {total}{" "}
        {t("baseTableConstants.entries")}
        {!serverSide && searchValue && (
          <>
            {" "}
            {t("baseTableConstants.filteredFrom")} {data.length}{" "}
            {t("baseTableConstants.totalEntries")}
          </>
        )}
      </div>
    </div>
  );
};

export default BaseTable;
