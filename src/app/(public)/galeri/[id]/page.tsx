import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublicGaleriDetail from "@/components/galeri/PublicGaleriDetail";
import { getFallbackGaleriItem } from "@/lib/galeri-public";

type GaleriDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GaleriDetailPage({
  params,
}: GaleriDetailPageProps) {
  const { id } = await params;
  const fallbackItem = getFallbackGaleriItem(id);

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <Header variant="solid" />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        <PublicGaleriDetail id={id} fallbackItem={fallbackItem} />
      </main>

      <Footer />
    </div>
  );
}
