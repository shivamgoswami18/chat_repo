import type { AppDispatch } from "@/lib/store/store";
import { authData } from "./ApiService";
import { LIST_OF_ACTIVE_PROJECT, DASHBOARD_STATS } from "./ApiRoutes";
import {
  checkStatusCodeSuccess,
  errorHandler,
  finalApiMessage,
} from "@/components/constants/Common";
import { toast } from "react-toastify";
import {
  setDashboardStats,
  setActiveProjects,
  setLoadingStats,
  setLoadingActiveProjects,
} from "../store/slices/dashboardSlice";

export interface ListOfActiveProjectPayload {
  sortKey?: string;
  sortValue?: string;
  page?: number;
  limit?: number;
  search?: string;
}

interface ListOfActiveProjectParams {
  payload: ListOfActiveProjectPayload;
}

export const ListOfActiveProject = ({ payload }: ListOfActiveProjectParams) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoadingActiveProjects(true));
    try {
      const response = await authData.post(LIST_OF_ACTIVE_PROJECT, payload);
      const responseData = response?.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setActiveProjects(responseData?.data));
      } else {
        toast.error(message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(setLoadingActiveProjects(false));
    }
  };
};

export const DashboardStats = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoadingStats(true));
    try {
      const response = await authData.get(DASHBOARD_STATS);
      const responseData = response?.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setDashboardStats(responseData?.data));
      } else {
        toast.error(message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(setLoadingStats(false));
    }
  };
};
