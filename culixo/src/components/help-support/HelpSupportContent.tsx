"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import {
  Search,
  BookOpen,
  Utensils,
  Users,
  Mail,
  HelpCircle,
  MessageSquare,
  Ruler,
  GraduationCap,
  ChevronDown,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

interface QuickHelpProps {
  icon: React.ElementType;
  title: string;
  description: string;
  linkText: string;
}

interface GuideCardProps {
  title: string;
  description: string;
  steps: string[];
  icon: React.ElementType;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const QuickHelpCard: React.FC<QuickHelpProps> = ({ icon: Icon, title, description, linkText }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "p-6 rounded-2xl border group cursor-pointer",
        "transition-all duration-200",
        theme === 'dark' 
          ? "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900" 
          : "bg-white hover:shadow-lg border-zinc-200"
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-xl",
          theme === 'dark' ? "bg-zinc-800" : "bg-zinc-100"
        )}>
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className={cn(
            "font-semibold mb-1",
            theme === 'dark' ? "text-zinc-100" : "text-zinc-900"
          )}>
            {title}
          </h3>
          <p className={cn(
            "text-sm mb-3",
            theme === 'dark' ? "text-zinc-400" : "text-zinc-600"
          )}>
            {description}
          </p>
          <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
            {linkText}
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const GuideCard: React.FC<GuideCardProps> = ({ title, description, steps, icon: Icon }) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "rounded-2xl border overflow-hidden",
        theme === 'dark' ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-zinc-200"
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full p-6 text-left",
          "flex items-start justify-between gap-4",
          "transition-colors duration-200",
          theme === 'dark' 
            ? "hover:bg-zinc-900" 
            : "hover:bg-zinc-50"
        )}
      >
        <div className="flex items-start gap-4">
          <div className={cn(
            "p-3 rounded-xl",
            theme === 'dark' ? "bg-zinc-800" : "bg-zinc-100"
          )}>
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className={cn(
              "font-semibold mb-1",
              theme === 'dark' ? "text-zinc-100" : "text-zinc-900"
            )}>
              {title}
            </h3>
            <p className={cn(
              "text-sm",
              theme === 'dark' ? "text-zinc-400" : "text-zinc-600"
            )}>
              {description}
            </p>
          </div>
        </div>
        <ChevronDown 
          className={cn(
            "w-5 h-5 flex-shrink-0 transition-transform",
            isExpanded ? "rotate-180" : "",
            theme === 'dark' ? "text-zinc-400" : "text-zinc-600"
          )} 
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={cn(
              "p-6 border-t",
              theme === 'dark' ? "border-zinc-800" : "border-zinc-200"
            )}>
              <ol className="space-y-4">
                {steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full",
                      "flex items-center justify-center text-sm font-medium",
                      theme === 'dark' 
                        ? "bg-zinc-800 text-zinc-300" 
                        : "bg-zinc-100 text-zinc-700"
                    )}>
                      {index + 1}
                    </span>
                    <span className={cn(
                      "text-sm",
                      theme === 'dark' ? "text-zinc-300" : "text-zinc-700"
                    )}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const HelpSupportContent: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Use useEffect to handle mounting state
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1
            className={cn(
              "text-4xl font-bold mb-4",
              theme === "dark" ? "text-zinc-100" : "text-zinc-900"
            )}
          >
            How can we help you?
          </h1>
          <p
            className={cn(
              "text-lg mb-8",
              theme === "dark" ? "text-zinc-400" : "text-zinc-600"
            )}
          >
            Search our help center or browse the categories below
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search
                className={cn(
                  "w-5 h-5",
                  theme === "dark" ? "text-zinc-500" : "text-zinc-400"
                )}
              />
            </div>
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                "w-full pl-12 py-6 text-lg rounded-2xl",
                "transition-all duration-200",
                "border-2",
                isSearchFocused
                  ? "border-primary ring-2 ring-primary/20"
                  : theme === "dark"
                  ? "border-zinc-800 bg-zinc-900/50"
                  : "border-zinc-200 bg-white",
                theme === "dark" ? "text-zinc-100" : "text-zinc-900"
              )}
            />
          </div>
        </motion.div>

        {/* Quick Help Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <h2
            className={cn(
              "text-2xl font-semibold mb-8",
              theme === "dark" ? "text-zinc-100" : "text-zinc-900"
            )}
          >
            Quick Help
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickHelpCard
              icon={BookOpen}
              title="Getting Started"
              description="Learn the basics of using Culixo and create your first recipe"
              linkText="View guide"
            />
            <QuickHelpCard
              icon={Utensils}
              title="Recipe Creation"
              description="Tips and guidelines for creating engaging recipes"
              linkText="Learn more"
            />
            <QuickHelpCard
              icon={Users}
              title="Community Features"
              description="Discover how to interact with other food enthusiasts"
              linkText="Explore features"
            />
          </div>
        </motion.section>

        {/* Step-by-Step Guides Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <h2
            className={cn(
              "text-2xl font-semibold mb-8",
              theme === "dark" ? "text-zinc-100" : "text-zinc-900"
            )}
          >
            Step-by-Step Guides
          </h2>
          <div className="space-y-4">
            <GuideCard
              icon={GraduationCap}
              title="Creating Your First Recipe"
              description="Learn how to create and publish your recipes"
              steps={[
                "Click on 'Post Recipe' in the navigation bar",
                "Fill in your recipe title and description",
                "Add ingredients with precise measurements",
                "Write clear, step-by-step cooking instructions",
                "Upload high-quality photos of your dish",
                "Add tags and categorize your recipe",
                "Preview and publish your recipe",
              ]}
            />
            <GuideCard
              icon={Ruler}
              title="Kitchen Measurements Guide"
              description="Understanding recipe measurements and conversions"
              steps={[
                "Common volume measurements (cups, tablespoons, teaspoons)",
                "Weight measurements (grams, ounces, pounds)",
                "Temperature conversions (Fahrenheit to Celsius)",
                "Liquid measurement conversions",
                "Using kitchen scales effectively",
              ]}
            />
            <GuideCard
              icon={Users}
              title="Building Your Following"
              description="Tips for growing your cooking community"
              steps={[
                "Complete your profile with a bio and profile picture",
                "Share your culinary background and specialties",
                "Post recipes regularly",
                "Engage with other users' recipes",
                "Share your recipes on social media",
                "Respond to comments and questions",
              ]}
            />
          </div>
        </motion.section>

        {/* Support Options Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <h2
            className={cn(
              "text-2xl font-semibold mb-8",
              theme === "dark" ? "text-zinc-100" : "text-zinc-900"
            )}
          >
            Need More Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Support Card */}
            <motion.div
              variants={itemVariants}
              className={cn(
                "p-6 rounded-2xl border",
                theme === "dark"
                  ? "bg-zinc-900/50 border-zinc-800"
                  : "bg-white border-zinc-200"
              )}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={cn(
                    "p-3 rounded-xl",
                    theme === "dark" ? "bg-zinc-800" : "bg-zinc-100"
                  )}
                >
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3
                    className={cn(
                      "font-semibold",
                      theme === "dark" ? "text-zinc-100" : "text-zinc-900"
                    )}
                  >
                    Email Support
                  </h3>
                  <p
                    className={cn(
                      "text-sm",
                      theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                    )}
                  >
                    Response within 24 hours
                  </p>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() =>
                  (window.location.href = "mailto:support@culixo.com")
                }
              >
                Contact Support
              </Button>
            </motion.div>

            {/* Community Support Card */}
            <motion.div
              variants={itemVariants}
              className={cn(
                "p-6 rounded-2xl border",
                theme === "dark"
                  ? "bg-zinc-900/50 border-zinc-800"
                  : "bg-white border-zinc-200"
              )}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={cn(
                    "p-3 rounded-xl",
                    theme === "dark" ? "bg-zinc-800" : "bg-zinc-100"
                  )}
                >
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3
                    className={cn(
                      "font-semibold",
                      theme === "dark" ? "text-zinc-100" : "text-zinc-900"
                    )}
                  >
                    Community Forum
                  </h3>
                  <p
                    className={cn(
                      "text-sm",
                      theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                    )}
                  >
                    Get help from the community
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  /* Navigate to community forum */
                }}
              >
                Visit Forum
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Additional Resources Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2
            className={cn(
              "text-2xl font-semibold mb-8",
              theme === "dark" ? "text-zinc-100" : "text-zinc-900"
            )}
          >
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Resource Cards */}
            <motion.a
              href="#video-tutorials"
              variants={itemVariants}
              className={cn(
                "group p-6 rounded-2xl border",
                "transition-all duration-200",
                theme === "dark"
                  ? "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900"
                  : "bg-white hover:shadow-lg border-zinc-200"
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <h3
                  className={cn(
                    "font-semibold",
                    theme === "dark" ? "text-zinc-100" : "text-zinc-900"
                  )}
                >
                  Video Tutorials
                </h3>
                <ExternalLink
                  className={cn(
                    "w-4 h-4 transition-transform",
                    "group-hover:translate-x-1",
                    theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                  )}
                />
              </div>
              <p
                className={cn(
                  "text-sm",
                  theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                )}
              >
                Watch step-by-step tutorials on using Culixo
              </p>
            </motion.a>

            <motion.a
              href="#recipe-templates"
              variants={itemVariants}
              className={cn(
                "group p-6 rounded-2xl border",
                "transition-all duration-200",
                theme === "dark"
                  ? "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900"
                  : "bg-white hover:shadow-lg border-zinc-200"
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <h3
                  className={cn(
                    "font-semibold",
                    theme === "dark" ? "text-zinc-100" : "text-zinc-900"
                  )}
                >
                  Recipe Templates
                </h3>
                <ExternalLink
                  className={cn(
                    "w-4 h-4 transition-transform",
                    "group-hover:translate-x-1",
                    theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                  )}
                />
              </div>
              <p
                className={cn(
                  "text-sm",
                  theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                )}
              >
                Download recipe templates to get started
              </p>
            </motion.a>

            <motion.a
              href="#tips-tricks"
              variants={itemVariants}
              className={cn(
                "group p-6 rounded-2xl border",
                "transition-all duration-200",
                theme === "dark"
                  ? "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900"
                  : "bg-white hover:shadow-lg border-zinc-200"
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <h3
                  className={cn(
                    "font-semibold",
                    theme === "dark" ? "text-zinc-100" : "text-zinc-900"
                  )}
                >
                  Tips & Tricks
                </h3>
                <ExternalLink
                  className={cn(
                    "w-4 h-4 transition-transform",
                    "group-hover:translate-x-1",
                    theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                  )}
                />
              </div>
              <p
                className={cn(
                  "text-sm",
                  theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                )}
              >
                Expert tips for better recipe creation
              </p>
            </motion.a>
          </div>
        </motion.section>

        {/* Floating Help Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "fixed bottom-8 right-8",
            "h-14 px-6 rounded-full",
            "flex items-center gap-2",
            "shadow-lg",
            "bg-primary text-primary-foreground",
            "transition-transform duration-200"
          )}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">Need Help?</span>
        </motion.button>
      </div>
    </div>
  );
};

export default HelpSupportContent;