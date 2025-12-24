import { Search, ShoppingCart, Heart, Bell, Menu, Globe } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [initials, setInitials] = useState("U"); // Default 'U' for unknown


 useEffect(() => {
    // Assume user info stored in localStorage after login
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      const first = parsed.firstName?.[0] || "";
      const last = parsed.lastName?.[0] || "";
      setInitials((first + last).toUpperCase());
    }
  }, []);

  return (
    <nav className="h-[72px] border-b border-gray-200 bg-white px-6 flex items-center gap-4 shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <Link href="/home" className="flex-shrink-0">
          <div className="font-serif text-2xl font-bold text-brand-dark">
            CDaX<span className="text-brand-medium">.</span>
          </div>
      </Link>

      {/* Categories */}
      <button className="text-sm font-medium text-gray-700 hover:text-brand-dark hidden md:block">
        Categories
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl relative hidden md:block">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <Input 
          className="w-full pl-10 bg-gray-50 border-gray-300 rounded-full h-10 focus-visible:ring-brand-dark/20" 
          placeholder="Search for anything" 
        />
      </div>

      {/* Links */}
      <div className="hidden lg:flex items-center gap-4 text-sm font-medium text-gray-700">
        <Link href="/cdax-business-demo" className="hover:text-brand-dark">CDaX Business</Link>
        <Link href="/tech-on-cdax" className="hover:text-brand-dark">Teach on CDaX</Link>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-3 ml-auto">
        <Link href="/my-learning" className="hidden md:block text-sm font-medium text-gray-700 hover:text-brand-dark">
           My Learning
        </Link>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100 hidden sm:flex">
          <Heart className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100 relative">
          <ShoppingCart className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-dark rounded-full" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100 hidden sm:flex">
          <Bell className="w-5 h-5" />
        </Button>
        
        {/* Profile */}
        <Link href="/profile">
        <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-90">
          {initials}
        </div>
        </Link>
      </div>
    </nav>
  );
}
