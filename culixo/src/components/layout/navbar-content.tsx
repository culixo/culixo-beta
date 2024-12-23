'use client'

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { 
  ChefHat, 
  Sun, 
  Moon, 
  X, 
  PlusCircle, 
  UserCog, 
  BookmarkCheck, 
  LogOut, 
  HelpCircle, 
  FileText, 
  Info, 
  ChevronDown 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, api } from "@/hooks/useAuth";

export function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePostRecipeClick = async () => {
    if (!isAuthenticated) {
      router.push('/login?from=/post-recipe');
      return;
    }
  
    try {
      await api.request('/auth/verify');
      router.push('/post-recipe');
    } catch {
      logout();
      router.push('/login?from=/post-recipe');
    }
  };

  if (pathname?.startsWith('/login') || pathname?.startsWith('/signup')) {
    return null;
  }

  if (!mounted) return null;

  const publicNavItems = [
    { name: "Explore", href: "/explore-recipes" },
    { name: "Community", href: "/community" },
    { name: "About", href: "/about" },
    {
      name: "More",
      href: "#",
      isDropdown: true,
    },
  ];

  const navigationItems = publicNavItems;

  const getInitial = (name: string | undefined | null): string => {
    if (!name) return 'U';
    const initial = name.trim().charAt(0);
    return initial.toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <div className="w-full">
        <div
          className={cn(
            "mx-auto h-16 border-b",
            "backdrop-blur-lg",
            theme === "dark"
              ? "bg-black/10 border-white/10"
              : "bg-white/50 border-zinc-200"
          )}
        >
          <div className="mx-auto max-w-[1920px] h-full px-6 lg:px-12">
            <div className="flex h-full items-center justify-between">
              {/* Left section */}
              <div className="flex items-center gap-10">
                <Link
                  href="/"
                  className={cn(
                    "flex items-center",
                    theme === "dark" ? "text-white" : "text-zinc-900"
                  )}
                >
                  <div className="flex items-center">
                    <Image
                      src="/images/culixo-logo.png"
                      alt="Culixo Logo"
                      width={100}
                      height={100}
                      className="transition-transform"
                      style={{ transform: "scale(1.05)" }}
                    />
                  </div>
                </Link>

                {/* Navigation items */}
                <nav className="hidden lg:block">
                  <ul className="flex items-center gap-10">
                    {navigationItems.map((item) => (
                      <li key={item.name}>
                        {item.isDropdown ? (
                          <div
                            className="relative"
                            onMouseEnter={() => setShowMoreMenu(true)}
                            onMouseLeave={() => setShowMoreMenu(false)}
                          >
                            <div
                              className={cn(
                                "flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors cursor-pointer",
                                theme === "dark"
                                  ? "text-white/70 hover:text-white hover:bg-white/5"
                                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                              )}
                            >
                              <span className="text-sm">{item.name}</span>
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 transition-transform duration-200",
                                  showMoreMenu && "rotate-180"
                                )}
                              />
                            </div>

                            {/* Invisible bridge to prevent menu from closing */}
                            <div className="absolute w-full h-2 bottom-0 translate-y-full" />

                            {showMoreMenu && (
                              <div
                                className={cn(
                                  "absolute right-0 mt-2 w-56 rounded-xl",
                                  "border shadow-lg",
                                  "animate-in fade-in-0 slide-in-from-top-2 duration-200",
                                  theme === "dark"
                                    ? "bg-[#1C1C1C] border-white/10"
                                    : "bg-white border-zinc-200"
                                )}
                              >
                                <div className="h-2" />
                                <div className="py-1.5">
                                  <Link
                                    href="/recipe-guidelines"
                                    className={cn(
                                      "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                                      theme === "dark"
                                        ? "text-white/70 hover:bg-white/5 hover:text-white"
                                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                                    )}
                                  >
                                    <FileText className="h-4 w-4" />
                                    Recipe Guidelines
                                  </Link>
                                  <Link
                                    href="/community-guidelines"
                                    className={cn(
                                      "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                                      theme === "dark"
                                        ? "text-white/70 hover:bg-white/5 hover:text-white"
                                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                                    )}
                                  >
                                    <Info className="h-4 w-4" />
                                    Community Guidelines
                                  </Link>

                                  <Link
                                    href="/help-support"
                                    className={cn(
                                      "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                                      theme === "dark"
                                        ? "text-white/70 hover:bg-white/5 hover:text-white"
                                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                                    )}
                                  >
                                    <HelpCircle className="h-4 w-4" />
                                    Help & Support
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            className={cn(
                              "px-3 py-1.5 text-sm rounded-full transition-colors",
                              theme === "dark"
                                ? pathname === item.href
                                  ? "text-white hover:bg-white/5"
                                  : "text-white/70 hover:text-white hover:bg-white/5"
                                : pathname === item.href
                                ? "text-zinc-900 hover:bg-zinc-100"
                                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                            )}
                          >
                            {item.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Right section */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={cn(
                    "rounded-full p-2 transition-colors",
                    theme === "dark"
                      ? "text-white/70 hover:bg-white/5 hover:text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  )}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>

                {isAuthenticated ? (
                  <>
                    <Link
                      href="/post-recipe"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePostRecipeClick();
                      }}
                      className={cn(
                        "hidden md:flex items-center gap-2 px-4 py-2 rounded-lg",
                        "text-sm font-medium transition-all duration-300",
                        theme === "dark"
                          ? "bg-white text-black hover:bg-white/90 hover:scale-105 hover:shadow-lg"
                          : "bg-black text-white hover:bg-black/90 hover:scale-105 hover:shadow-lg"
                      )}
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Post Recipe</span>
                    </Link>

                    {/* User Avatar */}
                    <div className="relative" ref={userMenuRef}>
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className={cn(
                          "flex items-center justify-center rounded-full w-10 h-10",
                          "bg-gradient-to-br from-purple-600 to-blue-500 text-white font-medium"
                        )}
                      >
                        {getInitial(user?.full_name)}
                      </button>

                      {showUserMenu && (
                        <div
                          className={cn(
                            "absolute right-0 mt-2 w-56 rounded-xl",
                            "border shadow-lg",
                            "animate-in fade-in-0 slide-in-from-top-2 duration-200",
                            theme === "dark"
                              ? "bg-[#1C1C1C] border-white/10"
                              : "bg-white border-zinc-200"
                          )}
                        >
                          <div className="py-1.5">
                            <Link
                              href="/profile-settings"
                              className={cn(
                                "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                                theme === "dark"
                                  ? "text-white/70 hover:bg-white/5 hover:text-white"
                                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                              )}
                            >
                              <UserCog className="h-4 w-4" />
                              <span>Profile Settings</span>
                            </Link>

                            <Link
                              href="/my-recipes"
                              className={cn(
                                "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                                theme === "dark"
                                  ? "text-white/70 hover:bg-white/5 hover:text-white"
                                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                              )}
                            >
                              <ChefHat className="h-4 w-4" />
                              <span>My Recipes</span>
                            </Link>

                            <Link
                              href="/saved-recipes"
                              className={cn(
                                "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                                theme === "dark"
                                  ? "text-white/70 hover:bg-white/5 hover:text-white"
                                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                              )}
                            >
                              <BookmarkCheck className="h-4 w-4" />
                              <span>Saved Recipes</span>
                            </Link>

                            <div
                              className={cn(
                                "h-px mx-4 my-1",
                                theme === "dark" ? "bg-white/10" : "bg-zinc-200"
                              )}
                            />

                            <button
                              onClick={handleLogout}
                              className={cn(
                                "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors w-full",
                                theme === "dark"
                                  ? "text-red-400 hover:bg-white/5 hover:text-red-300"
                                  : "text-red-600 hover:bg-zinc-100 hover:text-red-500"
                              )}
                            >
                              <LogOut className="h-4 w-4" />
                              <span>Sign out</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePostRecipeClick}
                      className={cn(
                        "hidden md:flex items-center gap-2 px-4 py-2 rounded-lg",
                        "text-sm font-medium transition-all duration-300",
                        theme === "dark"
                          ? "bg-white text-black hover:bg-white/90 hover:scale-105 hover:shadow-lg"
                          : "bg-black text-white hover:bg-black/90 hover:scale-105 hover:shadow-lg"
                      )}
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Post Recipe</span>
                    </button>

                    <Link
                      href="/signup"
                      className={cn(
                        "px-4 py-2 text-sm rounded-lg transition-colors",
                        theme === "dark"
                          ? "bg-white/10 text-white hover:bg-white/15"
                          : "bg-zinc-900 text-white hover:bg-zinc-800"
                      )}
                    >
                      Sign up
                    </Link>
                  </div>
                )}

                {/* Mobile menu button */}
                <button
                  className="lg:hidden rounded-full p-2 ml-2"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X
                      className={
                        theme === "dark" ? "text-white/70" : "text-zinc-600"
                      }
                      size={18}
                    />
                  ) : (
                    <svg
                      className={
                        theme === "dark" ? "text-white/70" : "text-zinc-600"
                      }
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-opacity duration-300",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          theme === "dark" ? "bg-black/60" : "bg-zinc-400/30"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          "transition-all duration-300 ease-in-out transform",
          theme === "dark"
            ? "bg-black/60 backdrop-blur-md"
            : "bg-white/60 backdrop-blur-md",
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "p-2 rounded-full",
              theme === "dark"
                ? "text-white/70 hover:bg-white/10"
                : "text-zinc-600 hover:bg-zinc-100"
            )}
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] space-y-8">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-2xl font-medium transition-colors",
                theme === "dark"
                  ? "text-white/70 hover:text-white"
                  : "text-zinc-600 hover:text-zinc-900"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <button
            onClick={handlePostRecipeClick}
            className={cn(
              "text-2xl font-medium transition-colors",
              theme === "dark"
                ? "text-white/70 hover:text-white"
                : "text-zinc-600 hover:text-zinc-900"
            )}
          >
            Post Recipe
          </button>
        </div>
      </div>
    </header>
  );
}