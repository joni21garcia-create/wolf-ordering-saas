"use client";

import Link from "next/link";
import { Heart, Home, MapPin, Package, Search } from "lucide-react";
import { useState } from "react";
import AddressesSheet from "@/modules/discover/components/addresses/AddressesSheet";
import OrdersSheet from "@/modules/discover/components/orders/OrdersSheet";
import FavoritesSheet from "@/modules/discover/components/favorites/FavoritesSheet";

interface DiscoverBottomNavProps {
  active?: "home" | "search" | "favorites" | "orders" | "addresses";
  onSearchClick?: () => void;
}

interface NavItem {
  id: NonNullable<DiscoverBottomNavProps["active"]>;
  label: string;
  href: string;
  icon: typeof Home;
}

const items: NavItem[] = [
  {
    id: "home",
    label: "Inicio",
    href: "/discover",
    icon: Home,
  },
  {
    id: "search",
    label: "Buscar",
    href: "/discover?search=1",
    icon: Search,
  },
  {
    id: "favorites",
    label: "Favoritos",
    href: "/favorites",
    icon: Heart,
  },
  {
    id: "orders",
    label: "Pedidos",
    href: "/orders",
    icon: Package,
  },
  {
    id: "addresses",
    label: "Direcciones",
    href: "/addresses",
    icon: MapPin,
  },
];


const premiumNavCss = `
  .discover-bottom-nav {
    --nav-accent: #f97316;
    --nav-muted: rgba(255,255,255,.46);
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    padding-left: max(10px, env(safe-area-inset-left));
    padding-right: max(10px, env(safe-area-inset-right));
    padding-top: 7px;
    padding-bottom: max(8px, env(safe-area-inset-bottom));
    border-top: 1px solid rgba(255,255,255,.065);
    background: rgba(7,7,7,.84);
    backdrop-filter: blur(24px) saturate(135%);
    -webkit-backdrop-filter: blur(24px) saturate(135%);
    box-shadow:
      0 -12px 34px rgba(0,0,0,.18),
      inset 0 1px 0 rgba(255,255,255,.025);
  }

  .discover-bottom-nav__inner {
    width: 100%;
    max-width: 560px;
    min-height: 58px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    align-items: stretch;
  }

  .discover-bottom-nav__item {
    position: relative;
    min-width: 0;
    min-height: 58px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    border: 0;
    border-radius: 16px;
    background: transparent;
    color: var(--nav-muted);
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    transform: translateZ(0);
    transition:
      color 180ms ease,
      transform 180ms cubic-bezier(.2,.8,.2,1);
  }

  .discover-bottom-nav__item::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 7px;
    width: 38px;
    height: 30px;
    border-radius: 12px;
    transform: translateX(-50%) scale(.72);
    background: rgba(249,115,22,.12);
    opacity: 0;
    transition:
      opacity 180ms ease,
      transform 220ms cubic-bezier(.2,.8,.2,1);
    pointer-events: none;
  }

  .discover-bottom-nav__item[data-active="true"] {
    color: var(--nav-accent);
  }

  .discover-bottom-nav__item[data-active="true"]::before {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }

  .discover-bottom-nav__icon {
    position: relative;
    z-index: 1;
    transition:
      transform 220ms cubic-bezier(.2,.8,.2,1),
      stroke-width 180ms ease;
  }

  .discover-bottom-nav__item[data-active="true"] .discover-bottom-nav__icon {
    transform: translateY(-1px) scale(1.055);
  }

  .discover-bottom-nav__label {
    position: relative;
    z-index: 1;
    font-size: 9.5px;
    line-height: 1.05;
    letter-spacing: -.01em;
    white-space: nowrap;
    transition:
      opacity 180ms ease,
      transform 220ms cubic-bezier(.2,.8,.2,1);
  }

  .discover-bottom-nav__item[data-active="true"] .discover-bottom-nav__label {
    transform: translateY(-.5px);
  }

  .discover-bottom-nav__item:not([data-active="true"]):hover {
    color: rgba(255,255,255,.72);
  }

  .discover-bottom-nav__item:hover .discover-bottom-nav__icon {
    transform: translateY(-1px);
  }

  .discover-bottom-nav__item:active {
    transform: scale(.94);
  }

  .discover-bottom-nav__item:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 1px rgba(249,115,22,.42);
  }

  .discover-bottom-nav__item[data-active="true"]::after {
    content: "";
    position: absolute;
    bottom: 2px;
    left: 50%;
    width: 4px;
    height: 4px;
    border-radius: 999px;
    transform: translateX(-50%);
    background: currentColor;
    box-shadow: 0 0 8px rgba(249,115,22,.28);
  }

  @media (prefers-reduced-motion: reduce) {
    .discover-bottom-nav__item,
    .discover-bottom-nav__item::before,
    .discover-bottom-nav__icon,
    .discover-bottom-nav__label {
      transition: none !important;
    }
  }
`;

