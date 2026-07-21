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
  const [showPassword, setShowPassword] = useState(false);
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
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-14 w-full rounded-2xl border border-zinc-200 pl-5 pr-12 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#1f7a4a] focus:ring-4 focus:ring-[#1f7a4a]/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition cursor-pointer p-1"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a9.98 9.98 0 014.122-.963c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21f-3.95-3.95M3 3l18 18" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
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

    </>
  );
}
