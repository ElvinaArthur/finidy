"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, LayoutDashboard, ShieldCheck, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Logo from "./Logo";
import MegaMenu from "./MegaMenu";
import SearchBar from "@/components/shared/SearchBar";
import { PILIERS } from "@/lib/piliers";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openPilier, setOpenPilier] = useState<string | null>(null);
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const togglePilier = (id: string) =>
    setOpenPilier((prev) => (prev === id ? null : id));

  return (
    <header
      className="sticky top-0 z-50 bg-nihary-ecru/95 backdrop-blur-sm
      border-b border-nihary-sable-fonce shadow-nihary-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="sm" />
          <MegaMenu />

          <div className="flex items-center gap-2 sm:gap-3">
            {session ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
                  className="flex items-center gap-2 px-3 py-2 rounded-nihary hover:bg-nihary-sable transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-nihary-or flex items-center justify-center text-white text-xs font-mono font-bold">
                    {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="text-sm font-body text-nihary-brun max-w-24 truncate">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-nihary-sable-fonce rounded-lg shadow-nihary-lg z-50 overflow-hidden">
                    <div className="p-3 border-b border-nihary-sable-fonce">
                      <p className="text-xs font-mono text-nihary-gris truncate">{session.user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-body text-nihary-brun hover:bg-nihary-sable hover:text-nihary-or transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={15} strokeWidth={1.75} />
                        Mon espace
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-body text-nihary-brun hover:bg-nihary-sable hover:text-nihary-or transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <ShieldCheck size={15} strokeWidth={1.75} />
                          Administration
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-body text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} strokeWidth={1.75} />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/connexion" className="btn-outline hidden md:inline-flex">
                  Connexion
                </Link>
                <Link href="/auth/inscription" className="btn-primary hidden md:inline-flex">
                  Publier
                </Link>
              </>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 rounded-nihary text-nihary-brun hover:bg-nihary-sable"
            >
              {mobileOpen ? (
                <X size={20} strokeWidth={1.75} />
              ) : (
                <Menu size={20} strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>

        <div className="pb-3">
          <SearchBar className="max-w-xl" />
        </div>
      </div>

      {mobileOpen && (
        <div className="xl:hidden border-t border-nihary-sable-fonce bg-white">
          <nav className="px-4 py-3 space-y-0.5">
            {PILIERS.map((pilier) => {
              const Icon = pilier.icon;
              const isOpen = openPilier === pilier.id;
              const hasSubs = pilier.sousLiens && pilier.sousLiens.length > 0;
              return (
                <div key={pilier.id}>
                  <div className="flex items-center">
                    <Link
                      href={pilier.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 flex-1 px-3 py-2.5 text-sm font-body
                        font-medium text-nihary-brun hover:bg-nihary-sable hover:text-nihary-or
                        rounded-nihary transition-colors"
                    >
                      <Icon size={17} strokeWidth={1.75} className="text-nihary-or flex-shrink-0" />
                      {pilier.label}
                    </Link>
                    {hasSubs && (
                      <button
                        onClick={() => togglePilier(pilier.id)}
                        className="p-2 rounded-nihary text-nihary-gris hover:bg-nihary-sable
                          hover:text-nihary-or transition-colors"
                        aria-label={isOpen ? "Réduire" : "Développer"}
                      >
                        <ChevronDown
                          size={15}
                          strokeWidth={2}
                          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {hasSubs && isOpen && (
                    <div className="ml-9 mb-1 border-l-2 border-nihary-sable-fonce pl-3 space-y-0.5">
                      {pilier.sousLiens!.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => { setMobileOpen(false); setOpenPilier(null); }}
                          className="block px-2 py-1.5 text-sm font-body text-nihary-gris
                            hover:text-nihary-or transition-colors rounded"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-3 pb-1 border-t border-nihary-sable-fonce mt-2">
              {session ? (
                <div className="space-y-0.5">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-body text-nihary-brun
                      hover:bg-nihary-sable hover:text-nihary-or rounded-nihary transition-colors"
                  >
                    <LayoutDashboard size={17} strokeWidth={1.75} />
                    Mon espace
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-body text-nihary-brun
                        hover:bg-nihary-sable hover:text-nihary-or rounded-nihary transition-colors"
                    >
                      <ShieldCheck size={17} strokeWidth={1.75} />
                      Administration
                    </Link>
                  )}
                  <button
                    onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-body text-red-600
                      hover:bg-red-50 rounded-nihary transition-colors"
                  >
                    <LogOut size={17} strokeWidth={1.75} />
                    Se déconnecter
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 pt-1">
                  <Link
                    href="/auth/connexion"
                    className="btn-outline flex-1 justify-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/inscription"
                    className="btn-primary flex-1 justify-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Publier
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
