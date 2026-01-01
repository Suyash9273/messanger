"use client"
import React, {useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
    const router = useRouter();
    const [data, setData] = useState({name: "", email: "", password: ""});
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const registerUser = async (e: React.FormEvent) => {
        e.preventDefault();

          setIsLoading(true);
        
            //Call our api
            const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
            })

            console.log("This is fetched user: -> ", response);

            if(response.ok) {
                router.push("/login");
            }
            else {
                const msg = await response.text();
                setError(msg);
            }
        
            setIsLoading(false);
    }

    return(
        <Card className="w-full max-w-md bg-card border-border/50 shadow-2xl backdrop-blur-sm m-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">Create an account</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your information below to get started with our platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={registerUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium uppercase tracking-wider text-muted-foreground/70">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Jane Doe"
              onChange={(e) => {setData({...data, name: e.target.value})}}
              required
              className="bg-background/50 border-border focus:ring-primary/20 transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium uppercase tracking-wider text-muted-foreground/70">
              Email Address
            </Label>
            <Input
              type="email"
              placeholder="name@example.com"
              onChange={(e) => {setData({...data, email: e.target.value})}}
              required
              className="bg-background/50 border-border focus:ring-primary/20 transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium uppercase tracking-wider text-muted-foreground/70">
              Password
            </Label>
            <div className="relative">
              <Input
                type="password"
                placeholder="••••••••"
                onChange={(e) => {setData({...data, password: e.target.value})}}
                required
                className="bg-background/50 border-border pr-10 focus:ring-primary/20 transition-all duration-200"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-11 text-base font-medium transition-all duration-200 active:scale-95"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <a href="#" className="text-foreground hover:underline font-medium underline-offset-4">
              Log in
            </a>
          </p>
        </div>
      </CardContent>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </Card>
    )
}