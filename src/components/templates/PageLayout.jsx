import { NavLink } from "react-router-dom";

export default function PageLayout({ children }) {
  const linkClass = ({ isActive }) =>
    `rounded-lg px-5 py-3 font-semibold no-underline transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "bg-slate-200 text-slate-800 hover:bg-slate-300"
    }`;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-8 flex flex-wrap gap-3 border-b border-slate-200 pb-5">
        <NavLink
          to="/products"
          className={linkClass}
          end
        >
          Produk
        </NavLink>

        <NavLink
          to="/settings"
          className={linkClass}
        >
          Settings
        </NavLink>
      </nav>

      <main>{children}</main>
    </div>
  );
}
