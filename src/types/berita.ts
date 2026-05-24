export type BeritaItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  author: string;
  content: string[];
};

export type NewBeritaInput = {
  title: string;
  description: string;
  date: string;
};
