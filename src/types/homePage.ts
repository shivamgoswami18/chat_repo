export interface HomePageDetail {
  detail_title: string;
  detail_description: string;
  detail_sub_description: string;
  _id: string;
}

export interface HomePageItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  details: HomePageDetail[];
  createdAt: string;
  get_started_title?: string;
  get_started_description?: string;
  get_started_image?: string;
}

export interface HomePageApiData {
  items: HomePageItem[];
  totalCount: number;
  itemsCount: number;
  currentPage: number;
  totalPage: number;
  pageSize: number;
}

export interface HomePageApiPayload extends Record<string, unknown> {
  type: "DETAILS" | "INSPIRATION";
}

export interface FAQItem {
  question: string;
  answer: string;
  _id: string;
  createdAt?: string;
}

export interface FAQApiData {
  items: FAQItem[];
  totalCount: number;
  itemsCount: number;
  currentPage: number;
  totalPage: number;
  pageSize: number;
}

export interface BusinessInfo {
  _id: string;
  profile_image: string | null;
  business_name: string;
}

export interface CustomerInfo {
  _id: string;
  full_name: string;
  profile_image: string | null;
}

export interface BusinessReviewItem {
  _id: string;
  rating: number;
  review_text: string;
  createdAt: string;
  business: BusinessInfo;
  customer: CustomerInfo;
}

export interface BusinessReviewApiData {
  items: BusinessReviewItem[];
  totalCount: number;
  itemsCount: number;
  currentPage: number;
  totalPage: number;
  pageSize: number;
}