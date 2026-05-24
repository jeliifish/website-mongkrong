import UmkmTableSection from "@/components/umkm/UmkmTableSection";
import { getFallbackUmkmItems } from "@/lib/umkm-public";

export default function AdminUmkmPage() {
  return <UmkmTableSection items={getFallbackUmkmItems()} />;
}
