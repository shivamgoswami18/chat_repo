import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { OfferData } from "@/types/offers";
import { authData } from "@/lib/api/ApiService";
import { LIST_OF_OFFER } from "@/lib/api/ApiRoutes";
import {
  checkStatusCodeSuccess,
  extractErrorMessage,
  finalApiMessage,
} from "@/components/constants/Common";
import type { BackendResp } from "@/types/backendResponse";
import { toast } from "react-toastify";

interface OffersState {
  offers: OfferData[];
  loading: boolean;
  error: string | null;
  selectedOffer: OfferData | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

const initialState: OffersState = {
  offers: [],
  loading: false,
  error: null,
  selectedOffer: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
};

export interface FetchOffersParams {
  sortKey: string;
  sortValue: "asc" | "desc";
  page: number;
  limit: number;
  search: string;
  status?: string;
}

interface FetchOffersResponse {
  statusCode: number;
  status: string;
  message?: string;
  messageKey?: string;

  data: {
    items: Array<{
      _id: string;
      amount: number;
      status: "pending" | "accepted" | "rejected";
      createdAt: string;
      project_title: string;
      customer_name: string;
    }>;
    totalCount: number;
    itemsCount: number;
    currentPage: number;
    totalPage: number;
    pageSize: number;
  };
}

interface FetchOffersResult {
  offers: OfferData[];
  pagination: Pick<
    OffersState,
    "totalCount" | "currentPage" | "totalPages" | "pageSize"
  >;
}

export const fetchOffers = createAsyncThunk<
  FetchOffersResult,
  FetchOffersParams
>(LIST_OF_OFFER, async (params, { rejectWithValue }) => {
  try {
    const payload: FetchOffersParams = { ...params };
    if (!payload.status) {
      delete (payload as { status?: string }).status;
    }

    const response = await authData.post<FetchOffersResponse>(
      LIST_OF_OFFER,
      payload
    );

    const responseData = response.data;
    const message = finalApiMessage(responseData as BackendResp);

    if (checkStatusCodeSuccess(responseData.statusCode)) {
      if (message) {
        toast.success(message);
      }
      const transformedOffers: OfferData[] = responseData?.data?.items?.map(
        (item) => ({
          id: item._id,
          projectName: item.project_title,
          customer: item.customer_name,
          offerPrice: `$${item.amount}`,
          status: item.status,
          date: new Date(item.createdAt).toLocaleDateString(),
        })
      );

      return {
        offers: transformedOffers,
        pagination: {
          totalCount: responseData?.data?.totalCount,
          currentPage: responseData?.data?.currentPage,
          totalPages: responseData?.data?.totalPage,
          pageSize: responseData?.data?.pageSize,
        },
      };
    } else {
      if (message) {
        toast.error(message);
      }
      return rejectWithValue(message ?? "");
    }
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    if (message) {
      toast.error(message);
    }
    return rejectWithValue(message);
  }
});

const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    setOffers: (state, action: PayloadAction<OfferData[]>) => {
      state.offers = action.payload;
    },
    setSelectedOffer: (state, action: PayloadAction<OfferData | null>) => {
      state.selectedOffer = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload.offers;
        state.totalCount = action.payload.pagination.totalCount;
        state.currentPage = action.payload.pagination.currentPage;
        state.totalPages = action.payload.pagination.totalPages;
        state.pageSize = action.payload.pagination.pageSize;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setOffers, setSelectedOffer, clearError, setLoading } =
  offersSlice.actions;

export default offersSlice.reducer;