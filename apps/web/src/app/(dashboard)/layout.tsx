import Sidebar from "@/app/ui/sidebar";
import Header from "@repo/ui/components/header";
import Footer from "@repo/ui/components/footer";
import { SidebarTrigger } from "@repo/ui/components/sidebar";
import { SidebarProvider } from "@repo/ui/components/base/sidebar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Sidebar />
        <div className="min-h-screen relative flex w-full flex-1 flex-col md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow p-4">
          <Header>
            <SidebarTrigger />
          </Header>
          <main className="flex flex-col flex-1 bg-card rounded-4xl p-4">{children}</main>
          <Footer />
        </div>
    </SidebarProvider>
  );
}
