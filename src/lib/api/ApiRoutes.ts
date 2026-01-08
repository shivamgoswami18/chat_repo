// auth
export const SIGN_IN = "login";
export const SIGN_UP = "register";
export const VERIFY_EMAIL = "verifyEmail";
export const VERIFY_OTP = "verifyOtp";
export const FORGOT_PASSWORD = "forgotPassword";
export const CREATE_PASSWORD = "createPassword";

export const LIST_OF_SERVICE = "category/listOfCategory";
export const VIEW_CATEGORY_TEMPLATE = (id: string) =>
  `category/viewTemplate/${id}`;
export const LIST_OF_COUNTY = "county/listOfCounty";
export const BUSINESS_SEARCH = "businessSearch";

//offers
export const LIST_OF_OFFER = "offer/listOfOffer";

// project
export const LIST_OF_PROJECT = "dashboard/listOfProject";
export const LIST_OF_MY_PROJECT_BUSINESS = "dashboard/listOfActiveProject";
export const LIST_OF_MY_PROJECT_CUSTOMER = "dashboard/customer/listOfProject";
export const VIEW_PROJECT = (id: string) => `project/viewProject/${id}`;
export const LIST_OF_RECEIVED_OFFER = (id: string) =>
  `dashboard/customer/listOfReceivedOffer/${id}`;
export const APPLY_PROJECT_OFFER = "offer/applyProject";
export const ACCEPT_PROJECT_OFFER = "offer/acceptOffer";
export const UPDATE_PROJECT_STATUS = "project/updateStatus";
export const CREATE_PROJECT = "project/createProject";

// subscription
export const LIST_OF_SUBSCRIPTION = "subscription/listOfSubscriptions";
export const CLIP_HISTORY = "subscription/clipHistory";
export const SEND_PLAN_REQUEST = (id: string) =>
  `subscription/sendPlanRequest/${id}`;

// user
export const VIEW_PROFILE = "viewProfile";
export const EDIT_PROFILE = "editProfile";
export const FILE_UPLOAD = "fileUpload";

// settings
export const CHANGE_PASSWORD = "changePassword";
export const UPDATE_PROFILE = "editProfile";
export const GET_LOCATION = (postal_code: string) =>
  `getLocation/${postal_code}`;

//HomePage
export const HOW_IT_WORKS = "home-page/listOfHomePage" //"type": "DETAILS" and type: "INSPIRATION"
export const FAQS = "faq"
export const BUSINESS_REVIEW = "listOfBusinessReview"
export const HOME_PAGE_STATS = "home/stats"

//dashboard customer
export const LIST_OF_ACTIVE_PROJECT = "dashboard/customer/listOfActiveProject";
export const DASHBOARD_STATS = "dashboard/customer/statsCount";

// reviews
export const ADD_REVIEW = "review/createReview";
export const LIST_OF_REVIEWS = (id: string) => `review/listOfReview/${id}`;

// chat
export const CREATE_CHAT_SESSION = "chat/createSession";
export const CHAT_LIST = "chat/chatList";
export const UNREAD_COUNT = "chat/unread-count";