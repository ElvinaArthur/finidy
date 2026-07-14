import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface PilierCardProps {
  icon: LucideIcon;
  titre: string;
  description: string;
  href: string;
  count?: number;
  countLabel?: string;
}

export default function PilierCard({
  icon: Icon,
  titre,
  description,
  href,
  count,
  countLabel,
}: PilierCardProps) {
  return (
    <Link
      href={href}
      className="card p-6 flex flex-col gap-3 group cursor-pointer"
    >
      <div
        className="w-11 h-11 rounded-nihary bg-nihary-or-pale flex items-center justify-center
        text-nihary-ambre group-hover:bg-nihary-or group-hover:text-white transition-colors duration-200"
      >
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <div>
        <h3
          className="font-display font-semibold text-lg text-nihary-ambre-fonce
          group-hover:text-nihary-or transition-colors"
        >
          {titre}
        </h3>
        <p className="text-sm text-nihary-gris font-body mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      {count !== undefined && (
        <div className="mt-auto pt-3 border-t border-nihary-sable-fonce flex items-center gap-1.5">
          <span className="font-display font-bold text-nihary-or">{count}</span>
          <span className="text-xs font-mono text-nihary-gris-clair uppercase tracking-wider">
            {countLabel}
          </span>
        </div>
      )}
    </Link>
  );
}
