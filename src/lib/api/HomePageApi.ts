import { post } from "@/lib/api/ServerApiService";
import { BUSINESS_REVIEW, FAQS, HOW_IT_WORKS } from "@/lib/api/ApiRoutes";
import { BusinessReviewApiData, FAQApiData, HomePageApiData, HomePageApiPayload } from "@/types/homePage";

export async function fetchHowItWorksData() {
  const payload: HomePageApiPayload = { type: "DETAILS" };
  
  const response = await post<HomePageApiData>(HOW_IT_WORKS, payload, {
    cache: "no-store",
  });

  return response;
}

export async function fetchInspirationData() {
  const payload: HomePageApiPayload = { type: "INSPIRATION" };
  
  const response = await post<HomePageApiData>(HOW_IT_WORKS, payload, {
    cache: "no-store",
  });

  return response;
}

export async function fetchFaqsData() {
  const payload = {};
  
  const response = await post<FAQApiData>(FAQS, payload, {
    cache: "no-store",
  });

  return response;
}

export async function fetchBusinessReviewsData() {
  const payload = {};

  const response = await post<BusinessReviewApiData>(BUSINESS_REVIEW, payload, {
    cache: "no-store",
  });

  return response;
}