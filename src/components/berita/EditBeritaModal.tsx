"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Button from "@/components/Button";
import ModalPortal from "@/components/ModalPortal";
import type { BeritaItem } from "@/types/berita";

type EditBeritaModalProps = {
  berita: BeritaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (berita: BeritaItem & { file?: File | null }) => void;
};

export default function EditBeritaModal({
  berita,
  isOpen,
  onClose,
  onSave,
}: EditBeritaModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !berita) {
    return null;
  }

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/60 p-4 sm:p-6 backdrop-blur-sm">
        <button
          type="button"
          aria-label="Tutup modal"
          className="fixed inset-0 cursor-default"
          onClick={onClose}
        />

        <EditBeritaForm key={berita.id} berita={berita} onClose={onClose} onSave={onSave} />
      </div>
    </ModalPortal>
  );
}

function EditBeritaForm({
  berita,
  onClose,
  onSave,
}: {
  berita: BeritaItem;
  onClose: () => void;
  onSave: (berita: BeritaItem & { file?: File | null }) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(berita.title);
  const [slug, setSlug] = useState("");
  const [contentHtml, setContentHtml] = useState(() => {
    // Convert content array to HTML for the editor
    if (berita.content && berita.content.length > 0) {
      return berita.content.map((p) => {
        // If it already contains HTML tags, use as-is
        if (/<[a-z][\s\S]*>/i.test(p)) {
          return p;
        }
        return `<p>${p}</p>`;
      }).join("");
    }
    return `<p>${berita.description}</p>`;
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPublished, setIsPublished] = useState(berita.status === "Published");

  // Auto-generate slug when title changes
  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setSlug(generatedSlug);
  }, [title]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] ?? null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !contentHtml.trim() || contentHtml === "<p><br></p>") {
      return;
    }

    // Extract text description from HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = contentHtml;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    const description = plainText.slice(0, 160).trim();

    // Map HTML to string[] paragraphs
    const paragraphs = Array.from(tempDiv.childNodes)
      .map((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          return (node as HTMLElement).outerHTML;
        }
        return node.textContent || "";
      })
      .map((p) => p.trim())
      .filter(Boolean);

    onSave({
      ...berita,
      title: title.trim(),
      description,
      content: paragraphs.length > 0 ? paragraphs : [contentHtml],
      file: selectedFile,
      status: isPublished ? "Published" : "Draft",
    });
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 flex max-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col overflow-hidden border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
    >
      <div className="flex items-center justify-between border-b border-zinc-200 px-8 py-5">
        <h2 className="text-xl font-bold text-zinc-950">
          Edit Artikel Berita
        </h2>
        <CloseButton onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
        {/* Row 1: Judul Berita & Slug */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="JUDUL BERITA">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kerja Bakti Massal Sambeng..."
              required
              className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
            />
          </Field>

          <Field label="SLUG URL (OTOMATIS)">
            <input
              type="text"
              value={slug}
              readOnly
              placeholder="kerja-bakti-massal-sambeng"
              className="h-12 w-full rounded-xl border border-zinc-100 bg-zinc-50 px-4 text-sm text-zinc-400 outline-none"
            />
          </Field>
        </div>

        {/* Row 2: Unggah Foto */}
        <div className="space-y-2">
          <span className="block text-[0.72rem] font-bold uppercase tracking-[0.2em] text-zinc-400">
            UNGGAH FOTO BERITA
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center gap-3 mt-2">
            {berita.imageUrl && !selectedFile && (
              <div
                className="h-10 w-10 shrink-0 rounded-lg border border-zinc-200 bg-cover bg-center"
                style={{ backgroundImage: `url(${berita.imageUrl})` }}
              />
            )}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 cursor-pointer"
            >
              Choose File
            </button>
            <span className="text-xs text-zinc-500 truncate max-w-[300px]">
              {selectedFile ? selectedFile.name : (berita.fileName || "No file chosen")}
            </span>
          </div>
        </div>

        {/* Row 3: Isi Konten Berita (Rich Text Editor) */}
        <Field label="ISI KONTEN BERITA">
          <RichTextEditor value={contentHtml} onChange={setContentHtml} placeholder="Ketik konten artikel secara lengkap di sini..." />
        </Field>

        {/* Checkbox Terbitkan sekarang */}
        <label className="flex items-center gap-3 select-none cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4.5 w-4.5 accent-emerald-700 cursor-pointer"
          />
          <span className="text-sm font-semibold text-zinc-700">
            Terbitkan sekarang (Dapat dibaca oleh publik)
          </span>
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 px-8 py-5 sm:flex-row sm:justify-end">
        <CancelButton onClick={onClose} />
        <Button type="submit" className="h-12 px-8 shadow-none hover:translate-y-0 cursor-pointer">
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "<p><br></p>";
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, cmdValue = "") => {
    document.execCommand(command, false, cmdValue);
    handleInput();
  };

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white focus-within:border-emerald-500 overflow-hidden transition">
      <style dangerouslySetInnerHTML={{__html: `
        .rich-text-editor-body ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin: 0.5rem 0 !important; }
        .rich-text-editor-body ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin: 0.5rem 0 !important; }
        .rich-text-editor-body p { margin-bottom: 0.5rem !important; }
        .rich-text-editor-body:empty::before { content: attr(data-placeholder); color: #a1a1aa; }
      `}} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-zinc-50/50 px-3 py-2 text-zinc-500">
        <button
          type="button"
          onClick={() => executeCommand("bold")}
          className="h-8 w-8 rounded font-bold hover:bg-zinc-200 hover:text-zinc-900 transition flex items-center justify-center text-sm cursor-pointer"
          title="Tebal"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => executeCommand("italic")}
          className="h-8 w-8 rounded italic hover:bg-zinc-200 hover:text-zinc-900 transition flex items-center justify-center text-sm cursor-pointer"
          title="Miring"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => executeCommand("underline")}
          className="h-8 w-8 rounded underline hover:bg-zinc-200 hover:text-zinc-900 transition flex items-center justify-center text-sm cursor-pointer"
          title="Garis Bawah"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => executeCommand("strikeThrough")}
          className="h-8 w-8 rounded line-through hover:bg-zinc-200 hover:text-zinc-900 transition flex items-center justify-center text-sm cursor-pointer"
          title="Coret"
        >
          S
        </button>
        <div className="h-4 w-[1px] bg-zinc-200 mx-1" />
        <button
          type="button"
          onClick={() => executeCommand("insertUnorderedList")}
          className="h-8 w-8 rounded hover:bg-zinc-200 hover:text-zinc-900 transition flex items-center justify-center cursor-pointer"
          title="Daftar Bullet"
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="9" y1="6" x2="20" y2="6" />
            <line x1="9" y1="12" x2="20" y2="12" />
            <line x1="9" y1="18" x2="20" y2="18" />
            <circle cx="4.5" cy="6" r="1" fill="currentColor" />
            <circle cx="4.5" cy="12" r="1" fill="currentColor" />
            <circle cx="4.5" cy="18" r="1" fill="currentColor" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => executeCommand("insertOrderedList")}
          className="h-8 w-8 rounded hover:bg-zinc-200 hover:text-zinc-900 transition flex items-center justify-center cursor-pointer"
          title="Daftar Angka"
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="10" y1="6" x2="21" y2="6" />
            <line x1="10" y1="12" x2="21" y2="12" />
            <line x1="10" y1="18" x2="21" y2="18" />
            <path d="M4 4h1.5v4h-1.5M4 8h3" strokeWidth="2.2" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => executeCommand("removeFormat")}
          className="h-8 w-8 rounded hover:bg-zinc-200 hover:text-zinc-900 transition flex items-center justify-center cursor-pointer text-xs font-bold"
          title="Hapus Format"
        >
          Tₓ
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        className="w-full min-h-[200px] max-h-[300px] overflow-y-auto p-4 text-sm leading-relaxed text-zinc-800 outline-none rich-text-editor-body"
      />
    </div>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <div className="block space-y-2">
      <span className="block text-[0.72rem] font-bold uppercase tracking-[0.2em] text-zinc-400">
        {label}
      </span>
      {children}
    </div>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-600 cursor-pointer"
    >
      <span className="sr-only">Tutup</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M6 6 18 18" />
        <path d="M18 6 6 18" />
      </svg>
    </button>
  );
}

function CancelButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 px-6 text-sm font-semibold text-zinc-500 transition hover:bg-zinc-50 cursor-pointer"
    >
      Batal
    </button>
  );
}
