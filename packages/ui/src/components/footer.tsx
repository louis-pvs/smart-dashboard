import { ModeToggle } from "@repo/ui/components/mode-toggle";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="flex flex-row items-end justify-end py-4">
      {children}
      <ModeToggle />
    </footer>
  );
}
