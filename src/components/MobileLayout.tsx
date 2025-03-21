
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AlertCircle, HeartPulse, Home, Users, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    {
      label: "Home",
      icon: Home,
      href: "/home"
    },
    {
      label: "Report",
      icon: FileText,
      href: "/report"
    },
    {
      label: "Adot",
      icon: HeartPulse,
      href: "/health"
    },
    {
      label: "Enawga",
      icon: Users,
      href: "/community"
    },
    {
      label: "Profile",
      icon: User,
      href: "/profile"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 pb-16">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around z-50">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              location.pathname === item.href 
                ? "text-zeb-purple" 
                : "text-gray-500 hover:text-zeb-purple"
            )}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MobileLayout;
