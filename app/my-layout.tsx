import ThemeSwitcher from "@/app/ui/theme-switcher";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function MyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      {/* Encabezado */}
      <header className="h-12 flex items-center justify-between px-4 bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] border-b border-[hsl(var(--sidebar-border))]">
        <h1 className="text-lg font-semibold">A-SAFE Test App</h1>
        <ThemeSwitcher />
      </header>
      {/* Contenedor Principal */}
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          {/* Barra Lateral */}
          <AppSidebar />
          {/* Contenido Principal */}
          <main className="flex-1 flex flex-col p-4 overflow-auto">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
}
