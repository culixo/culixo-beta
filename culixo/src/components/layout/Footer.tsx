// src/components/layout/Footer.tsx
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface FooterProps {
  theme: string | undefined;
}

interface FooterSection {
  title: string;
  links: string[];
}

export const Footer = ({ theme }: FooterProps) => {
  const footerSections: FooterSection[] = [
    {
      title: "Quick Links",
      links: ['Popular Recipes', 'Latest Recipes', 'Cooking Tips', 'About Us']
    },
    {
      title: "Categories",
      links: ['Breakfast', 'Quick & Easy', 'Vegetarian', 'Desserts']
    },
    {
      title: "Community",
      links: ['Guidelines', 'Blog', 'Forum', 'Help Center']
    }
  ];

  const legalLinks = ['Privacy', 'Terms', 'Contact'];

  return (
    <footer className={cn(
      "py-12 sm:py-16 relative",
      theme === 'dark' 
        ? 'bg-[#0A0A0C]/40 border-t border-white/[0.08]' 
        : 'bg-white border-t border-zinc-200'
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4 text-center sm:text-left">
              <h3 className={cn(
                "font-semibold text-lg mb-4",
                theme === 'dark' ? 'text-white' : 'text-zinc-900'
              )}>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link 
                      href="#" 
                      className={cn(
                        "text-sm transition-colors duration-200",
                        theme === 'dark'
                          ? 'text-zinc-400 hover:text-white'
                          : 'text-zinc-600 hover:text-zinc-900'
                      )}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Section */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className={cn(
              "font-semibold text-lg mb-4",
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            )}>
              Newsletter
            </h3>
            <div className="space-y-4">
              <p className={cn(
                "text-sm",
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
              )}>
                Get weekly recipe inspiration directly in your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={cn(
                    "flex-1 px-4 py-2 rounded-lg text-sm text-center sm:text-left",
                    theme === 'dark' 
                      ? 'bg-white/10 border border-white/[0.08] text-white placeholder:text-zinc-500'
                      : 'bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-500'
                  )}
                />
                <Button 
                  className={cn(
                    "text-sm px-6 py-2 whitespace-nowrap",
                    "w-full sm:w-auto"
                  )}
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with copyright and legal links */}
        <div className="mt-12 pt-8 border-t border-zinc-200/10">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 text-center">
            <div className={cn(
              "text-sm",
              theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
            )}>
              © 2024 Culixo. All rights reserved.
            </div>
            <div className="flex items-center justify-center gap-6">
              {legalLinks.map((item) => (
                <Link
                  key={item}
                  href="#"
                  className={cn(
                    "text-sm transition-colors duration-200",
                    theme === 'dark'
                      ? 'text-zinc-400 hover:text-white'
                      : 'text-zinc-600 hover:text-zinc-900'
                  )}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};