export default function DiscoverBottomNav({
  active = "home",
  onSearchClick,
}: DiscoverBottomNavProps) {
  const [pressedItem, setPressedItem] = useState<
    NonNullable<DiscoverBottomNavProps["active"]> | null
  >(null);

  const [addressesOpen, setAddressesOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const handleSearchClick = () => {
    onSearchClick?.();
  };

  const handleAddressesClick = () => {
    setAddressesOpen(true);
  };

  const handleOrdersClick = () => {
    setOrdersOpen(true);
  };

  const handleFavoritesClick = () => {
    setFavoritesOpen(true);
  };

  const handlePressStart = (
    id: NonNullable<DiscoverBottomNavProps["active"]>,
  ) => {
    setPressedItem(id);
  };

  const handlePressEnd = () => {
    setPressedItem(null);
  };

  return (
    <>
      <style>{premiumNavCss}</style>
      <nav
        aria-label="Navegación principal"
        className="discover-bottom-nav"
      >
        <div className="discover-bottom-nav__inner">
        {items.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;

          if (item.id === "search" && onSearchClick) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={handleSearchClick}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className="discover-bottom-nav__item"
                data-active={isActive}
                data-pressed={pressedItem === item.id}
                onPointerDown={() => handlePressStart(item.id)}
                onPointerUp={handlePressEnd}
                onPointerCancel={handlePressEnd}
                onPointerLeave={handlePressEnd}
              >
                <Icon
                  className="discover-bottom-nav__icon"
                  size={21}
                  strokeWidth={isActive ? 2.3 : 1.9}
                  aria-hidden="true"
                />

                <span
                  className="discover-bottom-nav__label"
                  style={{ fontWeight: isActive ? 700 : 550 }}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          if (item.id === "favorites") {
            const favoritesActive =
              favoritesOpen || isActive;

            return (
              <button
                key={item.id}
                type="button"
                onClick={handleFavoritesClick}
                aria-label={item.label}
                aria-current={
                  favoritesActive ? "page" : undefined
                }
                className="discover-bottom-nav__item"
                data-active={favoritesActive}
                data-pressed={
                  pressedItem === item.id
                }
                onPointerDown={() =>
                  handlePressStart(item.id)
                }
                onPointerUp={handlePressEnd}
                onPointerCancel={handlePressEnd}
                onPointerLeave={handlePressEnd}
              >
                <Icon
                  className="discover-bottom-nav__icon"
                  size={21}
                  strokeWidth={
                    favoritesActive ? 2.3 : 1.9
                  }
                  aria-hidden="true"
                />

                <span
                  className="discover-bottom-nav__label"
                  style={{
                    fontWeight: favoritesActive
                      ? 700
                      : 550,
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          if (item.id === "orders") {
            const ordersActive = ordersOpen || isActive;

            return (
              <button
                key={item.id}
                type="button"
                onClick={handleOrdersClick}
                aria-label={item.label}
                aria-current={ordersActive ? "page" : undefined}
                className="discover-bottom-nav__item"
                data-active={ordersActive}
                data-pressed={pressedItem === item.id}
                onPointerDown={() => handlePressStart(item.id)}
                onPointerUp={handlePressEnd}
                onPointerCancel={handlePressEnd}
                onPointerLeave={handlePressEnd}
              >
                <Icon
                  className="discover-bottom-nav__icon"
                  size={21}
                  strokeWidth={ordersActive ? 2.3 : 1.9}
                  aria-hidden="true"
                />

                <span
                  className="discover-bottom-nav__label"
                  style={{
                    fontWeight: ordersActive ? 700 : 550,
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          if (item.id === "addresses") {
            const addressesActive = addressesOpen || isActive;

            return (
              <button
                key={item.id}
                type="button"
                onClick={handleAddressesClick}
                aria-label={item.label}
                aria-current={addressesActive ? "page" : undefined}
                className="discover-bottom-nav__item"
                data-active={addressesActive}
                data-pressed={pressedItem === item.id}
                onPointerDown={() => handlePressStart(item.id)}
                onPointerUp={handlePressEnd}
                onPointerCancel={handlePressEnd}
                onPointerLeave={handlePressEnd}
              >
                <Icon
                  className="discover-bottom-nav__icon"
                  size={21}
                  strokeWidth={addressesActive ? 2.3 : 1.9}
                  aria-hidden="true"
                />

                <span
                  className="discover-bottom-nav__label"
                  style={{
                    fontWeight: addressesActive ? 700 : 550,
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className="discover-bottom-nav__item"
              data-active={isActive}
              data-pressed={pressedItem === item.id}
              onPointerDown={() => handlePressStart(item.id)}
              onPointerUp={handlePressEnd}
              onPointerCancel={handlePressEnd}
              onPointerLeave={handlePressEnd}
            >
              <Icon
                className="discover-bottom-nav__icon"
                size={21}
                strokeWidth={isActive ? 2.3 : 1.9}
                aria-hidden="true"
              />

              <span
                  className="discover-bottom-nav__label"
                  style={{ fontWeight: isActive ? 700 : 550 }}
                >
                {item.label}
              </span>
            </Link>
          );
        })}
        </div>
      </nav>

      <FavoritesSheet
        open={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
      />

      <OrdersSheet
        open={ordersOpen}
        onClose={() => setOrdersOpen(false)}
      />

      <AddressesSheet
        open={addressesOpen}
        onClose={() => setAddressesOpen(false)}
      />
    </>
  );
}