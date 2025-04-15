export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="flex h-16 shrink-0 justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      {children}
    </header>
  );
}
