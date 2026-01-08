import {
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  FacebookIcon,
  LinkedInIcon,
  XTwitterIcon,
  YouTubeIcon,
  InstagramIcon,
} from "@/assets/icons/CommonIcons";
import { ReactElement } from "react";
import { RatingBreakdown, Review } from "../project/ReviewContent";

export interface FooterLink {
  label: string;
  href: string;
}
export interface County {
  id: string;
  label: string;
}
export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface CustomerServiceItem {
  text: string;
  href?: string;
  isLink?: boolean;
}

export interface SocialMediaItem {
  href: string;
}

export const customerServiceIcons: ReactElement[] = [
  <ClockIcon />,
  <EnvelopeIcon />,
  <PhoneIcon />,
];

export const socialMediaIcons: ReactElement[] = [
  <FacebookIcon />,
  <LinkedInIcon />,
  <XTwitterIcon />,
  <YouTubeIcon />,
  <InstagramIcon />,
];

export const footerConstants = {
  columns: [
    {
      title: "OM OSS",
      links: [
        { label: "Kontakt", href: "#" },
        { label: "Presse", href: "#" },
        { label: "Karriere", href: "#" },
        { label: "Vår historie", href: "#" },
      ],
    },
    {
      title: "FOR PRIVATPERSON",
      links: [
        { label: "Aktuelt", href: "#" },
        { label: "Inspirasjon", href: "#" },
        { label: "Hjelpesenter", href: "#" },
        { label: "Referanser", href: "#" },
        { label: "Startguide", href: "#" },
      ],
    },
    {
      title: "FOR BEDRIFTER",
      links: [
        { label: "Registrer bedrift", href: "#" },
        { label: "Referanser", href: "#" },
        { label: "Aktuelt", href: "#" },
        { label: "Startguide", href: "#" },
        { label: "Fordeler", href: "#" },
      ],
    },
  ] as FooterColumn[],
  customerService: [
    {
      text: "9-16 på hverdager. Stengt i helger",
      isLink: false,
    },
    {
      text: "bedrift@gmail.com",
      href: "mailto:bedrift@gmail.com",
      isLink: true,
    },
    {
      text: "012 345 6789",
      href: "tel:0123456789",
      isLink: true,
    },
  ] as CustomerServiceItem[],
  legalLinks: [
    { label: "Personvernerklæring", href: "#" },
    { label: "Nettstedkart", href: "#" },
    { label: "Vilkår", href: "#" },
    { label: "Innstillinger for informasjonskapsler", href: "#" },
  ] as FooterLink[],
  socialMedia: [
    {
      href: "#",
    },
    {
      href: "#",
    },
    {
      href: "#",
    },
    {
      href: "#",
    },
    {
      href: "#",
    },
  ] as SocialMediaItem[],
  copyright: `© ${new Date().getFullYear()}. Alle rettigheter forbeholdt.`,
  logo: "LOGO",
  customerServiceTitle: "KUNDESERVICE",
};

export const norwayAreas: County[] = [
  { id: "oslo", label: "Oslo" },
  { id: "akershus", label: "Akershus" },
  { id: "innlandet", label: "Innlandet" },
  { id: "vestfold_telemark", label: "Vestfold og Telemark" },
  { id: "agder", label: "Agder" },
  { id: "rogaland", label: "Rogaland" },
  { id: "vestland", label: "Vestland" },
  { id: "more_romsdal", label: "Møre og Romsdal" },
  { id: "trondelag", label: "Trøndelag" },
  { id: "nordland", label: "Nordland" },
];

export const defaultReviews: Review[] = [
  {
    id: 1,
    rating: 5,
    tag: "Gulvinstallasjon",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    name: "Emma Johnson",
    date: "15. nov. 2025",
  },
  {
    id: 2,
    rating: 3,
    tag: "Gulvinstallasjon",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    name: "Michael Smith",
    date: "10. nov. 2025",
  },
  {
    id: 3,
    rating: 5,
    tag: "Gulvinstallasjon",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    name: "Sarah Williams",
    date: "5. nov. 2025",
  },
];

export const defaultRatingBreakdown: RatingBreakdown[] = [
  { stars: 5, count: 20, percentage: 62.5 },
  { stars: 4, count: 8, percentage: 25 },
  { stars: 3, count: 3, percentage: 9.4 },
  { stars: 2, count: 1, percentage: 3.1 },
  { stars: 1, count: 0, percentage: 0 },
];

export const defaultReviewStats = {
  averageRating: 4.8,
  totalReviews: 32,
};

export const businessReview: Review[] = [
  {
    id: 1,
    rating: 3,
    tag: "Gulvinstallasjon",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    name: "Emma Johnson",
    date: "15. nov. 2025",
  },
  {
    id: 2,
    rating: 5,
    tag: "Gulvinstallasjon",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    name: "Michael Smith",
    date: "10. nov. 2025",
  },
];

export const businessRatingBreakdown: RatingBreakdown[] = [
  { stars: 5, count: 20, percentage: 62.5 },
  { stars: 4, count: 100, percentage: 99 },
  { stars: 3, count: 33, percentage: 14.1 },
  { stars: 2, count: 1, percentage: 3.1 },
  { stars: 1, count: 0, percentage: 0 },
];

export const businessReviewStats = {
  averageRating: 10.8,
  totalReviews: 52,
};