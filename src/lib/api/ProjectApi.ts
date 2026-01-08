import type { AppDispatch } from "@/lib/store/store";
import { setLoading } from "../store/slices/authSlice";
import { authData, nonAuthData, multipartData } from "./ApiService";
import {
  LIST_OF_PROJECT,
  LIST_OF_SERVICE,
  VIEW_CATEGORY_TEMPLATE,
  LIST_OF_MY_PROJECT_BUSINESS,
  LIST_OF_MY_PROJECT_CUSTOMER,
  VIEW_PROJECT,
  LIST_OF_RECEIVED_OFFER,
  APPLY_PROJECT_OFFER,
  ACCEPT_PROJECT_OFFER,
  UPDATE_PROJECT_STATUS,
  GET_LOCATION,
  CREATE_PROJECT,
  FILE_UPLOAD,
} from "./ApiRoutes";
import {
  checkStatusCodeSuccess,
  errorHandler,
  finalApiMessage,
} from "@/components/constants/Common";
import { toast } from "react-toastify";
import {
  setProjects,
  setServices,
  setMyProjectsBusiness,
  setMyProjectsCustomer,
  setCurrentProjectDetails,
  setLoadingProjectDetails,
  setReceivedOffers,
  setLoadingOffers,
  setAcceptingOffer,
  setCategoryTemplate,
  setLoadingTemplate,
  setLoadingServices,
  setLoadingLocation,
} from "../store/slices/projectSlice";

interface ListOfServiceData {
  limit: number;
}

interface ListOfServiceParams {
  payload: ListOfServiceData;
}

export const ListOfService = ({ payload }: ListOfServiceParams) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoadingServices(true));
    try {
      const response = await nonAuthData.post(LIST_OF_SERVICE, payload);
      const responseData = response?.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setServices(responseData?.data));
      } else {
        toast.error(message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(setLoadingServices(false));
    }
  };
};

interface ViewCategoryTemplateParams {
  templateId: string;
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

export const ViewCategoryTemplate = ({
  templateId,
}: ViewCategoryTemplateParams) => {
  return async (dispatch: AppDispatch): Promise<CategoryTemplate | null> => {
    dispatch(setLoadingTemplate(true));
    try {
      const response = await nonAuthData.get(
        VIEW_CATEGORY_TEMPLATE(templateId)
      );
      const responseData = response?.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        const template = responseData?.data;
        dispatch(setCategoryTemplate(template));
        return template;
      } else {
        toast.error(message);
        dispatch(setCategoryTemplate(null));
        return null;
      }
    } catch (error) {
      errorHandler(error);
      dispatch(setCategoryTemplate(null));
      return null;
    } finally {
      dispatch(setLoadingTemplate(false));
    }
  };
};

export interface ListOfProjectPayload {
  sortKey: string;
  sortValue: string;
  page: number;
  limit: number;
  search?: string;
  status?: string;
  typeOfWork?: string[];
  municipality?: string[];
  category?: string[];
  county?: string[];
}

interface ListOfProjectParams {
  payload: ListOfProjectPayload;
}

export const ListOfProject = ({ payload }: ListOfProjectParams) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await authData.post(LIST_OF_PROJECT, payload);
      const responseData = response?.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setProjects(responseData?.data));
      } else {
        toast.error(message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const ListOfMyProjectBusiness = ({ payload }: ListOfProjectParams) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await authData.post(
        LIST_OF_MY_PROJECT_BUSINESS,
        payload
      );
      const responseData = response?.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setMyProjectsBusiness(responseData?.data));
      } else {
        toast.error(message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const ListOfMyProjectCustomer = ({ payload }: ListOfProjectParams) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await authData.post(
        LIST_OF_MY_PROJECT_CUSTOMER,
        payload
      );
      const responseData = response?.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setMyProjectsCustomer(responseData?.data));
      } else {
        toast.error(message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const ViewProject = (projectId: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoadingProjectDetails(true));
    try {
      const response = await authData.get(VIEW_PROJECT(projectId));
      const responseData = response?.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setCurrentProjectDetails(responseData?.data));
      } else {
        toast.error(message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(setLoadingProjectDetails(false));
    }
  };
};

