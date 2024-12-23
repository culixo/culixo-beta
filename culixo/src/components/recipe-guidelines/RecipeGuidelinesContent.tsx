"use client";
import React from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { 
  ChefHat, 
  Scale,
  Coffee,
  Camera,
  Tag,
  Heart,
  CheckCircle2,
  XCircle,
  LucideIcon,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface GuidelineSectionProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  theme: string | undefined;
  index: number;
}

interface ExampleCardProps {
  title: string;
  content: string;
  theme: string | undefined;
  type?: 'good' | 'bad';
}

interface GuidelineItem {
  icon: LucideIcon;
  title: string;
  content: React.ReactNode;
}

interface TipCardProps {
  icon: LucideIcon;
  title: string;
  content: string;
  theme: string | undefined;
}

const TipCard: React.FC<TipCardProps> = ({ icon: Icon, title, content, theme }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={cn(
      "p-4 rounded-xl border",
      "transition-all duration-300",
      theme === "dark" 
        ? "bg-white/5 border-white/10" 
        : "bg-zinc-50/50 border-zinc-200"
    )}
  >
    <div className="flex items-center gap-2 mb-2">
      <Icon className={cn(
        "w-4 h-4",
        theme === "dark" ? "text-white/70" : "text-zinc-600"
      )} />
      <h4 className={cn(
        "font-medium",
        theme === "dark" ? "text-white" : "text-zinc-900"
      )}>
        {title}
      </h4>
    </div>
    <p className={cn(
      "text-sm",
      theme === "dark" ? "text-white/70" : "text-zinc-600"
    )}>
      {content}
    </p>
  </motion.div>
);

