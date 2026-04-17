import { NavLink, Outlet } from "react-router-dom";
import { resourceConfigs } from "../config/resources";
import { useAuth } from "../auth";

export function Shell() {
  const { admin, logout } = useAuth();

  return (
    <div className="shell-root">
      <header className="shell-header">
        <div className="brand">
          <span className="brand-mark" />
          <div>
            <h1>HairLine Admin</h1>
            <p>Панель управления базой данных</p>
          </div>
        </div>
        <div className="header-right">
          <div className="admin-pill">{admin?.phone}</div>
          <button type="button" className="danger" onClick={logout}>
            Выйти
          </button>
        </div>
      </header>

      <div className="shell-body">
        <aside className="shell-sidebar">
          <nav>
            {resourceConfigs.map((item) => (
              <NavLink
                key={item.key}
                to={item.route}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                {item.title}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="shell-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

