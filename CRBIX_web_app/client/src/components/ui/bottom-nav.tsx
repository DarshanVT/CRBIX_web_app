import { Home, BookOpen, FileText, User, Search } from "lucide-react";
import { Link } from "wouter";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 py-3 px-6 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
      <Link href="/">
        <a className="flex flex-col items-center gap-1 text-brand-dark">
          <Home className="w-6 h-6" strokeWidth={2.5} />
        </a>
      </Link>
      <Link href="/courses">
        <a className="flex flex-col items-center gap-1 text-gray-400 hover:text-brand-dark transition-colors">
          <BookOpen className="w-6 h-6" />
        </a>
      </Link>
      <Link href="/assignments">
        <a className="flex flex-col items-center gap-1 text-gray-400 hover:text-brand-dark transition-colors">
          <FileText className="w-6 h-6" />
        </a>
      </Link>
      <Link href="/profile">
        <a className="flex flex-col items-center gap-1 text-gray-400 hover:text-brand-dark transition-colors">
          <User className="w-6 h-6" />
        </a>
      </Link>
    </div>
  );
}
