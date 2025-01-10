// components/profile-settings/SettingsNotifications.tsx
"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  Bell, 
  Mail,
  Smartphone,
  Heart,
  MessageSquare,
  Trophy,
  UserPlus,
  Settings,
  Megaphone
} from "lucide-react"

import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Schema definitions remain the same
const notificationsFormSchema = z.object({
  channels: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true)
  }),
  emailDigest: z.enum(["daily", "weekly", "none"]),
  notifications: z.object({
    newFollowers: z.boolean().default(true),
    recipeLikes: z.boolean().default(true),
    comments: z.boolean().default(true),
    featured: z.boolean().default(true)
  })
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

export function SettingsNotifications() {
  const [isLoading, setIsLoading] = useState(false)

  // Form initialization remains the same
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      channels: {
        email: true,
        push: true
      },
      emailDigest: "daily",
      notifications: {
        newFollowers: true,
        recipeLikes: true,
        comments: true,
        featured: true
      }
    }
  })

  const watchChannels = form.watch("channels")
  const watchNotifications = form.watch("notifications")
  const enabledCount = Object.values(watchNotifications).filter(Boolean).length

  async function onSubmit(data: NotificationsFormValues) {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    console.log(data)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Notification Settings
        </h1>
        <p className="text-muted-foreground">
          Choose how you want to be notified about activity
        </p>
      </div>

      {/* Overview Card */}
      <Card className="rounded-xl shadow-sm dark:bg-[#0A0B14] dark:border-[#1d1e30] bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center">
                <Bell className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <div>
                <h2 className="font-semibold">Active Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  {enabledCount} notification types enabled
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {/* Notification Channels */}
            <AccordionItem value="channels" className="rounded-xl border-input dark:border-[#1d1e30] dark:bg-[#0A0B14] bg-white shadow-sm">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Notification Channels</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="channels.email"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border dark:border-[#1d1e30] p-4 bg-white/50 dark:bg-[#070810]">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                          </div>
                          <FormDescription>
                            Receive notifications via email
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="channels.push"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border dark:border-[#1d1e30] p-4 bg-white/50 dark:bg-[#070810]">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Smartphone className="mr-2 h-4 w-4 text-muted-foreground" />
                            <FormLabel className="text-base">Push Notifications</FormLabel>
                          </div>
                          <FormDescription>
                            Receive notifications on your device
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchChannels.email && (
                    <FormField
                      control={form.control}
                      name="emailDigest"
                      render={({ field }) => (
                        <FormItem className="space-y-3 pt-2 px-4">
                          <FormLabel>Email Digest Frequency</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="daily" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Daily digest
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="weekly" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Weekly digest
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="none" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Turn off digest
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Notification Types */}
            <AccordionItem value="types" className="rounded-xl border-input dark:border-[#1d1e30] dark:bg-[#0A0B14] bg-white shadow-sm">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4" />
                  <span>Notification Types</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notifications.newFollowers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border dark:border-[#1d1e30] p-4 bg-white/50 dark:bg-[#070810]">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <UserPlus className="mr-2 h-4 w-4 text-muted-foreground" />
                            <FormLabel className="text-base">New Followers</FormLabel>
                          </div>
                          <FormDescription>
                            When someone follows your profile
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notifications.recipeLikes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border dark:border-[#1d1e30] p-4 bg-white/50 dark:bg-[#070810]">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Heart className="mr-2 h-4 w-4 text-muted-foreground" />
                            <FormLabel className="text-base">Recipe Likes</FormLabel>
                          </div>
                          <FormDescription>
                            When someone likes your recipes
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notifications.comments"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border dark:border-[#1d1e30] p-4 bg-white/50 dark:bg-[#070810]">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                            <FormLabel className="text-base">Comments</FormLabel>
                          </div>
                          <FormDescription>
                            When someone comments on your recipes
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notifications.featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border dark:border-[#1d1e30] p-4 bg-white/50 dark:bg-[#070810]">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Trophy className="mr-2 h-4 w-4 text-muted-foreground" />
                            <FormLabel className="text-base">Featured Recipes</FormLabel>
                          </div>
                          <FormDescription>
                            When your recipe gets featured
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
            >
              Save preferences
            </Button>
            <Button
              type="button"
              variant="outline"
              className="bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] hover:bg-gray-50 dark:hover:bg-[#0A0B14] shadow-sm dark:shadow-none"
              onClick={() => form.reset()}
            >
              Reset to defaults
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}