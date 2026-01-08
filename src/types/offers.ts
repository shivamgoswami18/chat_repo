export type OfferStatus = "pending" | "accepted" | "rejected";

export interface OfferData extends Record<string, unknown> {
  id: string;
  projectName: string;
  customer: string;
  offerPrice: string;
  status: OfferStatus;
  date: string;
}
