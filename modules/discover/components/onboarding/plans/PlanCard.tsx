"use client";

type PlanCardProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
  cta?: string;
  onSelect?: () => void;
};

export function PlanCard({
  name,
  price,
  description,
  features,
  featured = false,
  cta = "Elegir plan",
  onSelect,
}: PlanCardProps) {
  return (
    <article
      className={[
        "relative overflow-hidden rounded-[26px] border p-5",
        featured
          ? "border-orange-400/60 bg-gradient-to-b from-[#15110d] to-[#0a0a0a] shadow-[0_24px_70px_rgba(249,115,22,.10)]"
          : "border-white/[0.10] bg-white/[0.025]",
      ].join(" ")}
    >
      {featured && (
        <div className="absolute left-5 top-0 -translate-y-1/2 rounded-full bg-orange-500 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-black">
          ★ Más elegido
        </div>
      )}

      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
            WOLF
          </p>

          <h3 className="mt-1 text-3xl font-black tracking-[-0.04em]">
            {name}
          </h3>

          <p className="mt-1 max-w-[190px] text-[10px] leading-4 text-white/40">
            {description}
          </p>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black tracking-[-0.05em]">
            {price}
          </span>
          <span className="ml-1 text-[9px] text-white/35">/ mes</span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/[0.08] text-[10px] text-orange-400">
              ✓
            </span>
            <span className="text-[10px] text-white/65">{feature}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onSelect}
        className={[
          "mt-6 h-12 w-full rounded-xl text-[13px] font-bold transition active:scale-[0.99]",
          featured
            ? "bg-orange-500 text-white shadow-[0_10px_30px_rgba(249,115,22,.22)] hover:bg-orange-400"
            : "border border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/[0.04]",
        ].join(" ")}
      >
        {cta}
        {featured && <span className="ml-2">→</span>}
      </button>
    </article>
  );
}