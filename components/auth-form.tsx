import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function AuthForm() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <p className="text-muted-foreground">
              Sign in to access your personalized dashboard and continue where
              you left off.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => signIn("google")}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm gap-3"
            variant="outline"
          >
            <Image src={"/google.svg"} alt="Google" width={18} height={18} />
            <span className="font-medium">Continue with Google</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Secure Authentication
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>Fast, secure, and privacy-focused</span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