interface ListOfReceivedOfferParams {
  projectId: string;
  payload: ListOfProjectPayload;
}

export const ListOfReceivedOffer = ({
  projectId,
  payload,
}: ListOfReceivedOfferParams) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoadingOffers(true));
    try {
      const response = await authData.post(
        LIST_OF_RECEIVED_OFFER(projectId),
        payload
      );
      const responseData = response?.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        dispatch(setReceivedOffers(responseData?.data));
      } else {
        toast.error(message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(setLoadingOffers(false));
    }
  };
};

interface ApplyProjectOfferPayload {
  customer_id: string;
  project_id: string;
  description?: string;
  estimated_duration?: string;
  amount?: number;
}

interface ApplyProjectOfferParams {
  payload: ApplyProjectOfferPayload;
}

export const ApplyProjectOffer =
  ({ payload }: ApplyProjectOfferParams) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await authData.post(APPLY_PROJECT_OFFER, payload);
      const responseData = response?.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

interface AcceptProjectOfferPayload {
  offer_id: string;
  status: string;
}

interface AcceptProjectOfferParams {
  payload: AcceptProjectOfferPayload;
}

export const AcceptProjectOffer =
  ({ payload }: AcceptProjectOfferParams) =>
  async (dispatch: AppDispatch) => {
    dispatch(setAcceptingOffer(true));
    try {
      const response = await authData.post(ACCEPT_PROJECT_OFFER, payload);
      const responseData = response?.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(setAcceptingOffer(false));
    }
  };

interface UpdateProjectStatusPayload {
  project_id: string;
  status: string;
}

interface UpdateProjectStatusParams {
  payload: UpdateProjectStatusPayload;
}

export const UpdateProjectStatus =
  ({ payload }: UpdateProjectStatusParams) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await authData.put(UPDATE_PROJECT_STATUS, payload);
      const responseData = response?.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export interface LocationResponse {
  municipality: string;
  postal_code: string;
}

export const getLocation = (postalCode: string) => {
  return async (dispatch: AppDispatch): Promise<LocationResponse | null> => {
    dispatch(setLoadingLocation(true));
    try {
      const response = await nonAuthData.post(GET_LOCATION(postalCode));
      const responseData = response.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        return responseData.data;
      }
      toast.error(message);
      return null;
    } catch (error) {
      errorHandler(error);
      return null;
    } finally {
      dispatch(setLoadingLocation(false));
    }
  };
};

export interface CreateProjectPayload {
  full_name?: string;
  email?: string;
  phone_number?: string;
  customer_id?: string;
  status: string;
  source: string;
  category: {
    categoryId: string;
    typeOfWorkId?: string;
  };
  title: string;
  description: string;
  address: string;
  postal_code: string;
  project_image?: string[];
  project_details: Array<{
    labelName: string;
    fieldValue: string;
    fieldType: string;
    isRequired: string;
    readOnly: string;
    variableOptions: string;
  }>;
}

interface CreateProjectParams {
  payload: CreateProjectPayload;
}

export const CreateProject =
  ({ payload }: CreateProjectParams) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await nonAuthData.post(CREATE_PROJECT, payload);
      const responseData = response?.data;
      const message = finalApiMessage(responseData);
      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        toast.success(message);
        return true;
      } else {
        toast.error(message);
        return false;
      }
    } catch (error) {
      errorHandler(error);
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

interface FileUploadResponse {
  imagePath: string[];
}

export const uploadProjectImages = async (files: File[]): Promise<string[]> => {
  try {
    if (files.length === 0) {
      return [];
    }
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    const response = await multipartData.post(FILE_UPLOAD, formData);
    const responseData = response.data;
    const message = finalApiMessage(responseData);
    if (checkStatusCodeSuccess(responseData?.statusCode)) {
      const data = responseData?.data as FileUploadResponse;
      if (data?.imagePath && data.imagePath.length > 0) {
        return data.imagePath;
      }
      return [];
    } else {
      toast.error(message);
      return [];
    }
  } catch (error) {
    errorHandler(error);
    return [];
  }
};
