import { useLocation } from "react-router-dom";
import Header from "./Header";

export default function Layout({ children }) {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div>
      <Header />

      <main className={isAuthPage ? "" : "pt-16"}>
        {children}
      </main>
    </div>
  );
}