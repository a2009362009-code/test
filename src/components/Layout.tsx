import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <Navbar />
    <main className="flex-1 pt-14 sm:pt-16">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
