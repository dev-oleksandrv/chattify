import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface AlertErrorMessagesProps {
  errors: string[];
}

export const AlertErrorMessages = ({ errors }: AlertErrorMessagesProps) => {
  return (
    <Alert variant="destructive">
      <CircleAlert className="size-5" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {errors.map((error) => (
          <p key={error}>{error}</p>
        ))}
      </AlertDescription>
    </Alert>
  );
};
