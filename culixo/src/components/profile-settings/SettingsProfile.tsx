"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChefHat,
  Utensils,
  BookOpen,
  Award,
  Instagram,
  Link,
  Camera,
  X,
} from "lucide-react";
import { userService } from "@/services/userService";
import { useToast } from "@/components/ui/use-toast";
import { AvatarUploadModal } from "./AvatarUploadModal";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const profileFormSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50),
  bio: z.string().max(500, "Bio must be less than 500 characters"),
  expertise_level: z.string(),
  years_of_experience: z.string(),
  specialties: z.string().max(100),
  website_url: z.string().url().optional().or(z.literal("")),
  instagram_handle: z.string().max(30).optional().or(z.literal("")),
  twitter_handle: z.string().max(30).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const expertiseLevels = [
  { label: "Home Cook", value: "home_cook" },
  { label: "Culinary Student", value: "student" },
  { label: "Professional Chef", value: "professional" },
  { label: "Master Chef", value: "master" },
  { label: "Food Critic", value: "critic" },
];

const experienceYears = [
  { label: "< 1 year", value: "0-1" },
  { label: "1-3 years", value: "1-3" },
  { label: "3-5 years", value: "3-5" },
  { label: "5-10 years", value: "5-10" },
  { label: "10+ years", value: "10+" },
];

const getExpertiseLevelLabel = (value: string) =>
  expertiseLevels.find((level) => level.value === value)?.label || value;

const getExpertiseLevelValue = (label: string) =>
  expertiseLevels.find((level) => level.label === label)?.value || label;

