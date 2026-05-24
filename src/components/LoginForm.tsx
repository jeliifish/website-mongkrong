"use client";

import { startTransition, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import Button from "@/components/Button";
import { useAuth } from "@/components/AuthProvider";
import { auth, missingFirebaseConfigKeys } from "@/lib/firebase";

function getLoginErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Email atau password tidak cocok.";
      case "auth/invalid-email":
        return "Format email tidak valid.";
      case "auth/too-many-requests":
        return "Terlalu banyak percobaan login. Coba lagi beberapa saat.";
      default:
        return "Login gagal. Periksa kembali akun Firebase Anda.";
    }
  }

  return "Login gagal. Coba lagi.";
}

export default function LoginForm() {
  const router = useRouter();
  const { user, loading, isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      startTransition(() => {
        router.replace("/admin");
      });
    }
  }, [loading, router, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!auth || !isConfigured) {
      setErrorMessage(
        `Firebase belum lengkap. Isi: ${missingFirebaseConfigKeys.join(", ")}.`
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      startTransition(() => {
        router.replace("/admin");
      });
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(error));
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  }

  return (
    <>
      <form className="mt-14 max-w-[31rem]" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="admin@desamongkrong.id"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-14 w-full rounded-2xl border border-zinc-200 px-5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#1f7a4a] focus:ring-4 focus:ring-[#1f7a4a]/10"
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Masukkan kata sandi"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-14 w-full rounded-2xl border border-zinc-200 px-5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#1f7a4a] focus:ring-4 focus:ring-[#1f7a4a]/10"
          />
        </div>

        {errorMessage ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting || loading}
          className="mt-10 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Memproses..." : "Sign In"}
        </Button>
      </form>

      <div className="text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link href="/" className="font-semibold text-[#1f7a4a]">
          Hubungi admin utama
        </Link>
      </div>
    </>
  );
}
