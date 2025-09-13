import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AuthHeader({ email }: { email: string }) {
  return (
    <div className="bg-background p-4">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center sm:flex hidden">
                  <LogIn className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Welcome back!</p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>
              </div>
              <Button onClick={() => signOut()} variant="outline" size="sm">
                <span className="hidden sm:inline">Sign out</span>
                <LogOut />
              </Button>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
