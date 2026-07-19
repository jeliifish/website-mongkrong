export interface PemetaanSection {
  heading: string;
  body: string[];
}

export interface PemetaanItem {
  slug: string;
  title: string;
  category: string;
  summary: string;
  imageUrl: string;
  lastUpdated?: string;
  sections: PemetaanSection[];
}

const pemetaanItems: PemetaanItem[] = [
  {
    slug: "batas-wilayah",
    title: "Peta Batas Wilayah Administrasi Dusun Mongkrong",
    category: "Administrasi",
    summary: "Peta batas administratif Dusun Mongkrong, Desa Sampang, Kecamatan Gedangsari yang menunjukkan batas wilayah dusun, persebaran RT dan RW, serta lokasi fasilitas ibadah (masjid), pendidikan (sekolah), dan pemakaman umum (TPU).",
    imageUrl: "/peta/batas-wilayah.jpg",
    lastUpdated: "Juli 2026",
    sections: [
      {
        heading: "Batas Wilayah & Administrasi",
        body: [
          "Batas Dusun: Garis merah tebal menggambarkan batas administratif luar Dusun Mongkrong yang berada di Desa Sampang, Kecamatan Gedangsari, Kabupaten Gunungkidul, D.I. Yogyakarta.",
          "Wilayah Administrasi RT & RW: Peta menunjukkan titik sebaran wilayah RW (simbol segi lima oranye) dan RT (simbol segitiga kuning) di seluruh dusun.",
          "Skala Peta: Menggunakan skala detail 1:10.000 dengan basis data spasial yang presisi."
        ]
      },
      {
        heading: "Lokasi Fasilitas Publik & Umum",
        body: [
          "Rumah Ibadah (Masjid): Ditandai dengan simbol bulan sabit & bintang kuning yang tersebar merata di beberapa RT sebagai pusat ibadah dan kegiatan keagamaan warga.",
          "Sarana Pendidikan (Sekolah): Ditandai dengan simbol bendera hijau di bagian utara/timur wilayah dusun.",
          "Tempat Pemakaman Umum (TPU): Lokasi pemakaman umum bagi masyarakat ditandai dengan simbol bintang hitam berongga di bagian tengah wilayah dusun."
        ]
      }
    ]
  },
  {
    slug: "tutupan-lahan",
    title: "Peta Penggunaan dan Tutupan Lahan Dusun Mongkrong",
    category: "Fisik & Lahan",
    summary: "Peta tutupan lahan Dusun Mongkrong untuk memantau pemanfaatan ruang bumi seperti kawasan persawahan tadah hujan, tegalan/ladang, permukiman, perkebunan, padang rumput, serta sebaran jalan dan aliran sungai.",
    imageUrl: "/peta/tutupan-lahan.jpg",
    lastUpdated: "Juli 2026",
    sections: [
      {
        heading: "Kategori Penggunaan Lahan",
        body: [
          "Sawah Tadah Hujan: Lahan pertanian basah yang bergantung pada air hujan, digambarkan dengan warna kuning cerah.",
          "Tegalan / Ladang: Lahan pertanian kering untuk komoditas musiman/hortikultura, digambarkan dengan warna hijau kekuningan/olive.",
          "Permukiman dan Tempat Kegiatan: Area hunian masyarakat dan pusat aktivitas desa, digambarkan dengan warna hijau muda.",
          "Perkebunan / Kebun & Hutan Rakyat: Kawasan perkebunan warga, digambarkan dengan warna hijau kecokelatan.",
          "Infrastruktur Transportasi & Air: Jaringan jalan ditandai dengan garis oranye dan aliran sungai alami ditandai dengan garis biru melintasi wilayah dusun."
        ]
      },
      {
        heading: "Tujuan Pemetaan Lahan & Sumber Data",
        body: [
          "Membantu perencanaan tata ruang wilayah dusun agar pembangunan fisik tidak mengganggu wilayah pertanian produktif.",
          "Sebagai referensi dalam mitigasi bencana alam dan pemantauan kondisi lingkungan fisik wilayah perbukitan.",
          "Sumber Peta: Disusun berdasarkan data Badan Informasi Geospasial (BIG) - Rupa Bumi Indonesia (RBI) Lembar GunungKidul."
        ]
      }
    ]
  }
];

export function getPemetaanItems(): PemetaanItem[] {
  return pemetaanItems;
}

export function getPemetaanItem(slug: string): PemetaanItem | undefined {
  return pemetaanItems.find((item) => item.slug === slug);
}