const GuidelineSection: React.FC<GuidelineSectionProps> = ({ icon: Icon, title, children, theme, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={cn(
      "p-6 rounded-2xl mb-6 group",
      "border transition-all duration-300",
      theme === "dark" 
        ? "bg-black/20 border-white/10 hover:bg-black/30" 
        : "bg-white border-zinc-200 hover:shadow-xl"
    )}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={cn(
        "p-2 rounded-xl transition-all duration-300 group-hover:scale-110",
        theme === "dark" ? "bg-white/10" : "bg-zinc-100"
      )}>
        <Icon className={cn(
          "w-5 h-5",
          theme === "dark" ? "text-white" : "text-zinc-900"
        )} />
      </div>
      <h3 className={cn(
        "text-lg font-semibold",
        theme === "dark" ? "text-white" : "text-zinc-900"
      )}>{title}</h3>
    </div>
    <div className={cn(
      "space-y-3",
      theme === "dark" ? "text-white/70" : "text-zinc-600"
    )}>
      {children}
    </div>
  </motion.div>
);

const ExampleCard: React.FC<ExampleCardProps> = ({ title, content, theme, type = 'good' }) => (
  <div className={cn(
    "p-4 rounded-xl border transition-all duration-300",
    "hover:scale-105",
    theme === "dark" 
      ? "bg-white/5 border-white/10" 
      : "bg-zinc-50 border-zinc-200",
    type === 'good' 
      ? theme === "dark" ? "hover:bg-green-500/10" : "hover:bg-green-50"
      : theme === "dark" ? "hover:bg-red-500/10" : "hover:bg-red-50"
  )}>
    <div className="flex items-center gap-2 mb-2">
      {type === 'good' ? (
        <CheckCircle2 className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
      <h4 className={cn(
        "font-medium",
        theme === "dark" ? "text-white" : "text-zinc-900"
      )}>
        {title}
      </h4>
    </div>
    <p className={cn(
      "text-sm",
      theme === "dark" ? "text-white/70" : "text-zinc-600"
    )}>
      {content}
    </p>
  </div>
);

export const RecipeGuidelinesContent: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Use useEffect to handle mounting state
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }

  const guidelines: GuidelineItem[] = [
    {
      icon: ChefHat,
      title: "Recipe Basics",
      content: (
        <>
          <p className="mb-4">Every recipe submission must include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>A descriptive title that accurately represents the dish</li>
            <li>
              Brief introduction or story behind the recipe (2-3 sentences)
            </li>
            <li>Estimated preparation and cooking time</li>
            <li>Serving size and yield information</li>
            <li>Difficulty level (Beginner, Intermediate, Advanced)</li>
            <li>Required equipment and tools</li>
          </ul>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <TipCard
              theme={theme}
              icon={Info}
              title="Pro Tip"
              content="Start with a hook that makes your recipe stand out. What makes it special or unique?"
            />
          </div>
        </>
      ),
    },
    {
      icon: Scale,
      title: "Ingredients",
      content: (
        <>
          <p className="mb-4">For a professional ingredients list:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>List ingredients in order of use</li>
            <li>Include both metric and imperial measurements</li>
            <li>
              Specify ingredient temperature if important (e.g., room
              temperature butter)
            </li>
            <li>Note potential substitutions for common allergens</li>
            <li>
              Group ingredients by section if recipe has multiple components
            </li>
          </ul>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ExampleCard
              theme={theme}
              type="good"
              title="Good Example"
              content="2 large eggs, room temperature (100g)"
            />
            <ExampleCard
              theme={theme}
              type="bad"
              title="Avoid"
              content="Some eggs"
            />
          </div>
        </>
      ),
    },
    {
      icon: Coffee,
      title: "Instructions",
      content: (
        <>
          <p className="mb-4">Instructions should be:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Written in clear, numbered steps</li>
            <li>
              Include visual cues (e.g., &ldquo;golden brown&rdquo;,
              &ldquo;translucent&rdquo;)
            </li>
            <li>Mention specific techniques and cookware</li>
            <li>Provide timing indicators for each step</li>
            <li>Include temperature settings where applicable</li>
          </ul>
          <div className="mt-6 space-y-4">
            <ExampleCard
              theme={theme}
              type="good"
              title="Good Example"
              content="1. Heat olive oil in a large skillet over medium heat until shimmering (about 2 minutes). Add diced onions and cook until translucent and golden around the edges, 5-7 minutes."
            />
            <ExampleCard
              theme={theme}
              type="bad"
              title="Avoid"
              content="1. Cook onions in oil until done"
            />
          </div>
        </>
      ),
    },
    {
      icon: Camera,
      title: "Photography",
      content: (
        <>
          <ul className="space-y-3">
            <li>Required photos:</li>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Main dish photo (minimum 1920x1080 pixels)</li>
              <li>2-3 key preparation steps</li>
              <li>Cross-section or texture detail</li>
              <li>Final plated presentation</li>
            </ul>
            <li className="mt-4">Photo guidelines:</li>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Use natural lighting when possible</li>
              <li>Sharp focus on the main subject</li>
              <li>Clean, uncluttered background</li>
              <li>No heavy filters or excessive editing</li>
              <li>Show actual food (no stock photos)</li>
            </ul>
          </ul>
          <div className="mt-6">
            <TipCard
              theme={theme}
              icon={Info}
              title="Photography Tip"
              content="Take photos in landscape orientation for better display across devices. Shoot from multiple angles to show the dish's best features."
            />
          </div>
        </>
      ),
    },
    {
      icon: Tag,
      title: "Tags & Categories",
      content: (
        <>
          <p className="mb-4">
            Help users find your recipe with proper categorization:
          </p>
          <div className="space-y-4">
            <div>
              <h4
                className={cn(
                  "font-medium mb-2",
                  theme === "dark" ? "text-white" : "text-zinc-900"
                )}
              >
                Required Tags:
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Cuisine Type",
                  "Main Ingredient",
                  "Meal Type",
                  "Cooking Method",
                  "Difficulty Level",
                  "Preparation Time",
                ].map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm",
                      theme === "dark"
                        ? "bg-white/10 text-white/90"
                        : "bg-zinc-100 text-zinc-700"
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4
                className={cn(
                  "font-medium mb-2",
                  theme === "dark" ? "text-white" : "text-zinc-900"
                )}
              >
                Optional Tags:
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Dietary",
                  "Season",
                  "Occasion",
                  "Course",
                  "Equipment Used",
                  "Serving Style",
                ].map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm border",
                      theme === "dark"
                        ? "border-white/10 text-white/70"
                        : "border-zinc-200 text-zinc-600"
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1
            className={cn(
              "text-4xl font-bold mb-4",
              theme === "dark" ? "text-white" : "text-zinc-900"
            )}
          >
            Recipe Guidelines
          </h1>
          <p
            className={cn(
              "text-lg max-w-2xl mx-auto",
              theme === "dark" ? "text-white/70" : "text-zinc-600"
            )}
          >
            Create recipes that inspire our community. Follow these guidelines
            to ensure your recipes are clear, engaging, and helpful to other
            home cooks.
          </p>
        </motion.div>

        {guidelines.map((section, index) => (
          <GuidelineSection
            key={section.title}
            icon={section.icon}
            title={section.title}
            theme={theme}
            index={index}
          >
            {section.content}
          </GuidelineSection>
        ))}

        {/* Community Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={cn(
            "mt-12 p-8 rounded-2xl text-center",
            "border transition-all duration-300",
            theme === "dark"
              ? "bg-white/5 border-white/10"
              : "bg-zinc-50 border-zinc-200"
          )}
        >
          <Heart
            className={cn(
              "w-8 h-8 mx-auto mb-4 transition-transform duration-300 hover:scale-110",
              theme === "dark" ? "text-white/70" : "text-zinc-600"
            )}
          />
          <h3
            className={cn(
              "text-xl font-semibold mb-3",
              theme === "dark" ? "text-white" : "text-zinc-900"
            )}
          >
            Share Your Culinary Journey
          </h3>
          <p
            className={cn(
              "max-w-2xl mx-auto",
              theme === "dark" ? "text-white/70" : "text-zinc-600"
            )}
          >
            The best recipes tell a story and connect people through food. Share
            your cooking tips, ingredient variations, and personal touches that
            make your recipes unique. Your culinary knowledge could inspire
            someone else&apos;s kitchen adventure!
          </p>
        </motion.div>
      </div>
    </div>
  );
};