import { useEffect, useState } from "react";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import MisPJsPage from "./pages/MisPJsPage";

type Page = "home" | "mis-pjs";

function App() {
  const [page, setPage] = useState<Page>(() => {
    const savedPage = localStorage.getItem("benito-page");

    if (savedPage === "mis-pjs") {
      return "mis-pjs";
    }

    return "home";
  });

  useEffect(() => {
    localStorage.setItem("benito-page", page);
  }, [page]);

  return (
    <MainLayout page={page} onNavigate={setPage}>
      {page === "home" && <HomePage />}
      {page === "mis-pjs" && <MisPJsPage />}
    </MainLayout>
  );
}

export default App;