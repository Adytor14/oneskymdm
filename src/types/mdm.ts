export interface MDMEntity {
  id: string;
  type: "HCP" | "HCO" | "Address" | "DCR";
  orgId: string;
  mdmId: string;
  identifiers: string[];
  status: "Active" | "Inactive" | "Pending";
  source: string;
  lastUpdated: string;
}

export interface HCPProfile extends MDMEntity {
  type: "HCP";
  firstName: string;
  lastName: string;
  npiId: string;
  speciality: string[];
  organization?: string;
  address: Address;
  phone: string;
  email: string;
  affiliations: string[];
  preferredContact: string;
  education: Education[];
  license: string;
  degreeType: string;
}

export interface HCOProfile extends MDMEntity {
  type: "HCO";
  name: string;
  npiId: string;
  organizationType: string;
  address: Address;
  phone: string;
  email: string;
  affiliatedHCPs: string[];
  departments: string[];
  accreditation: string[];
}

export interface Address extends MDMEntity {
  type: "Address";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressType: "Primary" | "Secondary" | "Billing" | "Shipping";
  verified: boolean;
}

export interface DCRProfile extends MDMEntity {
  type: "DCR";
  callDate: string;
  hcpName: string;
  hcoName: string;
  representativeName: string;
  callDuration: number;
  callType: string;
  productsDiscussed: string[];
  samplesProvided: string[];
  nextFollowUp: string;
  notes: string;
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
  fieldOfStudy: string;
}

export type EntityType = "HCP" | "HCO" | "Address" | "DCR";
