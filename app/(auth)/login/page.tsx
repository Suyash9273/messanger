"use client"

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Mail, ArrowRight, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";


export default function LoginPage() {
    const {data: session, status} = useSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
      if(status == "authenticated") {
      router.push("/chat");
    }
    }, [status]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const callback = await signIn("credentials", {
            email,
            password,
            redirect: false
        });

        if(callback?.error) {
            setError("Invalid Credentials");
        }

        if(callback?.ok) {
            //Success, it means next-auth has made our cookie that is cookie is set
            router.push("/chat");
        }
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Decorative background elements inspired by the high-end agency designs */}
      <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
      <div className="absolute bottom-0 left-0 w-full h-2 bg-primary" />

      <div className="w-full max-w-[400px] space-y-8 relative z-10">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto bg-primary text-white w-12 h-12 flex items-center justify-center mb-4 border-2 border-primary rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <span className="text-2xl font-black">M0</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-primary">Studio Access</h1>
          <p className="text-muted-foreground font-medium text-balance">
            Design, build, and deploy with the world's most advanced AI studio.
          </p>
        </div>
        
        {/**Login Start */}
        <div className="grid gap-6">
      <Card className="border-2 border-primary shadow-[8px_8px_0px_0px_rgba(30,41,59,1)]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight uppercase">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 border-2 border-primary focus-visible:ring-0 focus-visible:border-accent transition-colors bg-white h-12"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider">
                    Password
                  </Label>
                  <Button variant="link" className="px-0 font-bold text-xs uppercase text-accent hover:text-accent/80">
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 border-2 border-primary focus-visible:ring-0 focus-visible:border-accent transition-colors bg-white h-12"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-sm font-bold uppercase tracking-widest bg-red-400 hover:bg-accent/90 transition-all active:translate-y-1 active:shadow-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-black">
                    Sign In <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-primary/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 font-bold text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button
              variant="outline"
              className="border-2 border-primary font-bold uppercase text-xs h-10 hover:bg-secondary bg-transparent"
            >
              Github
            </Button>
            <Button
              variant="outline"
              className="border-2 border-primary font-bold uppercase text-xs h-10 hover:bg-secondary bg-transparent"
            >
              Google
            </Button>
          </div>
        </CardFooter>
      </Card>
      <p className="px-8 text-center text-sm text-muted-foreground font-medium">
        Don&apos;t have an account?{" "}
        <Button variant="link" className="underline underline-offset-4 hover:text-primary p-0 font-bold">
          Sign up for free
        </Button>
      </p>
        </div>
        {/**Login End */}

        <footer className="pt-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
          © 2026 Messanger- All Rights Reserved
        </footer>
      </div>

      {/* Subtle architectural lines */}
      <div className="absolute left-[10%] top-0 bottom-0 w-[1px] bg-primary/5 hidden lg:block" />
      <div className="absolute right-[10%] top-0 bottom-0 w-[1px] bg-primary/5 hidden lg:block" />
    </main>
    )
}