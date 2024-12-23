// src/components/sections/FeaturesSection.tsx
import { features } from '../../data';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import React from 'react';
import type { ThemeProps } from '@/types';
import { motion } from 'framer-motion';

export const FeaturesSection = ({ theme }: ThemeProps) => {
  return (
    <section className="py-20 relative">
      {" "}
      {/* Added background color to match the theme */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-28">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
            hidden: { opacity: 0 },
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 30 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div
                className={cn(
                  "group relative rounded-3xl overflow-hidden",
                  "transition-all duration-500",
                  "h-[420px]",
                  theme === "dark"
                    ? "bg-[#0A0A0C] hover:bg-[#0A0A0C]/80"
                    : "bg-white hover:bg-white/90",
                  "border",
                  theme === "dark" ? "border-white/[0.08]" : "border-zinc-100" // Lighter border
                )}
              >
                {/* Image */}
                <div className="h-[280px] overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={400} // Adjust based on your needs
                    height={280} // Match the container height
                    className={cn(
                      "w-full h-full object-cover",
                      "transition-transform duration-700",
                      "group-hover:scale-105"
                    )}
                  />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0">
                  <div
                    className={cn(
                      "p-6",
                      theme === "dark"
                        ? "bg-gradient-to-t from-[#0A0A0C] to-[#0A0A0C]/95"
                        : "bg-white" // Removed gradient in light mode
                    )}
                  >
                    {/* Title with Icon */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={cn(
                          "p-2 rounded-full",
                          theme === "dark" ? "bg-white/10" : "bg-zinc-50" // Lighter background for icon
                        )}
                      >
                        {React.cloneElement(
                          feature.icon as React.ReactElement,
                          {
                            className: cn(
                              "w-5 h-5",
                              theme === "dark" ? "text-white" : "text-[#6B46C1]"
                            ),
                          }
                        )}
                      </div>
                      <h3
                        className={cn(
                          "text-lg font-semibold",
                          theme === "dark" ? "text-white" : "text-zinc-900"
                        )}
                      >
                        {feature.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p
                      className={cn(
                        "text-base leading-relaxed",
                        theme === "dark" ? "text-zinc-300" : "text-zinc-600"
                      )}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};