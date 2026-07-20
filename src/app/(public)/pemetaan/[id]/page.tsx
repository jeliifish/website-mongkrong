import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublicPemetaanDetail from "@/components/pemetaan/PublicPemetaanDetail";
import { getPemetaanItem } from "@/lib/pemetaan";
import { fetchLahanItems, fetchTanamanItems } from "@/lib/lahan";

type PemetaanDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PemetaanDetailPage({
  params,
}: PemetaanDetailPageProps) {
  const { id } = await params;
  const item = getPemetaanItem(id);
  const lahanItems = await fetchLahanItems();
  const tanamanItems = await fetchTanamanItems();

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <Header variant="solid" />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        <PublicPemetaanDetail item={item} lahanItems={lahanItems} tanamanItems={tanamanItems} />
      </main>

      <Footer />
    </div>
  );
}
