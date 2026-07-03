export type UmkmItem = {
  id: string;
  name: string;
  owner: string;
  description?: string;
  address?: string;
  phone?: string;
  imageUrl?: string;
  imagePublicId?: string;
  fileName?: string;
};

export type NewUmkmInput = {
  name: string;
  owner: string;
  description?: string;
  address?: string;
  phone?: string;
  imageUrl?: string;
  imagePublicId?: string;
  fileName?: string;
};
