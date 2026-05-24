export type UmkmItem = {
  id: string;
  name: string;
  owner: string;
  imageUrl?: string;
  imagePublicId?: string;
  fileName?: string;
};

export type NewUmkmInput = {
  name: string;
  owner: string;
  imageUrl?: string;
  imagePublicId?: string;
  fileName?: string;
};
