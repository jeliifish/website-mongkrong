import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublicUmkmDetail from "@/components/umkm/PublicUmkmDetail";
import { getFallbackUmkmItem } from "@/lib/umkm-public";

type UmkmDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UmkmDetailPage({ params }: UmkmDetailPageProps) {
  const { id } = await params;
  const fallbackItem = getFallbackUmkmItem(id);

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <Header variant="solid" />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        <PublicUmkmDetail id={id} fallbackItem={fallbackItem} />
      </main>

      <Footer />
    </div>
  );
}
