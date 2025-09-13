import { Card, CardContent } from "@/components/ui/card";

export default function AuthLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">Getting things ready</h3>
            <p className="text-muted-foreground text-sm">
              Please wait while we load your experience...
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
