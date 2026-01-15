import { NavLink, Route, Routes } from "react-router-dom";
import { appRoutes } from "./routes";

function App() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-foreground/70 hover:bg-accent hover:text-foreground",
    ].join(" ");

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <nav className="mx-auto flex max-w-5xl items-center gap-2 p-4">
          {appRoutes
            .filter((r) => r.nav)
            .map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                end={route.path === "/"}
                className={linkClass}
              >
                {route.label}
              </NavLink>
            ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl p-4">
        <Routes>
          {appRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </main>
    </div>
  );
}

export default App;
