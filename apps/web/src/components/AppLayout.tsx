import { Link, Outlet, NavLink } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto items-center flex gap-4 py-2">
          <Link to="/" className="font-bold">
            Helpdesk
          </Link>
          <nav className="flex gap-3">
            <NavLink to="/tickets">Tickets</NavLink>
            <NavLink to="/new">New</NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
      <footer className="border-b border-border">
        <div className="container mx-auto text-xs py-3 px-2">© Helpdesk</div>
      </footer>
    </div>
  );
}
