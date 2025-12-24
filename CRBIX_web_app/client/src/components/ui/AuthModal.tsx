import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { loginUser, registerUser } from "@/api/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const email = (document.getElementById("email-login") as HTMLInputElement).value;
    const password = (document.getElementById("password-login") as HTMLInputElement).value;

    try {
      const data = await loginUser(email, password);
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        onClose();
        alert("Login successful!");
      } else {
        alert(data.message || "Login failed");
      }
    } catch {
      alert("Server error. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

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
        localStorage.setItem("user", JSON.stringify(data.user));
        onClose();
        alert("Registration successful!");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch {
      alert("Server error. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Enter your credentials</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">Email</Label>
                    <Input id="email-login" placeholder="user@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login">Password</Label>
                    <Input id="password-login" type="password" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Start your learning journey</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="Fname">First Name</Label>
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
                      <Input id="email-register" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password-create">Password</Label>
                      <Input id="password-create" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-confirm">Confirm</Label>
                      <Input id="password-confirm" type="password" required />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Register"}
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
