interface FormErrorMessagesProps {
  errors: string[];
}

export const FormErrorMessages = ({ errors }: FormErrorMessagesProps) => {
  return (
    <div className="space-y-1 my-1">
      {errors.map((error) => (
        <p key={error} className="text-sm text-red-500">
          {error}
        </p>
      ))}
    </div>
  );
};
