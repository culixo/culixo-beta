// src/components/community-guidelines/CommunityGuidelinesContent.tsx
'use client'

import React from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { 
  Users,
  MessageCircle,
  Shield,
  ThumbsUp,
  HeartHandshake,
  AlertTriangle,
  Flag,
  Heart,
  CheckCircle2,
  XCircle,
  Info,
  LucideIcon,
  Sparkles,
  HandHeart
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

/* eslint-disable react/no-unescaped-entities */
export const CommunityGuidelinesContent: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const guidelines: GuidelineItem[] = [
    {
      icon: HeartHandshake,
      title: "Respect & Kindness",
      content: (
        <>
          <p className="mb-4">Our community thrives on mutual respect and support:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Be kind and supportive to fellow community members</li>
            <li>Respect different skill levels and culinary backgrounds</li>
            <li>Celebrate diversity in cooking styles and traditions</li>
            <li>Provide constructive feedback when asked</li>
          </ul>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ExampleCard
              theme={theme}
              type="good"
              title="Supportive Comment"
              content="Great first attempt! Try reducing the heat next time for a more tender result."
            />
            <ExampleCard
              theme={theme}
              type="bad"
              title="Avoid"
              content='This looks terrible. You clearly can&apos;t cook.'
            />
          </div>
        </>
      )
    },
    {
      icon: MessageCircle,
      title: "Communication Guidelines",
      content: (
        <>
          <p className="mb-4">When interacting with the community:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use clear and respectful language</li>
            <li>Stay on topic in discussions</li>
            <li>Share experiences and knowledge constructively</li>
            <li>Ask questions when seeking clarification</li>
            <li>Acknowledge and appreciate helpful contributions</li>
          </ul>
          <div className="mt-6">
            <TipCard
              theme={theme}
              icon={Info}
              title="Communication Tip"
              content="When giving feedback, start with positive aspects before suggesting improvements."
            />
          </div>
        </>
      )
    },
    {
      icon: Shield,
      title: "Content Standards",
      content: (
        <>
          <p className="mb-4">All content must be:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Family-friendly and appropriate</li>
            <li>Original or properly credited</li>
            <li>Free from harassment or hate speech</li>
            <li>Non-promotional (unless in designated areas)</li>
            <li>Relevant to cooking and food</li>
          </ul>
          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-xl border bg-red-500/10 border-red-500/20">
              <h4 className={cn(
                "flex items-center gap-2 font-medium mb-2",
                theme === "dark" ? "text-white" : "text-zinc-900"
              )}>
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Prohibited Content
              </h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Spam or excessive self-promotion</li>
                <li>Harmful or dangerous content</li>
                <li>Personal attacks or bullying</li>
                <li>Inappropriate or offensive material</li>
              </ul>
            </div>
          </div>
        </>
      )
    },
    {
      icon: Flag,
      title: "Reporting & Moderation",
      content: (
        <>
          <p className="mb-4">Help keep our community safe:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Report inappropriate content or behavior</li>
            <li>Use the flagging system responsibly</li>
            <li>Provide context when reporting issues</li>
            <li>Follow moderator guidance and decisions</li>
          </ul>
          <div className="mt-6">
            <TipCard
              theme={theme}
              icon={Info}
              title="Reporting Tip"
              content="When reporting content, be specific about which community guideline has been violated."
            />
          </div>
        </>
      )
    },
    {
      icon: Sparkles,
      title: "Recognition & Rewards",
      content: (
        <>
          <p className="mb-4">Contributing positively to our community:</p>
          <div className="space-y-4">
            <div>
              <h4 className={cn(
                "font-medium mb-2",
                theme === "dark" ? "text-white" : "text-zinc-900"
              )}>Ways to Contribute:</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'Share Recipes',
                  'Give Feedback',
                  'Answer Questions',
                  'Share Tips',
                  'Post Photos',
                  'Write Reviews'
                ].map((item) => (
                  <span
                    key={item}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm",
                      theme === "dark"
                        ? "bg-white/10 text-white/90"
                        : "bg-zinc-100 text-zinc-700"
                    )}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className={cn(
            "text-4xl font-bold mb-4",
            theme === "dark" ? "text-white" : "text-zinc-900"
          )}>
            Community Guidelines
          </h1>
          <p className={cn(
            "text-lg max-w-2xl mx-auto",
            theme === "dark" ? "text-white/70" : "text-zinc-600"
          )}>
            Join our supportive cooking community. These guidelines help create a 
            positive space where everyone can share their culinary journey.
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

        {/* Community Spirit Section */}
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
          <HandHeart 
            className={cn(
              "w-8 h-8 mx-auto mb-4 transition-transform duration-300 hover:scale-110",
              theme === "dark" ? "text-white/70" : "text-zinc-600"
            )}
          />
          <h3 className={cn(
            "text-xl font-semibold mb-3",
            theme === "dark" ? "text-white" : "text-zinc-900"
          )}>
            Together We Create Something Special
          </h3>
          <p className={cn(
            "max-w-2xl mx-auto",
            theme === "dark" ? "text-white/70" : "text-zinc-600"
          )}>
            Our community grows stronger when we support each other. Share your knowledge,
            celebrate others' successes, and help fellow cooks grow. Every positive
            interaction makes our culinary community more vibrant and welcoming for everyone.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={cn(
              "p-4 rounded-xl border",
              theme === "dark" 
                ? "bg-white/5 border-white/10" 
                : "bg-zinc-50 border-zinc-200"
            )}>
              <Users className={cn(
                "w-6 h-6 mx-auto mb-2",
                theme === "dark" ? "text-white/70" : "text-zinc-600"
              )} />
              <h4 className={cn(
                "font-medium mb-1",
                theme === "dark" ? "text-white" : "text-zinc-900"
              )}>Be Inclusive</h4>
              <p className={cn(
                "text-sm",
                theme === "dark" ? "text-white/70" : "text-zinc-600"
              )}>Welcome cooks of all skill levels</p>
            </div>

            <div className={cn(
              "p-4 rounded-xl border",
              theme === "dark" 
                ? "bg-white/5 border-white/10" 
                : "bg-zinc-50 border-zinc-200"
            )}>
              <ThumbsUp className={cn(
                "w-6 h-6 mx-auto mb-2",
                theme === "dark" ? "text-white/70" : "text-zinc-600"
              )} />
              <h4 className={cn(
                "font-medium mb-1",
                theme === "dark" ? "text-white" : "text-zinc-900"
              )}>Stay Positive</h4>
              <p className={cn(
                "text-sm",
                theme === "dark" ? "text-white/70" : "text-zinc-600"
              )}>Encourage and support others</p>
            </div>

            <div className={cn(
              "p-4 rounded-xl border",
              theme === "dark" 
                ? "bg-white/5 border-white/10" 
                : "bg-zinc-50 border-zinc-200"
            )}>
              <Heart className={cn(
                "w-6 h-6 mx-auto mb-2",
                theme === "dark" ? "text-white/70" : "text-zinc-600"
              )} />
              <h4 className={cn(
                "font-medium mb-1",
                theme === "dark" ? "text-white" : "text-zinc-900"
              )}>Share Knowledge</h4>
              <p className={cn(
                "text-sm",
                theme === "dark" ? "text-white/70" : "text-zinc-600"
              )}>Help others learn and grow</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* eslint-enable react/no-unescaped-entities */

export default CommunityGuidelinesContent;