export function SettingsProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<{
    full_name: string;
  } | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("/placeholder-chef.jpg");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: "",
      bio: "",
      expertise_level: "",
      years_of_experience: "",
      specialties: "",
      website_url: "",
      instagram_handle: "",
      twitter_handle: "",
    },
  });

  const fetchProfile = async () => {
    try {
      console.log("Fetching profile...");
      const profile = await userService.getProfile();
      console.log("Profile response:", profile);

      if (profile) {
        setUserDetails({
          full_name: profile.full_name,
        });

        setAvatarPreview(profile.avatar_url || "/placeholder-chef.jpg");

        form.reset({
          full_name: profile.full_name || "",
          bio: profile.bio || "",
          expertise_level:
            getExpertiseLevelValue(profile.expertise_level) || "",
          years_of_experience:
            experienceYears.find((y) => y.label === profile.years_of_experience)
              ?.value ||
            profile.years_of_experience ||
            "",
          specialties: profile.specialties || "",
          website_url: profile.website_url || "",
          instagram_handle: profile.instagram_handle || "",
          twitter_handle: profile.twitter_handle || "",
        });
        console.log("Form reset with values:", profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile details",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [form, toast]);

  const handleAvatarChange = async (file: File) => {
    try {
      setIsUploadingAvatar(true);
  
      // Upload to server
      const updatedProfile = await userService.uploadAvatar(file);
      
      if (updatedProfile.avatar_url) {
        // Update both local and global state with the same URL
        const timestamp = Date.now();
        const urlWithTimestamp = `${updatedProfile.avatar_url}${updatedProfile.avatar_url.includes('?') ? '&' : '?'}t=${timestamp}`;
        
        // Update local preview
        setAvatarPreview(urlWithTimestamp);
        
        // Update global state
        useAuth.getState().updateUser({
          avatar_url: updatedProfile.avatar_url  // Store original URL in global state
        });
      } else {
        setAvatarPreview("/placeholder-chef.jpg");
      }
  
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
  
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setIsUploadingAvatar(true);
      await userService.deleteAvatar();
      setAvatarPreview("/placeholder-chef.jpg");
      toast({
        title: "Success",
        description: "Profile picture removed successfully",
      });
    } catch (error: any) {
      console.error("Error deleting avatar:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsLoading(true);

      // Transform the data to match ProfileData interface
      const profileData = {
        full_name: data.full_name,
        bio: data.bio || null,
        expertise_level: getExpertiseLevelLabel(data.expertise_level),
        years_of_experience:
          experienceYears.find((y) => y.value === data.years_of_experience)
            ?.label || data.years_of_experience,
        specialties: data.specialties || null,
        website_url: data.website_url || null,
        instagram_handle: data.instagram_handle || null,
        twitter_handle: data.twitter_handle || null,
      };

      console.log("Submitting profile data:", profileData);
      const updatedProfile = await userService.updateProfile(profileData);

      setUserDetails({
        full_name: updatedProfile.full_name,
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      await fetchProfile();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Profile Settings
        </h1>
        <p className="text-muted-foreground">
          Customize your chef profile and expertise
        </p>
      </div>

      {/* Profile Overview */}
      <Card className="rounded-xl shadow-sm dark:bg-[#0A0B14] dark:border-[#1d1e30] bg-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar
                className="h-20 w-20 bg-white ring-2 ring-purple-100 dark:ring-[#1d1e30] cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                {avatarPreview && avatarPreview !== "/placeholder-chef.jpg" ? (
                  <AvatarImage
                    src={avatarPreview}
                    alt="Profile picture"
                    className="object-cover"
                    onError={() => setAvatarPreview("/placeholder-chef.jpg")}
                  />
                ) : (
                  <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-[#1d1e30] dark:text-white">
                    {userDetails?.full_name
                      ?.split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </AvatarFallback>
                )}
              </Avatar>

              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full" />
                <Camera
                  className="w-6 h-6 text-white z-10 cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-semibold">
                {userDetails?.full_name}
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card className="rounded-xl shadow-sm dark:bg-[#0A0B14] dark:border-[#1d1e30] bg-white">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Share your culinary background and expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <ChefHat className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          className="pl-9 bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 transition-colors shadow-sm dark:shadow-none"
                          placeholder="Enter your full name"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        className="bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 transition-colors shadow-sm dark:shadow-none min-h-[120px] resize-none"
                        placeholder="Tell us about your culinary journey..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground/70">
                      Share your cooking philosophy and experience
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="expertise_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expertise Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <div className="relative">
                            <Award className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                            <SelectTrigger className="pl-9 bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 shadow-sm dark:shadow-none">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-[#0A0B14] border-input dark:border-[#1d1e30]">
                          {expertiseLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-muted-foreground/70">
                        Select your cooking expertise level
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="years_of_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <div className="relative">
                            <BookOpen className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                            <SelectTrigger className="pl-9 bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 shadow-sm dark:shadow-none">
                              <SelectValue placeholder="Select experience" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-[#0A0B14] border-input dark:border-[#1d1e30]">
                          {experienceYears.map((year) => (
                            <SelectItem key={year.value} value={year.value}>
                              {year.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-muted-foreground/70">
                        Select your years of experience
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="specialties"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialties</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Utensils className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          className="pl-9 bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 transition-colors shadow-sm dark:shadow-none"
                          placeholder="e.g., French cuisine, Pastry, Italian..."
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-muted-foreground/70">
                      Separate multiple specialties with commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="website_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Link className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 transition-colors shadow-sm dark:shadow-none"
                            placeholder="https://your-website.com"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-muted-foreground/70">
                        Add your personal or professional website
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagram_handle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Instagram className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 transition-colors shadow-sm dark:shadow-none"
                            placeholder="@username"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-muted-foreground/70">
                        Add your Instagram username
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                >
                  {isLoading ? "Saving..." : "Save changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  className="bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] hover:bg-gray-50 dark:hover:bg-[#0A0B14] shadow-sm dark:shadow-none"
                  onClick={() => form.reset()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleAvatarChange}
        onDelete={handleDeleteAvatar}
        currentAvatar={avatarPreview}
      />
    </div>
  );
}
