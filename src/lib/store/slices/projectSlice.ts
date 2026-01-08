import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypeOfWork } from "@/types/user";

export interface ServiceItem {
  _id?: string;
  name?: string;
  category_template_id?: string;
  type_of_work?: TypeOfWork[];
}

interface ServicesResponse {
  items?: ServiceItem[];
}

export interface ProjectCategory {
  _id?: string;
  name?: string;
}

export interface ProjectCounty {
  _id?: string;
  name?: string;
}

export interface ProjectItem {
  _id?: string;
  title?: string;
  description?: string;
  createdAt?: string;
  category?: ProjectCategory;
  county?: ProjectCounty;
  status?: string;
}

export interface ProjectUser {
  _id?: string;
  name?: string;
  email?: string;
}

export interface ProjectCustomer {
  _id?: string;
  full_name?: string;
}

export interface ProjectDetails extends ProjectItem {
  step?: number;
  project_image?: string[];
  user?: ProjectUser;
  customer?: ProjectCustomer;
  offered?: boolean;
}

export interface OfferItem {
  _id?: string;
  description?: string;
  estimated_duration?: string;
  amount?: number;
  createdAt?: string;
  averageRating?: number;
  totalReviewCount?: number;
  business_name?: string;
  business_image?: string | null;
  status?: string;
  business_id?: string;
}

interface OffersResponse {
  items?: OfferItem[];
  totalCount?: number;
  itemsCount?: number;
  currentPage?: number;
  totalPage?: number;
  pageSize?: number;
}

interface ProjectsResponse {
  items?: ProjectItem[];
  totalCount?: number;
  itemsCount?: number;
  currentPage?: number;
  totalPage?: number;
  pageSize?: number;
}

export interface TemplateField {
  _id: string;
  lableName: string;
  fieldValue: string;
  fieldType: string;
  isRequired: string;
  readOnly: string;
  variableOptions: string;
}

export interface CategoryTemplate {
  _id: string;
  template_name: string;
  field: TemplateField[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectServiceSelectionData {
  selectedServiceId: string | null;
  selectedTypeOfWorkId?: string | null;
}

export interface ProjectInformationData {
  projectTitle: string;
  projectDescription: string;
  projectImage: string[];
  dynamicFields: Record<string, string | string[]>;
}

export interface ProjectLocationData {
  streetAddress: string;
  postalCode: string;
  city: string;
}

export interface ProjectContactData {
  fullName: string;
  email: string;
  phone: string;
  agreeTerms: boolean;
}

interface ProjectState {
  services: ServicesResponse;
  projects: ProjectsResponse;
  myProjectsBusiness: ProjectsResponse;
  myProjectsCustomer: ProjectsResponse;
  currentProjectDetails: ProjectDetails | null;
  loadingProjectDetails: boolean;
  receivedOffers: OffersResponse;
  loadingOffers: boolean;
  acceptingOffer: boolean;
  selectedCategory: ServiceItem | null;
  categoryTemplate: CategoryTemplate | null;
  loadingTemplate: boolean;
  loadingServices: boolean;
  loadingLocation: boolean;
  serviceSelectionData: ProjectServiceSelectionData | null;
  projectInformationData: ProjectInformationData | null;
  locationData: ProjectLocationData | null;
  contactData: ProjectContactData | null;
}

const initialState: ProjectState = {
  services: { items: [] },
  projects: { items: [] },
  myProjectsBusiness: { items: [] },
  myProjectsCustomer: { items: [] },
  currentProjectDetails: null,
  loadingProjectDetails: false,
  receivedOffers: { items: [] },
  loadingOffers: false,
  acceptingOffer: false,
  selectedCategory: null,
  categoryTemplate: null,
  loadingTemplate: false,
  loadingServices: false,
  loadingLocation: false,
  serviceSelectionData: null,
  projectInformationData: null,
  locationData: null,
  contactData: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setServices(state, action: PayloadAction<ServicesResponse>) {
      state.services = action.payload;
    },
    setProjects(state, action: PayloadAction<ProjectsResponse>) {
      state.projects = action.payload;
    },
    setMyProjectsBusiness(state, action: PayloadAction<ProjectsResponse>) {
      state.myProjectsBusiness = action.payload;
    },
    setMyProjectsCustomer(state, action: PayloadAction<ProjectsResponse>) {
      state.myProjectsCustomer = action.payload;
    },
    setCurrentProjectDetails(
      state,
      action: PayloadAction<ProjectDetails | null>
    ) {
      state.currentProjectDetails = action.payload;
    },
    setLoadingProjectDetails(state, action: PayloadAction<boolean>) {
      state.loadingProjectDetails = action.payload;
    },
    setReceivedOffers(state, action: PayloadAction<OffersResponse>) {
      state.receivedOffers = action.payload;
    },
    setLoadingOffers(state, action: PayloadAction<boolean>) {
      state.loadingOffers = action.payload;
    },
    setAcceptingOffer(state, action: PayloadAction<boolean>) {
      state.acceptingOffer = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<ServiceItem | null>) {
      state.selectedCategory = action.payload;
    },
    setCategoryTemplate(state, action: PayloadAction<CategoryTemplate | null>) {
      state.categoryTemplate = action.payload;
    },
    setLoadingTemplate(state, action: PayloadAction<boolean>) {
      state.loadingTemplate = action.payload;
    },
    setLoadingServices(state, action: PayloadAction<boolean>) {
      state.loadingServices = action.payload;
    },
    setLoadingLocation(state, action: PayloadAction<boolean>) {
      state.loadingLocation = action.payload;
    },
    setServiceSelectionData(
      state,
      action: PayloadAction<ProjectServiceSelectionData | null>
    ) {
      state.serviceSelectionData = action.payload;
    },
    setProjectInformationData(
      state,
      action: PayloadAction<ProjectInformationData | null>
    ) {
      state.projectInformationData = action.payload;
    },
    setLocationData(state, action: PayloadAction<ProjectLocationData | null>) {
      state.locationData = action.payload;
    },
    setContactData(state, action: PayloadAction<ProjectContactData | null>) {
      state.contactData = action.payload;
    },
    clearAllProjectFormData(state) {
      state.serviceSelectionData = null;
      state.projectInformationData = null;
      state.locationData = null;
      state.contactData = null;
    },
  },
});

export const {
  setServices,
  setProjects,
  setMyProjectsBusiness,
  setMyProjectsCustomer,
  setCurrentProjectDetails,
  setLoadingProjectDetails,
  setReceivedOffers,
  setLoadingOffers,
  setAcceptingOffer,
  setSelectedCategory,
  setCategoryTemplate,
  setLoadingTemplate,
  setLoadingServices,
  setLoadingLocation,
  setServiceSelectionData,
  setProjectInformationData,
  setLocationData,
  setContactData,
  clearAllProjectFormData,
} = projectSlice.actions;
export default projectSlice.reducer;
