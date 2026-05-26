"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/contract", label: "合同审查" },
  { href: "/labor", label: "劳动合规" },
  { href: "/ip", label: "知产预警" },
];

function LogoIcon() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_2px_4px_rgba(201,169,110,0.4)]"
    >
      <rect x="1" y="1" width="40" height="40" rx="10" stroke="#C9A96E" strokeWidth="2" />
      <path d="M21 8L21 28" stroke="#C9A96E" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 16H32" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 30L21 21L31 30" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="14" r="3" fill="#C9A96E" />
      <circle cx="31" cy="14" r="3" fill="#C9A96E" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className="relative bg-gradient-to-r from-primary via-primary to-[#152B47] shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-gold/20 blur-md transition-all group-hover:bg-gold/30" />
            <LogoIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-[28px] font-extrabold leading-tight tracking-wide text-white">
              法<span className="text-gold">鉴</span>
            </span>
            <span className="text-[8px] sm:text-[10px] font-medium tracking-[0.2em] text-gold/80">
              AI 法律智能助手
            </span>
          </div>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 xl:px-5 ${
                      isActive
                        ? "bg-gold text-primary shadow-[0_2px_8px_rgba(201,169,110,0.3)]"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors md:hidden"
          aria-label="菜单"
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-primary/95 backdrop-blur md:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-3">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={`block rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-gold text-primary"
                          : "text-white/90 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}