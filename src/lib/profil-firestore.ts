import { doc, getDoc, getDocs, collection, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

export type ProfilItem = {
  id: string;
  title: string;
  description: string;
};

export type LogoConfig = {
  imageUrl: string;
  imagePublicId?: string;
  fileName?: string;
};

const LOCAL_LOGO_KEY = "mongkrong_logo_config";

function getLocalLogoConfig(): LogoConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(LOCAL_LOGO_KEY);
    return data ? (JSON.parse(data) as LogoConfig) : null;
  } catch {
    return null;
  }
}

function saveLocalLogoConfig(config: LogoConfig | null) {
  if (typeof window === "undefined") return;
  try {
    if (config) {
      localStorage.setItem(LOCAL_LOGO_KEY, JSON.stringify(config));
    } else {
      localStorage.removeItem(LOCAL_LOGO_KEY);
    }
  } catch (err) {
    console.error("Gagal menyimpan logo ke localStorage:", err);
  }
}

export const fallbackProfilItems: ProfilItem[] = [
  {
    id: "sekilas",
    title: "Sekilas Tentang Mongkrong",
    description:
      "Padukuhan Mongkrong terletak di Kalurahan Sampang, Kapanewon Gedangsari, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta. Dikenal dengan keasrian alam dan kearifan lokalnya, Padukuhan Mongkrong berkomitmen untuk memajukan kesejahteraan warganya melalui pemberdayaan ekonomi kreatif, pertanian, serta pemanfaatan teknologi informasi untuk pelayanan desa yang transparan dan akuntabel. Warga Mongkrong menjunjung tinggi nilai gotong royong dan kebersamaan dalam kehidupan sehari-hari.",
  },
];

export async function fetchProfilItems(): Promise<ProfilItem[]> {
  if (!db || !isFirebaseConfigured) {
    return fallbackProfilItems;
  }

  try {
    const querySnapshot = await getDocs(collection(db, "profil"));
    if (querySnapshot.empty) {
      await Promise.all(
        fallbackProfilItems.map((item) =>
          setDoc(doc(db!, "profil", item.id), {
            title: item.title,
            description: item.description,
            updatedAt: Date.now(),
          })
        )
      );
      return fallbackProfilItems;
    }

    const items: ProfilItem[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.id === "sekilas") {
        const data = doc.data();
        items.push({
          id: doc.id,
          title: data.title || "",
          description: data.description || "",
        });
      }
    });

    if (items.length === 0) {
      await setDoc(doc(db, "profil", "sekilas"), {
        title: fallbackProfilItems[0].title,
        description: fallbackProfilItems[0].description,
        updatedAt: Date.now(),
      });
      return fallbackProfilItems;
    }

    return items;
  } catch (error) {
    console.error("Gagal memuat profil dari Firestore:", error);
    return fallbackProfilItems;
  }
}

export async function updateProfilItem(item: ProfilItem): Promise<ProfilItem> {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi di project ini.");
  }

  const docRef = doc(db, "profil", item.id);
  const payload = {
    title: item.title.trim(),
    description: item.description.trim(),
    updatedAt: Date.now(),
  };

  await setDoc(docRef, payload, { merge: true });

  return {
    id: item.id,
    ...payload,
  };
}

export async function fetchLogoConfig(): Promise<LogoConfig | null> {
  const localConfig = getLocalLogoConfig();
  if (!db || !isFirebaseConfigured) {
    return localConfig;
  }
  try {
    const docSnap = await getDoc(doc(db, "profil", "logo"));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.imageUrl) {
        const conf = {
          imageUrl: data.imageUrl,
          imagePublicId: data.imagePublicId || "",
          fileName: data.fileName || "",
        };
        saveLocalLogoConfig(conf);
        return conf;
      }
    }
    return localConfig;
  } catch (error) {
    console.error("Gagal memuat logo config dari Firestore:", error);
    return localConfig;
  }
}

export async function updateLogoConfig(config: LogoConfig): Promise<void> {
  saveLocalLogoConfig(config);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("logoUpdated", { detail: config.imageUrl })
    );
  }

  if (db && isFirebaseConfigured) {
    try {
      const docRef = doc(db, "profil", "logo");
      await setDoc(docRef, {
        imageUrl: config.imageUrl,
        imagePublicId: config.imagePublicId || "",
        fileName: config.fileName || "",
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.warn("Gagal update logo ke Firestore:", error);
    }
  }
}

export async function deleteLogoConfig(): Promise<void> {
  saveLocalLogoConfig(null);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("logoUpdated", { detail: null }));
  }

  if (db && isFirebaseConfigured) {
    try {
      const docRef = doc(db, "profil", "logo");
      await setDoc(docRef, {
        imageUrl: "",
        imagePublicId: "",
        fileName: "",
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.warn("Gagal hapus logo dari Firestore:", error);
    }
  }
}
