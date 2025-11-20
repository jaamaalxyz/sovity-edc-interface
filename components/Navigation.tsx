"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiDatabase, FiShield } from "react-icons/fi";
import { MdLink } from "react-icons/md";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/assets", label: "Assets", icon: FiDatabase },
    { href: "/policies", label: "Policies", icon: FiShield },
    { href: "/contracts", label: "Contracts", icon: MdLink },
  ];

  return (
    <nav
      className="border-b border-gray-200 bg-white shadow-sm"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="flex size-8 items-center justify-center rounded-lg bg-primary-600"
              aria-hidden="true"
            >
              <span className="text-lg font-bold text-white">S</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Sovity EDC
            </span>
          </Link>

          <div className="flex items-center gap-1" role="navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors",
                    {
                      "bg-primary-50 text-primary-700": isActive,
                      "text-gray-600 hover:bg-gray-100": !isActive,
                    }
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
