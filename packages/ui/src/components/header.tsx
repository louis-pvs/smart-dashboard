import { SidebarTrigger } from "@repo/ui/components/sidebar";
import { ModeToggle } from "@repo/ui/components/mode-toggle";

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <SidebarTrigger />
      <div className="flex-1/2" />
      <ModeToggle />
    </header>
  );
}
