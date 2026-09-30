import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import type { Page } from "../types/page";

interface MainLayoutProps {
  children: ReactNode;
  page: Page;
  onNavigate: (page: Page) => void;
}

function MainLayout({
  children,
  page,
  onNavigate,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f5f0df] text-emerald-950">
      <Sidebar
        page={page}
        onNavigate={onNavigate}
      />

      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;