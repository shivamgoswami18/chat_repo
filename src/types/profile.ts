export interface County {
  _id: string;
  name: string;
  municipalities: string[];
}

export interface ListOfCounties {
  counties: County[];
  totalCount: number;
  itemsCount: number;
  currentPage: number;
  totalPage: number;
  pageSize: number;
}

export interface ProfileCounty {
  county_id: string;
  county_name: string;
  municipalities: {
    municipality_id: string;
    municipality_name: string;
    is_active: boolean;
  }[];
}