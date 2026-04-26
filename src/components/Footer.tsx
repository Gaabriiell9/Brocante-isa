const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Brocante d'Isabella";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-800/10 mt-24">
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 py-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-500">
          {SITE_NAME.toUpperCase()} — © {year}
        </p>
      </div>
    </footer>
  );
}
