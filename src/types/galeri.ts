export type GaleriItem = {
  id: string;
  title: string;
  photos: string;
  updated: string;
  imageUrl?: string;
  imagePublicId?: string;
  fileName?: string;
};

export type NewGaleriInput = {
  title: string;
  imageUrl: string;
  imagePublicId?: string;
  fileName?: string;
};
