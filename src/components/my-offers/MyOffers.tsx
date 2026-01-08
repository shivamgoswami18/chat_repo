"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import BaseTable, { ColumnConfig } from "../base/BaseTable";
import BaseTabs from "../base/BaseTab";
import { BaseSkeletonTable } from "../base/BaseSkeleton";
import { fetchOffers } from "@/lib/store/slices/myOffersSlice";
import { getTranslationSync } from "@/i18n/i18n";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { OfferData } from "@/types/offers";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

const MyOffers = () => {
  const dispatch = useAppDispatch();
  const { offers, loading, totalCount, currentPage } = useAppSelector(
    (state) => state.offers
  );

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("_id");
  const [sortValue, setSortValue] = useState<"asc" | "desc">("desc");

  const tabConfigs = useMemo(
    () => [
      { label: t("myOffersConstants.all"), value: "all" },
      { label: t("myOffersConstants.accepted"), value: "accepted" },
      { label: t("myOffersConstants.pending"), value: "pending" },
      { label: t("myOffersConstants.rejected"), value: "rejected" },
    ],
    []
  );

  const tabs = useMemo(() => tabConfigs?.map((tab) => tab.label), [tabConfigs]);

  const fetchData = useCallback(() => {
    const currentTab = tabConfigs[activeTabIndex]?.value ?? "all";
    const status = currentTab === "all" ? undefined : currentTab;

    dispatch(
      fetchOffers({
        sortKey,
        sortValue,
        page,
        limit,
        search,
        status,
      })
    );
  }, [
    dispatch,
    activeTabIndex,
    page,
    limit,
    search,
    sortKey,
    sortValue,
    tabConfigs,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    setPage(1);
  };

  const handlePageChange = (first: number, rows: number) => {
    setPage(Math.floor(first / rows) + 1);
    setLimit(rows);
  };

  const handleSearchChange = (searchText: string) => {
    setSearch(searchText);
    setPage(1);
  };

  const handleSortChange = (field: string, order: 1 | -1 | 0) => {
    const fieldMap: Record<string, string> = {
      projectName: "project_title",
      customer: "customer_name",
      offerPrice: "amount",
      status: "status",
      date: "createdAt",
    };

    const apiField = fieldMap[field] || field;

    if (order === 0) {
      setSortKey("_id");
      setSortValue("desc");
    } else {
      setSortKey(apiField);
      setSortValue(order === 1 ? "asc" : "desc");
    }
    setPage(1);
  };

  const getStatusBadge = (status: OfferData["status"]) => {
    const statusColors: Record<OfferData["status"], string> = {
      pending: "bg-yellowPrimary bg-opacity-10 text-yellowPrimary",
      accepted: "bg-deepTeal bg-opacity-10 text-deepTeal",
      rejected: "bg-redPrimary bg-opacity-10 text-redPrimary",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-textBase font-textBase ${statusColors[status]}`}
      >
        {status}
      </span>
    );
  };

  const columns: ColumnConfig<OfferData>[] = [
    {
      field: "projectName",
      header: t("myOffersConstants.projectName"),
      sortable: true,
    },
    {
      field: "customer",
      header: t("myOffersConstants.customer"),
      sortable: true,
    },
    {
      field: "offerPrice",
      header: t("myOffersConstants.offerPrice"),
      sortable: true,
    },
    {
      field: "status",
      header: t("myOffersConstants.status"),
      sortable: true,
      body: (rowData) => getStatusBadge(rowData.status),
    },
    {
      field: "date",
      header: t("myOffersConstants.date"),
      sortable: true,
    },
  ];

  return (
    <div>
      <BaseTabs
        tabs={tabs}
        activeIndex={activeTabIndex}
        onChange={handleTabChange}
        className="rounded p-4 bg-lightGray pb-0 border-0 border-b border-solid border-graySoft border-opacity-50"
      />
      <div className="relative mt-4">
        {loading && (
          <div className="absolute inset-0 z-10">
            <BaseSkeletonTable
              rows={10}
              columns={6}
              showHeader={true}
              className="h-full"
            />
          </div>
        )}

        <div className={loading ? "opacity-0" : "opacity-100"}>
          <BaseTable
            data={offers}
            columns={columns}
            searchable={true}
            searchPlaceholder={t("myOffersConstants.searchOffers")}
            defaultRowsPerPage={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            emptyMessage={t("myOffersConstants.noOffersFound")}
            serverSide={true}
            totalRecords={totalCount}
            onPageChange={handlePageChange}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            currentPage={currentPage}
            externalSearchValue={search}
          />
        </div>
      </div>
    </div>
  );
};

export default MyOffers;
