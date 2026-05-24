import GaleriSection from "@/components/galeri/GaleriSection";
import { getFallbackGaleriItems } from "@/lib/galeri-public";

export default function AdminGaleriPage() {
  return <GaleriSection items={getFallbackGaleriItems()} />;
}
