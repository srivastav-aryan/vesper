import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="flex justify-center items-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Welcome to Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">This is a test card from ShadCN.</p>
        </CardContent>
      </Card>
    </div>
  );
}


