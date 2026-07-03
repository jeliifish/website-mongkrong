import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublicPemetaanDetail from "@/components/pemetaan/PublicPemetaanDetail";
import { getPemetaanItem } from "@/lib/pemetaan";

type PemetaanDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PemetaanDetailPage({
  params,
}: PemetaanDetailPageProps) {
  const { slug } = await params;
  const item = getPemetaanItem(slug);

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <Header variant="solid" />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        <PublicPemetaanDetail item={item} />
      </main>

      <Footer />
    </div>
  );
}
