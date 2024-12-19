import ThemeSwitcher from "@/app/ui/theme-switcher";

export default function MyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="h-12 flex items-center justify-between px-4">
        <h1 className="text-lg font-semibold">A-SAFE Test App</h1>
        <ThemeSwitcher />
      </header>
      <div className="flex flex-1">
        {/* Barra lateral */}
        <aside className="bg-gray-200 w-64 p-4">
          <nav>
            <ul>
              <li>
                <a
                  href="/"
                  className="block py-2 px-4 rounded hover:bg-gray-300"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="block py-2 px-4 rounded hover:bg-gray-300"
                >
                  Acerca de
                </a>
              </li>
              {/* Agrega más enlaces según sea necesario */}
            </ul>
          </nav>
        </aside>
        {/* Contenido principal */}
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </>
  );
}
