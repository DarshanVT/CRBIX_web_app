import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { loginUser, registerUser } from "@/api/auth"; // Import API helpers

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // ---------------------- LOGIN ----------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const email = (document.getElementById("email-login") as HTMLInputElement).value;
    const password = (document.getElementById("password-login") as HTMLInputElement).value;

    try {
      const data = await loginUser(email, password);

      if (data.success) {
        console.log("Logged in user:", data.user);
        // Optional: store user info in localStorage/sessionStorage here
        setLocation("/home");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------- REGISTER ----------------------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const firstName = (document.getElementById("Fname") as HTMLInputElement).value;
    const lastName = (document.getElementById("Lname") as HTMLInputElement).value;
    const email = (document.getElementById("email-register") as HTMLInputElement).value;
    const mobile = (document.getElementById("phone") as HTMLInputElement).value;
    const password = (document.getElementById("password-create") as HTMLInputElement).value;
    const cpassword = (document.getElementById("password-confirm") as HTMLInputElement).value;

    try {
      const data = await registerUser({ firstName, lastName, email, mobile, password, cpassword });

      if (data.success) {
        alert(data.message);
        setLocation("/home");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-brand-dark mb-2">
            CDaX<span className="text-brand-medium">.</span>
          </h1>
          <p className="text-gray-600">Welcome to your learning journey</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">Email or Phone</Label>
                    <Input id="email-login" placeholder="user@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login">Password</Label>
                    <Input id="password-login" type="password" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-brand-dark hover:bg-brand-dark/90" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Start your learning journey with CDaX today</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="Fname">First name</Label>
                      <Input id="Fname" placeholder="Omkar" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="Lname">Last Name</Label>
                      <Input id="Lname" placeholder="Karale" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-register">Email</Label>
                      <Input id="email-register" type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+91 234 567 8900" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password-create">Create Password</Label>
                      <Input id="password-create" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-confirm">Confirm Password</Label>
                      <Input id="password-confirm" type="password" required />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-brand-dark hover:bg-brand-dark/90" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Register"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
