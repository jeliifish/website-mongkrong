const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UMKM_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_UMKM;
const GALERI_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_GALERI;

type CloudinaryUploadResponse = {
  original_filename?: string;
  public_id: string;
  secure_url: string;
};

function getUploadPreset(kind: "umkm" | "galeri" | "berita") {
  return kind === "umkm" ? UMKM_PRESET : GALERI_PRESET;
}

export function isCloudinaryConfigured(kind: "umkm" | "galeri" | "berita") {
  return Boolean(CLOUDINARY_CLOUD_NAME && getUploadPreset(kind));
}

export function getMissingCloudinaryConfig(kind: "umkm" | "galeri" | "berita") {
  const missingKeys: string[] = [];

  if (!CLOUDINARY_CLOUD_NAME) {
    missingKeys.push("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
  }

  if (!getUploadPreset(kind)) {
    missingKeys.push(
      kind === "umkm"
        ? "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_UMKM"
        : "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_GALERI",
    );
  }

  return missingKeys;
}

export async function uploadImageToCloudinary(
  file: File,
  kind: "umkm" | "galeri" | "berita",
) {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary cloud name belum diisi.");
  }

  const uploadPreset = getUploadPreset(kind);

  if (!uploadPreset) {
    throw new Error("Upload preset Cloudinary belum diisi.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Upload gambar ke Cloudinary gagal.");
  }

  const result = (await response.json()) as CloudinaryUploadResponse;

  return {
    imageUrl: result.secure_url,
    imagePublicId: result.public_id,
    fileName: file.name || result.original_filename,
  };
}
