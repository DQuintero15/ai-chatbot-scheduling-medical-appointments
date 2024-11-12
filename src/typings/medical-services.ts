export interface ServicesResponse {
  _embedded: EmbeddedServices;
  _links: Links;
  page: Page;
}

export interface EmbeddedServices {
  services: Service[];
}

export interface Service {
  name: string;
  description: string;
  createdAt: string | null;
  updatedAt: string | null;
  _links: ServiceLinks;
}

export interface ServiceLinks {
  self: Link;
  service: Link;
}

export interface Links {
  self: Link;
  profile: Link;
}

export interface Link {
  href: string;
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
