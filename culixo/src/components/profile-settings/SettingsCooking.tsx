// components/profile-settings/SettingsCooking.tsx
"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  ChefHat, 
  Clock, 
  Scale, 
  Flame, 
  AlertCircle 
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"

const cuisineTypes = [
  'Italian',
  'Chinese', 
  'Indian',
  'Mexican',
  'Japanese',
  'Thai',
  'French',
  'Mediterranean',
  'American',
  'Korean',
  'Greek',
  'Vietnamese',
  'Other'
] as const

const dietCategories = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo',
  'Low-Carb',
  'Whole30',
  'Sugar-Free',
  'Nut-Free',
  'Kosher',
  'Halal'
] as const

// Common dropdown content component
const DropdownContent = ({ items }: { items: readonly string[] }) => (
  <SelectContent>
    <ScrollArea className="h-[200px]">
      {items.map((item) => (
        <SelectItem key={item} value={item.toLowerCase()}>
          {item}
        </SelectItem>
      ))}
    </ScrollArea>
  </SelectContent>
)

const cookingFormSchema = z.object({
  dietaryPreference: z.string(),
  allergyAlerts: z.boolean(),
  cuisine: z.string(),
  measurementSystem: z.string(),
  cookingTime: z.string(),
  spicePreference: z.string(),
})

type CookingFormValues = z.infer<typeof cookingFormSchema>

export function SettingsCooking() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CookingFormValues>({
    resolver: zodResolver(cookingFormSchema),
    defaultValues: {
      dietaryPreference: "",
      allergyAlerts: false,
      cuisine: "",
      measurementSystem: "metric",
      cookingTime: "45",
      spicePreference: "medium",
    },
  })

  async function onSubmit(data: CookingFormValues) {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(data)
    setIsLoading(false)
  }

  return (
    <div className="h-full">
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Cooking Preferences
          </h1>
          <p className="text-muted-foreground">
            Customize your cooking experience and recipe recommendations
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Dietary Preferences */}
            <Card className="rounded-xl shadow-sm dark:bg-[#0A0B14] dark:border-[#1d1e30] bg-white">
              <CardHeader>
                <CardTitle>Dietary Preferences</CardTitle>
                <CardDescription>
                  Select your dietary preferences and restrictions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="dietaryPreference"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <FormLabel>Diet Category</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Choose your primary dietary preference
                        </p>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-[200px] bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 shadow-sm dark:shadow-none">
                            <SelectValue placeholder="Select diet" />
                          </SelectTrigger>
                        </FormControl>
                        <DropdownContent items={dietCategories} />
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allergyAlerts"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-x-2 rounded-lg border dark:border-[#1d1e30] p-4 bg-white/50 dark:bg-[#070810]">
                      <div className="flex items-center space-x-4">
                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        <div className="space-y-0.5">
                          <FormLabel>Allergy Alerts</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Show warnings for recipes containing allergens
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
              </CardContent>
            </Card>

            {/* Cooking Style */}
            <Card className="rounded-xl shadow-sm dark:bg-[#0A0B14] dark:border-[#1d1e30] bg-white">
              <CardHeader>
                <CardTitle>Cooking Style</CardTitle>
                <CardDescription>
                  Tell us about your cooking preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="cuisine"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <FormLabel>Preferred Cuisine</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Choose your favorite cuisine type
                        </p>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-[200px] bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 shadow-sm dark:shadow-none">
                            <SelectValue placeholder="Select cuisine" />
                          </SelectTrigger>
                        </FormControl>
                        <DropdownContent items={cuisineTypes} />
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="measurementSystem"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <Scale className="w-4 h-4 text-muted-foreground" />
                        <div className="space-y-0.5">
                          <FormLabel>Measurement System</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Choose your preferred measurement units
                          </p>
                        </div>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-[200px] bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 shadow-sm dark:shadow-none">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-[#0A0B14] border-input dark:border-[#1d1e30]">
                          <SelectItem value="metric">Metric</SelectItem>
                          <SelectItem value="imperial">Imperial</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cookingTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div className="space-y-0.5">
                          <FormLabel>Preferred Cooking Time</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Maximum recipe preparation time
                          </p>
                        </div>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-[200px] bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 shadow-sm dark:shadow-none">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-[#0A0B14] border-input dark:border-[#1d1e30]">
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="any">Any duration</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="spicePreference"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <Flame className="w-4 h-4 text-muted-foreground" />
                        <div className="space-y-0.5">
                          <FormLabel>Spice Preference</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Your preferred spice level
                          </p>
                        </div>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-[200px] bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 shadow-sm dark:shadow-none">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-[#0A0B14] border-input dark:border-[#1d1e30]">
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hot">Hot</SelectItem>
                          <SelectItem value="extra-hot">Extra Hot</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-start">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
              >
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}