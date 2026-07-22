import { fetchBeritaItems } from "@/lib/berita-firestore";
import { isFirebaseConfigured, missingFirebaseConfigKeys } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export default async function DebugBeritaPage() {
  let items: any[] = [];
  let errorMsg: string | null = null;

  try {
    if (isFirebaseConfigured) {
      items = await fetchBeritaItems();
    }
  } catch (err: any) {
    errorMsg = err.message || String(err);
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Debug Berita Page</h1>
      <p>isFirebaseConfigured: {String(isFirebaseConfigured)}</p>
      <p>missingKeys: {JSON.stringify(missingFirebaseConfigKeys)}</p>
      <p>Error message: {errorMsg || "None"}</p>
      <p>Items count: {items.length}</p>
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>
            <strong>{item.title}</strong> - Status: {item.status} - Date: {item.date} - ID: {item.id}
          </li>
        ))}
      </ul>
    </div>
  );
}
