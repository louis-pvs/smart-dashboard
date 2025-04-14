import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/ui/components/base/alert";
import { TerminalWindow } from "@phosphor-icons/react/dist/ssr";

export default function ErrorAlert({ error }: { error: null | string }) {
  if (!error) return null;
  return (
    <Alert>
      <TerminalWindow className="h-4 w-4" weight="duotone" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}

export { ErrorAlert };
