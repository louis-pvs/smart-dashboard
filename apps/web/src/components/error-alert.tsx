import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { TerminalWindow } from "@phosphor-icons/react/dist/ssr";

export default function ErrorAlert({
  title = "Error",
  error = "Something wen't wrong",
}: {
  error?: null | string;
  title?: string | null;
}) {
  if (!error) return null;
  return (
    <Alert variant="destructive">
      <TerminalWindow className="h-4 w-4" weight="duotone" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}

export { ErrorAlert };
