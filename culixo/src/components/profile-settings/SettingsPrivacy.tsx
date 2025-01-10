// components/profile-settings/SettingsPrivacy.tsx
"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  Shield, 
  Eye, 
  Lock, 
  Smartphone, 
  History, 
  UserX, 
  Download, 
  Key 
} from "lucide-react"
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const privacyFormSchema = z.object({
  profileVisibility: z.string(),
  recipePrivacy: z.string(),
  commentsPrivacy: z.string(),
  twoFactorEnabled: z.boolean(),
  loginNotifications: z.boolean(),
})

type PrivacyFormValues = z.infer<typeof privacyFormSchema>

const recentLogins = [
  {
    device: "Chrome on MacOS",
    location: "New York, USA",
    date: "Today, 2:34 PM",
    status: "Current"
  },
  {
    device: "Safari on iPhone",
    location: "New York, USA",
    date: "Yesterday",
    status: "Successful"
  },
  {
    device: "Firefox on Windows",
    location: "Chicago, USA",
    date: "Dec 24, 2024",
    status: "Successful"
  }
]

export function SettingsPrivacy() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacyFormSchema),
    defaultValues: {
      profileVisibility: "public",
      recipePrivacy: "public",
      commentsPrivacy: "everyone",
      twoFactorEnabled: false,
      loginNotifications: false,
    },
  })

  async function onSubmit(data: PrivacyFormValues) {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(data)
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Privacy & Security
        </h1>
        <p className="text-muted-foreground">
          Manage your privacy settings and account security
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Privacy Settings */}
          <Card className="rounded-xl shadow-sm dark:bg-[#0A0B14] dark:border-[#1d1e30] bg-white">
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your profile and recipes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="profileVisibility"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <FormLabel>Profile Visibility</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Choose who can see your profile
                        </p>
                      </div>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[160px] bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 shadow-sm dark:shadow-none">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-[#0A0B14] border-input dark:border-[#1d1e30]">
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="followers">Followers Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipePrivacy"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <FormLabel>Recipe Privacy</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Default privacy for new recipes
                        </p>
                      </div>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[160px] bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 shadow-sm dark:shadow-none">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-[#0A0B14] border-input dark:border-[#1d1e30]">
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="followers">Followers Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commentsPrivacy"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <FormLabel>Comments on Recipes</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Who can comment on your recipes
                        </p>
                      </div>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[160px] bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 shadow-sm dark:shadow-none">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-[#0A0B14] border-input dark:border-[#1d1e30]">
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="followers">Followers Only</SelectItem>
                        <SelectItem value="none">No One</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="rounded-xl shadow-sm dark:bg-[#0A0B14] dark:border-[#1d1e30] bg-white">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Enhance your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="twoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-x-2 rounded-lg border dark:border-[#1d1e30] p-4 bg-white/50 dark:bg-[#070810]">
                    <div className="flex items-center space-x-4">
                      <Key className="w-4 h-4 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <FormLabel>Two-Factor Authentication</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
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
                name="loginNotifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-x-2 rounded-lg border dark:border-[#1d1e30] p-4 bg-white/50 dark:bg-[#070810]">
                    <div className="flex items-center space-x-4">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <FormLabel>Login Notifications</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Get notified of new login attempts
                        </p>
                      </div>
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

              <div className="flex gap-3 pt-2">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                >
                  Save changes
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
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* Recent Logins */}
      <Card className="rounded-xl shadow-sm dark:bg-[#0A0B14] dark:border-[#1d1e30] bg-white">
        <CardHeader>
          <CardTitle>Recent Login Activity</CardTitle>
          <CardDescription>
            Monitor recent logins to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border dark:border-[#1d1e30] bg-white/50 dark:bg-[#070810]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/5 dark:hover:bg-muted/5">
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLogins.map((login, index) => (
                  <TableRow key={index} className="hover:bg-muted/5 dark:hover:bg-muted/5">
                    <TableCell>{login.device}</TableCell>
                    <TableCell>{login.location}</TableCell>
                    <TableCell>{login.date}</TableCell>
                    <TableCell className={login.status === "Current" ? "text-[#8B5CF6]" : ""}>
                      {login.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Controls */}
      <Card className="rounded-xl shadow-sm dark:bg-[#0A0B14] dark:border-[#1d1e30] bg-white">
        <CardHeader>
          <CardTitle>Additional Controls</CardTitle>
          <CardDescription>
            Manage other privacy and security features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border dark:border-[#1d1e30] p-4 bg-white/50 dark:bg-[#070810]">
            <div className="flex items-center space-x-4">
              <UserX className="w-4 h-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label>Blocked Accounts</Label>
                <p className="text-sm text-muted-foreground">
                  Manage your blocked accounts list
                </p>
              </div>
            </div>
            <Button variant="outline" className="bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] hover:bg-gray-50 dark:hover:bg-[#0A0B14] shadow-sm dark:shadow-none">
              Manage
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border dark:border-[#1d1e30] p-4 bg-white/50 dark:bg-[#070810]">
            <div className="flex items-center space-x-4">
              <Download className="w-4 h-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label>Download Your Data</Label>
                <p className="text-sm text-muted-foreground">
                  Get a copy of your Culixo data
                </p>
              </div>
            </div>
            <Button variant="outline" className="bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] hover:bg-gray-50 dark:hover:bg-[#0A0B14] shadow-sm dark:shadow-none">
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}