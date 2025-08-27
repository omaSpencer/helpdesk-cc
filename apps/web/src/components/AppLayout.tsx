import { Link, Outlet, NavLink } from "react-router-dom";

export function AppLayout() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <header style={{ borderBottom: "1px solid #eee" }}>
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Link to="/" style={{ fontWeight: 700 }}>
            Helpdesk
          </Link>
          <nav style={{ display: "flex", gap: 12 }}>
            <NavLink to="/tickets">Tickets</NavLink>
            <NavLink to="/new">New</NavLink>
          </nav>
        </div>
      </header>
      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px" }}>
          <Outlet />
        </div>
      </main>
      <footer style={{ borderTop: "1px solid #eee" }}>
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "12px 16px",
            fontSize: 12,
            color: "#666",
          }}
        >
          © Helpdesk
        </div>
      </footer>
    </div>
  );
}
