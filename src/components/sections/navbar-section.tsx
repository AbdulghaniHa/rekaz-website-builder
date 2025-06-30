import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Search, Bell, User, Menu } from "lucide-react";

interface NavbarSectionProps {
  brandName?: string;
  logo?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  ctaText?: string;
  ctaVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  menuItems?: Array<{
    label: string;
    href?: string;
    badge?: string;
  }>;
}

export const NavbarSection: React.FC<NavbarSectionProps> = ({
  brandName = "Acme Inc",
  logo = "",
  showSearch = true,
  showNotifications = true,
  showProfile = true,
  ctaText = "Get Started",
  ctaVariant = "default",
  menuItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact", badge: "New" },
  ],
}) => {
  console.log("NavbarSection rendered with props:", {
    brandName,
    showSearch,
    showProfile,
    menuItems: menuItems.length,
  });

  return (
    <nav className="w-full border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {logo ? (
                <Image
                  src={logo}
                  alt={brandName}
                  width={32}
                  height={32}
                  className="h-8 w-8"
                  unoptimized={true}
                />
              ) : (
                <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              )}
              <span className="text-xl font-bold text-gray-900">
                {brandName}
              </span>
            </div>

            {/* Navigation Menu */}
            <div className="hidden md:flex items-center space-x-8 ml-8">
              {menuItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <a
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    {item.label}
                  </a>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            {showSearch && (
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Search</span>
              </Button>
            )}

            {/* Notifications */}
            {showNotifications && (
              <div className="relative">
                <Button variant="ghost" size="sm">
                  <Bell className="h-5 w-5" />
                </Button>
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </div>
            )}

            {/* CTA Button */}
            <Button variant={ctaVariant} size="sm">
              {ctaText}
            </Button>

            {/* Profile */}
            {showProfile && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden sm:block text-sm">John Doe</span>
              </Button>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
