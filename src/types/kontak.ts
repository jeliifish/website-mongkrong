export type KontakInfo = {
  alamat: string;
  telepon: string;
  email: string;
};

export type PesanMasuk = {
  id: string;
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
  createdAt: number;
};

export type NewPesanInput = Omit<PesanMasuk, "id" | "createdAt">;
