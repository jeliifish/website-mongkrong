export type CustomStatistikItem = {
  id: string;
  label: string;
  value: string;
};

export type StatistikItem = {
  id: string;
  jumlahPenduduk: string;
  jumlahKK: string;
  luasWilayah: string;
  jumlahRT: string;
  batasUtara: string;
  batasSelatan: string;
  batasBarat: string;
  batasTimur: string;
  customStats?: CustomStatistikItem[];
};

