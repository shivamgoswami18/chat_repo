export interface ParentItem {
  id: string;
  name: string;
  children: {
    id: string;
    name: string;
  }[];
}

export interface BudgetRange {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

export interface SortOption {
  value: string;
  label: string;
}

export const SERVICES: ParentItem[] = [
  {
    id: "carpenter",
    name: "Snekker",
    children: [
      { id: "carpenter_furniture", name: "Møbelsnekring" },
      { id: "carpenter_cabinet", name: "Montering av skap" },
      { id: "carpenter_repair", name: "Reparasjon av treverk" },
      { id: "carpenter_custom", name: "Spesialtilpasset trearbeid" },
    ],
  },
  {
    id: "plumber",
    name: "Rørlegger",
    children: [
      { id: "plumber_pipe_install", name: "Rørinstallasjon" },
      { id: "plumber_maintenance", name: "Vedlikehold av rør" },
      { id: "plumber_leak_fix", name: "Reparasjon av lekkasje" },
      { id: "plumber_drainage", name: "Dreneringsarbeid" },
    ],
  },
  {
    id: "electrician",
    name: "Elektriker",
    children: [
      { id: "electrician_wiring", name: "Elektrisk kabling" },
      {
        id: "electrician_appliance_install",
        name: "Installasjon av elektriske apparater",
      },
      { id: "electrician_fault_repair", name: "Feilretting" },
      { id: "electrician_panel_upgrade", name: "Oppgradering av sikringsskap" },
    ],
  },
  {
    id: "painter",
    name: "Maler",
    children: [
      { id: "painter_interior", name: "Innvendig maling" },
      { id: "painter_exterior", name: "Utvendig maling" },
      { id: "painter_texture", name: "Strukturarbeid" },
      { id: "painter_wallpaper", name: "Montering av tapet" },
    ],
  },
];

export const LOCATION_STATES: ParentItem[] = [
  {
    id: "maharashtra",
    name: "Maharashtra",
    children: [
      { id: "mumbai", name: "Mumbai" },
      { id: "pune", name: "Pune" },
      { id: "nagpur", name: "Nagpur" },
      { id: "nashik", name: "Nashik" },
      { id: "aurangabad", name: "Aurangabad" },
    ],
  },
  {
    id: "karnataka",
    name: "Karnataka",
    children: [
      { id: "bangalore", name: "Bangalore" },
      { id: "mysore", name: "Mysore" },
      { id: "mangalore", name: "Mangalore" },
      { id: "hubli", name: "Hubli" },
    ],
  },
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    children: [
      { id: "chennai", name: "Chennai" },
      { id: "coimbatore", name: "Coimbatore" },
      { id: "madurai", name: "Madurai" },
      { id: "trichy", name: "Trichy" },
    ],
  },
  {
    id: "delhi",
    name: "Delhi",
    children: [
      { id: "new-delhi", name: "New Delhi" },
      { id: "central-delhi", name: "Sentral-Delhi" },
      { id: "north-delhi", name: "Nord-Delhi" },
      { id: "south-delhi", name: "Sør-Delhi" },
    ],
  },
];

export const BUDGET_RANGES: BudgetRange[] = [
  { id: "0-500", label: "0 - 500", min: 0, max: 500 },
  { id: "501-1000", label: "501 - 1000", min: 501, max: 1000 },
  { id: "1001-1500", label: "1001 - 1500", min: 1001, max: 1500 },
  { id: "1501-2000", label: "1501 - 2000", min: 1501, max: 2000 },
  { id: "2000+", label: "2000+", min: 2000, max: null },
];

export const SORT_OPTIONS: SortOption[] = [
  { value: "newest", label: "Nyeste først" },
  { value: "oldest", label: "Eldste først" },
];

export const filterPrefixesConstants = {
  service: {
    parentNamePrefix: "service-",
    childNamePrefix: "work-",
  },
  location: {
    parentNamePrefix: "state-",
    childNamePrefix: "district-",
  },
  budget: {
    prefix: "budget-",
  },
};

export const sortValuesConstants = {
  newest: "newest",
  oldest: "oldest",
} as const;

export interface RightSideLink {
  id: string;
  text: string;
}

export const RIGHT_SIDE_LINKS: RightSideLink[] = [
  { id: "1", text: "Hva er klipp?" },
  { id: "2", text: "Hjelpeguide" },
  { id: "3", text: "Kundeservice" },
];

export const userData = {
  businessName: "ABC Bygg",
  balance: "0",
};

export const projectStatusData = [
  {
    id: 1,
    translationKey: "projectDetailsPageConstants.projectStatusPosted",
    isCompleted: true,
  },
  {
    id: 2,
    translationKey: "projectDetailsPageConstants.projectStatusOfferAccepted",
    isCompleted: false,
  },
  {
    id: 3,
    translationKey: "projectDetailsPageConstants.projectStatusProjectCompleted",
    isCompleted: false,
  },
];
