import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthForm from "@/app/signin/form";

export default function FormCard({
  setError,
}: {
  setError: (error: boolean) => void;
}) {
  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Authentication form</CardTitle>
        <CardDescription>Input your credentials to sign in</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm setError={setError} />
      </CardContent>
    </Card>
  );
}
