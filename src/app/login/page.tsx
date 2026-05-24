import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#eef4ee] text-zinc-900">
      <main className="grid min-h-screen w-full lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex min-h-screen flex-col justify-between bg-white px-7 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-12">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-sm font-medium text-zinc-500 transition hover:text-emerald-700"
            >
              <span
                aria-hidden="true"
                className="relative h-9 w-9 rounded-full border border-zinc-200"
              >
                <span className="absolute left-[0.95rem] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-current" />
              </span>
              Kembali ke beranda
            </Link>
          </div>

          <div className="max-w-[31rem] py-10 lg:py-0">
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight text-zinc-950 sm:text-6xl">
              Sugeng Rawuh,
              <br />
              Mlebet
            </h1>
            <p className="mt-6 max-w-[27rem] text-lg leading-8 text-zinc-500">
              Masuk ke panel admin untuk mengelola berita, galeri, profil, dan
              data UMKM desa.
            </p>

            <LoginForm />
          </div>

          <div />
        </section>

        <section className="relative hidden min-h-screen overflow-hidden bg-[linear-gradient(145deg,#8ebc8f_0%,#1f7a4a_100%)] lg:block">
          <div className="absolute -left-10 top-6 h-40 w-64 rounded-[999px] bg-white" />
          <div className="absolute left-32 top-12 h-[6.5rem] w-[5.5rem] rounded-[999px] bg-white" />
          <div className="absolute right-[-4.5rem] top-3 h-56 w-52 rounded-[999px] bg-white" />
          <div className="absolute right-28 top-[8.5rem] h-[5.5rem] w-28 rounded-[999px] bg-white" />
          <div className="absolute bottom-[-4.5rem] left-[-2rem] h-36 w-80 rounded-[999px] bg-white" />
          <div className="absolute bottom-16 right-14 h-24 w-64 rounded-[999px] bg-white" />

          <div className="absolute left-20 top-48 rounded-[2rem] bg-white px-7 py-5 shadow-[12px_14px_0_rgba(27,23,76,0.75)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffffff_0%,#f7e9ff_100%)]">
              <span className="block h-7 w-4 rotate-[40deg] border-b-[7px] border-r-[7px] border-[#1f7a4a]" />
            </div>
          </div>

          <div className="absolute right-14 top-[20.5rem] rounded-[2rem] bg-white px-8 py-7 shadow-[14px_16px_0_rgba(27,23,76,0.75)]">
            <div className="relative h-28 w-24 rounded-[1.75rem] border-[10px] border-[#25205d] bg-white">
              <div className="absolute left-1/2 top-[-1.3rem] h-8 w-10 -translate-x-1/2 rounded-b-full bg-[#25205d]" />
              <div className="absolute inset-x-4 bottom-5 h-10 rounded-2xl bg-[linear-gradient(135deg,#78b485_0%,#1f7a4a_100%)]" />
            </div>
          </div>

          <div className="absolute left-[22%] top-[22%] h-[29rem] w-[18.5rem] rotate-[8deg] rounded-[3.2rem] border-[12px] border-[#1b3d2c] bg-[linear-gradient(180deg,#9ad29d_0%,#47a266_100%)] shadow-[20px_24px_0_rgba(21,52,38,0.55)]">
            <div className="absolute left-1/2 top-4 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#1b3d2c]" />
            <div className="absolute inset-x-9 top-24 rounded-[2.5rem] border-4 border-white/80 p-7">
              <div className="grid grid-cols-3 gap-3">
                <span className="h-7 rounded-full border-4 border-white/85" />
                <span className="h-7 rounded-full border-4 border-white/85" />
                <span className="h-7 rounded-full border-4 border-white/85" />
                <span className="h-7 rounded-full border-4 border-white/85" />
                <span className="h-7 rounded-full border-4 border-white/85" />
                <span className="h-7 rounded-full border-4 border-white/85" />
                <span className="h-7 rounded-full border-4 border-white/85" />
                <span className="h-7 rounded-full border-4 border-white/85" />
                <span className="h-7 rounded-full border-4 border-white/85" />
              </div>
            </div>
            <div className="absolute inset-x-16 bottom-[6.5rem] h-3 rounded-full bg-white/85" />
            <p className="absolute inset-x-0 bottom-14 text-center text-xs font-medium text-white/75">
              Tap untuk masuk ke dashboard admin
            </p>
          </div>

          <div className="absolute bottom-10 left-24 h-56 w-44 -rotate-[10deg]">
            <div className="absolute bottom-0 left-10 h-36 w-16 rounded-t-[2rem] rounded-b-[1rem] bg-white" />
            <div className="absolute bottom-0 left-24 h-38 w-16 rounded-t-[2rem] rounded-b-[1rem] bg-white" />
            <div className="absolute bottom-[7.5rem] left-0 h-20 w-28 rounded-t-[3rem] rounded-b-[2rem] bg-[#f4a340]" />
            <div className="absolute bottom-[7rem] left-20 h-16 w-14 rounded-full bg-[#f0b8a0]" />
            <div className="absolute bottom-[7rem] left-12 h-5 w-16 rounded-full bg-[#f0b8a0]" />
            <div className="absolute bottom-[12rem] left-[4.5rem] h-10 w-12 rounded-full bg-[#214834]" />
            <div className="absolute bottom-[4rem] left-8 h-5 w-20 rounded-full bg-[#214834]" />
            <div className="absolute bottom-[4rem] left-24 h-5 w-20 rounded-full bg-[#214834]" />
          </div>
        </section>
      </main>
    </div>
  );
}
