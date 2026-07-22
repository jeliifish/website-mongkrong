export type BeritaItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  author: string;
  content: string[];
  imageUrl?: string;
  imagePublicId?: string;
  fileName?: string;
  status?: "Published" | "Draft";
};

export type NewBeritaInput = {
  title: string;
  description: string;
  date: string;
  category?: string;
  author?: string;
  imageUrl?: string;
  imagePublicId?: string;
  fileName?: string;
  status?: "Published" | "Draft";
};
