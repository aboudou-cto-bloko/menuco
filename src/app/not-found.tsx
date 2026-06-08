import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: "#0f0705", color: "#f6ded3" }}>
      {/* Logo */}
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-lg"
        style={{ backgroundColor: "#f97316" }}>
        <span className="text-white font-black text-2xl">M</span>
      </div>

      {/* 404 */}
      <p className="text-7xl font-black tabular-nums mb-4" style={{ color: "#f97316", lineHeight: 1 }}>404</p>
      <h1 className="text-xl font-semibold mb-2">Menu introuvable</h1>
      <p className="text-sm max-w-xs leading-relaxed mb-8" style={{ color: "rgba(246,222,211,0.5)" }}>
        Ce menu n&apos;existe pas ou a été désactivé. Vérifiez l&apos;adresse avec votre restaurant.
      </p>

      {/* CTA */}
      <Link href="/"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80"
        style={{ backgroundColor: "#1a0f0a", border: "1px solid #3d2418", color: "#f6ded3" }}>
        ← Retour à l&apos;accueil
      </Link>

      <p className="mt-12 text-[10px]" style={{ color: "rgba(246,222,211,0.2)" }}>
        Propulsé par MenuCo
      </p>
    </div>
  );
}
