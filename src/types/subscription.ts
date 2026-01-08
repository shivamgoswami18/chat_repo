export interface PackageData {
  _id: string;
  package_name: string;
  monthly_duration: number;
  price: number;
}

export interface SubscriptionResponse {
  items: PackageData[];
}

export interface ClipHistory {
  _id: string;
  clips_used: number;
  usage_type : string;
  project_title : string;
  createdAt : string; 
}

export interface ClipHistoryResponse {
  items: ClipHistory[];
}