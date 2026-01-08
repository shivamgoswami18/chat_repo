import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DashboardStatsData {
  active_projects?: number;
  total_offers?: number;
  completed_projects?: number;
  progress_projects?: number;
}

export interface ActiveProjectCategory {
  _id?: string;
  name?: string;
}

export interface ActiveProjectCounty {
  _id?: string;
  name?: string;
}

export interface ActiveProjectTypeOfWork {
  _id?: string;
  name?: string;
}

export interface ActiveProjectItem {
  _id?: string;
  title?: string;
  description?: string;
  project_image?: string[];
  category?: ActiveProjectCategory;
  status?: string;
  createdAt?: string;
  type_of_work?: ActiveProjectTypeOfWork;
  county?: ActiveProjectCounty;
}

interface ActiveProjectsResponse {
  items?: ActiveProjectItem[];
  totalCount?: number;
  itemsCount?: number;
  currentPage?: number;
  totalPage?: number;
  pageSize?: number;
}

interface DashboardState {
  stats: DashboardStatsData;
  activeProjects: ActiveProjectsResponse;
  loadingStats: boolean;
  loadingActiveProjects: boolean;
}

const initialState: DashboardState = {
  stats: {
    active_projects: 0,
    total_offers: 0,
    completed_projects: 0,
    progress_projects: 0,
  },
  activeProjects: { items: [] },
  loadingStats: false,
  loadingActiveProjects: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardStats(state, action: PayloadAction<DashboardStatsData>) {
      state.stats = action.payload;
    },
    setActiveProjects(state, action: PayloadAction<ActiveProjectsResponse>) {
      state.activeProjects = action.payload;
    },
    setLoadingStats(state, action: PayloadAction<boolean>) {
      state.loadingStats = action.payload;
    },
    setLoadingActiveProjects(state, action: PayloadAction<boolean>) {
      state.loadingActiveProjects = action.payload;
    },
  },
});

export const {
  setDashboardStats,
  setActiveProjects,
  setLoadingStats,
  setLoadingActiveProjects,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
