"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import {
  fetchAdminProfiles,
  saveAdminProfile,
  deleteAdminProfile,
  createAuthUserOnClient,
  type AdminProfile,
} from "@/lib/admin-firestore";
import DeletePenggunaModal from "@/components/pengguna/DeletePenggunaModal";

export default function AdminPenggunaPage() {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminProfile | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<AdminProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Super Admin" | "Staff Admin">("Staff Admin");
  const [permissions, setPermissions] = useState({
    profil: false,
    galeri: false,
    umkm: false,
    berita: false,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load admins list
  async function loadAdmins() {
    setIsLoading(true);
    try {
      const data = await fetchAdminProfiles();
      setAdmins(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadAdmins();
  }, []);

  // Handle role change (auto check permissions if Super Admin)
  useEffect(() => {
    if (role === "Super Admin") {
      setPermissions({
        profil: true,
        galeri: true,
        umkm: true,
        berita: true,
      });
    }
  }, [role]);

  function handlePermissionChange(key: keyof typeof permissions) {
    if (role === "Super Admin") return; // cannot change if Super Admin
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setRole("Staff Admin");
    setPermissions({
      profil: false,
      galeri: false,
      umkm: false,
      berita: false,
    });
    setEditingAdmin(null);
    setFormError(null);
    setFormSuccess(null);
  }

  function handleCancel() {
    resetForm();
    setShowForm(false);
  }

  function handleEdit(admin: AdminProfile) {
    setEditingAdmin(admin);
    setName(admin.name);
    setEmail(admin.email);
    setPassword(""); // password cannot be read
    setRole(admin.role);
    setPermissions(admin.permissions);
    setFormError(null);
    setFormSuccess(null);
    setShowForm(true);
  }

  function handleDelete(admin: AdminProfile) {
    if (admin.uid === currentUser?.uid) {
      alert("Anda tidak bisa menghapus akun Anda sendiri.");
      return;
    }
    setDeletingAdmin(admin);
  }

  async function handleConfirmDelete(uid: string) {
    if (!deletingAdmin) return;
    setIsDeleting(true);
    try {
      await deleteAdminProfile(uid);
      setAdmins((prev) => prev.filter((a) => a.uid !== uid));
      setDeletingAdmin(null);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus admin.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    if (!name.trim()) {
      setFormError("Nama lengkap wajib diisi.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingAdmin) {
        // Mode Edit: update Firestore profile
        const updatedProfile: AdminProfile = {
          ...editingAdmin,
          name: name.trim(),
          role,
          permissions,
        };
        await saveAdminProfile(updatedProfile);
        setFormSuccess(`Profil admin ${name} berhasil diperbarui.`);
        await loadAdmins();
        setTimeout(() => {
          handleCancel();
        }, 1500);
      } else {
        // Mode Tambah Baru: buat user baru di Auth Firebase, kemudian catat profile di Firestore
        if (!email.trim() || !email.includes("@")) {
          setFormError("Alamat email tidak valid.");
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setFormError("Kata sandi minimal 6 karakter.");
          setIsSubmitting(false);
          return;
        }

        // 1. Buat User di Auth
        const newUid = await createAuthUserOnClient(email.trim(), password);

        // 2. Simpan di Firestore
        const newProfile: AdminProfile = {
          uid: newUid,
          name: name.trim(),
          email: email.trim(),
          role,
          permissions,
          createdAt: Date.now(),
        };
        await saveAdminProfile(newProfile);

        setFormSuccess(`Admin baru ${name} berhasil didaftarkan ke Firebase.`);
        await loadAdmins();
        setTimeout(() => {
          handleCancel();
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Build table columns
  const tableColumns = [
    { label: "Nama", className: "font-semibold" },
    { label: "Email / Peran", className: "font-semibold" },
    { label: "Izin Akses Modul", className: "font-semibold" },
    { label: "Aksi", className: "text-right font-semibold pr-4" },
  ];

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(admins.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedAdmins = admins.slice((activePage - 1) * pageSize, activePage * pageSize);

  // Build table rows
  const tableRows = paginatedAdmins.map((admin) => {
    // Format permissions list
    const activePerms: string[] = [];
    if (admin.role === "Super Admin") {
      activePerms.push("Semua Modul Terbuka");
    } else {
      if (admin.permissions.profil) activePerms.push("Profil Desa");
      if (admin.permissions.galeri) activePerms.push("Galeri");
      if (admin.permissions.umkm) activePerms.push("UMKM");
      if (admin.permissions.berita) activePerms.push("Berita");
    }

    const isSelf = admin.uid === currentUser?.uid;

    return {
      id: admin.uid,
      cells: [
        <div className="font-semibold text-zinc-900" key="name">
          {admin.name} {isSelf && <span className="text-xs text-emerald-600 font-normal">(Anda)</span>}
        </div>,
        <div key="email-role">
          <p className="text-zinc-500 text-xs">{admin.email}</p>
          <span
            className={`inline-block mt-1 text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded-full ${admin.role === "Super Admin"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-zinc-100 text-zinc-700"
              }`}
          >
            {admin.role}
          </span>
        </div>,
        <div className="flex flex-wrap gap-1.5" key="permissions">
          {activePerms.length === 0 ? (
            <span className="text-zinc-400 text-xs italic">Tidak ada akses modul</span>
          ) : (
            activePerms.map((perm) => (
              <span
                key={perm}
                className={`text-xs px-2 py-0.5 rounded border ${admin.role === "Super Admin"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-zinc-50 text-zinc-600 border-zinc-100"
                  }`}
              >
                {perm}
              </span>
            ))
          )}
        </div>,
      ],
      actions: [
        {
          label: "Edit Hak Akses",
          onClick: () => handleEdit(admin),
          disabled: isSelf,
        },
        {
          label: "Hapus Akses (Revoke)",
          tone: "danger" as const,
          onClick: () => handleDelete(admin),
          disabled: isSelf,
        },
      ],
    };
  });

  return (
    <div className="space-y-6">
      {/* Form Tambah/Edit Admin */}
      {showForm && (
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-950">
            {editingAdmin ? `Edit Akun Admin: ${editingAdmin.name}` : "Tambah Akun Admin Baru"}
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            {editingAdmin
              ? "Perbarui detail profil atau hak akses modul yang diizinkan untuk admin ini."
              : "Sistem akan mendaftarkan email & kata sandi baru ke Firebase Authentication sekaligus mencatat profil hak aksesnya ke Firestore."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-3">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Andi Pratama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  className="mt-2 h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-900 outline-none focus:border-[#1f7a4a] focus:ring-2 focus:ring-[#1f7a4a]/10 transition"
                />
              </div>

              {/* Alamat Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Alamat Email
                </label>
                <input
                  type="email"
                  placeholder="andi@mongkrong.desa.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!editingAdmin || isSubmitting}
                  className="mt-2 h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-900 outline-none focus:border-[#1f7a4a] focus:ring-2 focus:ring-[#1f7a4a]/10 transition disabled:bg-zinc-50 disabled:text-zinc-400"
                />
              </div>

              {/* Kata Sandi */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Kata Sandi (Min. 6 Karakter)
                </label>
                <input
                  type="password"
                  placeholder={editingAdmin ? "Sandi tidak dapat diubah di sini" : "Masukkan kata sandi..."}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!!editingAdmin || isSubmitting}
                  className="mt-2 h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-900 outline-none focus:border-[#1f7a4a] focus:ring-2 focus:ring-[#1f7a4a]/10 transition disabled:bg-zinc-50 disabled:text-zinc-400"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {/* Dropdown Peran (Role) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Peran (Role)
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "Super Admin" | "Staff Admin")}
                  disabled={isSubmitting}
                  className="mt-2 h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-900 outline-none focus:border-[#1f7a4a] focus:ring-2 focus:ring-[#1f7a4a]/10 transition bg-white"
                >
                  <option value="Staff Admin">Staff Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              {/* Checkbox Hak Akses Modul */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Hak Akses Modul
                </label>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {/* Kelola Profil Desa */}
                  <label
                    className={`flex items-center gap-3 rounded-xl border border-zinc-200 p-3.5 text-sm font-semibold select-none cursor-pointer transition ${role === "Super Admin"
                      ? "bg-zinc-50 border-zinc-200 text-zinc-400 cursor-not-allowed"
                      : permissions.profil
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={permissions.profil}
                      onChange={() => handlePermissionChange("profil")}
                      disabled={role === "Super Admin" || isSubmitting}
                      className="h-4.5 w-4.5 accent-emerald-700 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span>Kelola Profil Desa</span>
                  </label>

                  {/* Kelola Galeri */}
                  <label
                    className={`flex items-center gap-3 rounded-xl border border-zinc-200 p-3.5 text-sm font-semibold select-none cursor-pointer transition ${role === "Super Admin"
                      ? "bg-zinc-50 border-zinc-200 text-zinc-400 cursor-not-allowed"
                      : permissions.galeri
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={permissions.galeri}
                      onChange={() => handlePermissionChange("galeri")}
                      disabled={role === "Super Admin" || isSubmitting}
                      className="h-4.5 w-4.5 accent-emerald-700 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span>Kelola Galeri</span>
                  </label>

                  {/* Kelola UMKM */}
                  <label
                    className={`flex items-center gap-3 rounded-xl border border-zinc-200 p-3.5 text-sm font-semibold select-none cursor-pointer transition ${role === "Super Admin"
                      ? "bg-zinc-50 border-zinc-200 text-zinc-400 cursor-not-allowed"
                      : permissions.umkm
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={permissions.umkm}
                      onChange={() => handlePermissionChange("umkm")}
                      disabled={role === "Super Admin" || isSubmitting}
                      className="h-4.5 w-4.5 accent-emerald-700 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span>Kelola UMKM</span>
                  </label>

                  {/* Kelola Berita */}
                  <label
                    className={`flex items-center gap-3 rounded-xl border border-zinc-200 p-3.5 text-sm font-semibold select-none cursor-pointer transition ${role === "Super Admin"
                      ? "bg-zinc-50 border-zinc-200 text-zinc-400 cursor-not-allowed"
                      : permissions.berita
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={permissions.berita}
                      onChange={() => handlePermissionChange("berita")}
                      disabled={role === "Super Admin" || isSubmitting}
                      className="h-4.5 w-4.5 accent-emerald-700 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span>Kelola Berita</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Form Messages */}
            {formError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 animate-pulse">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                {formSuccess}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="h-11 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-60 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-11 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white shadow-md hover:bg-emerald-800 transition disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? "Memproses..." : "Simpan Profil"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Tabel Daftar Pengguna */}
      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-bold text-zinc-950">
            Daftar Administrator Terdaftar
          </h3>
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#1f7a4a_0%,#39a86c_100%)] px-5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4.5 w-4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="16" y1="11" x2="22" y2="11" />
              </svg>
              Tambah Profil Pengguna
            </button>
          )}
        </div>
        <Table
          columns={tableColumns}
          rows={tableRows}
          gridTemplate="1.2fr 1.5fr 2fr 5rem"
          emptyMessage={isLoading ? "Memuat data admin..." : "Belum ada admin terdaftar."}
        />
        {admins.length > 0 && (
          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            totalItems={admins.length}
            pageSize={pageSize}
            pageSizeOptions={[5, 10, 25, 50]}
            itemLabel="pengguna"
            onPageChange={(page) => setCurrentPage(Math.min(Math.max(page, 1), totalPages))}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </section>

      <DeletePenggunaModal
        admin={deletingAdmin}
        isOpen={deletingAdmin !== null}
        onClose={() => setDeletingAdmin(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
