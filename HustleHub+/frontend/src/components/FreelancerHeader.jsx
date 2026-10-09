import { Bell } from "lucide-react";
import { NavLink } from "react-router-dom";
import { getCurrentUser } from "../services/authSession";

const links = [
  { label: "Dashboard", to: "/freelancer/dashboard" },
  { label: "My Gigs", to: "/freelancer/gigs" },
  { label: "Orders", to: "/freelancer/orders" },
  { label: "Earnings", to: "/freelancer/earnings" },
  { label: "Messages", to: "/freelancer/messages" },
];

export function getFreelancerDisplayName(user = getCurrentUser()) {
  const savedName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return savedName || user?.username || user?.email?.split("@")[0] || "Freelancer";
}

export default function FreelancerHeader() {
  const user = getCurrentUser();
  const displayName = getFreelancerDisplayName(user);
  const initials = displayName
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <header className="freelancer-topbar">
      <div className="freelancer-topbar-inner">
        <NavLink to="/freelancer/dashboard" className="freelancer-wordmark" aria-label="HustleHub freelancer dashboard">
          HustleHub<span>+</span>
        </NavLink>
        <nav className="freelancer-nav" aria-label="Freelancer navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/freelancer/dashboard"}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="freelancer-account-tools">
          <NavLink className="freelancer-icon-link" to="/freelancer/messages" aria-label="Messages" title="Messages">
            <Bell size={17} strokeWidth={1.8} />
          </NavLink>
          <span className="freelancer-avatar" aria-label={`Signed in as ${displayName}`} title={displayName}>{initials}</span>
        </div>
      </div>
    </header>
  );
}

/* Reference List
React Router, n.d. NavLink. [online] Available at: <https://reactrouter.com/api/components/NavLink> [Accessed 10 October 2026].
Lucide, n.d. Lucide for React. [online] Available at: <https://lucide.dev/guide/packages/lucide-react> [Accessed 10 October 2026].
*/