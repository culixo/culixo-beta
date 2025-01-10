"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Key, Globe, Trash2 } from "lucide-react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { userService } from "@/services/userService";
import { useToast } from "@/components/ui/use-toast";

const accountFormSchema = z.object({
  username: z.string().min(2).max(30),
  email: z.string().email(),
  language: z.string(),
});

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type AccountFormValues = z.infer<typeof accountFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const languages = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Italian", value: "it" },
];

export function SettingsAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<{
    username: string;
    email: string;
    full_name: string;
  } | null>(null);
  const { toast } = useToast();

  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      username: "",
      email: "",
      language: "en",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const details = await userService.getAccountDetails();
        setUserDetails(details);
        accountForm.reset({
          username: details.username,
          email: details.email,
          language: "en", // Default to English as language isn't stored in backend yet
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load account details",
          variant: "destructive",
        });
      }
    };

    fetchUserDetails();
  }, [accountForm, toast]);

  const onSubmitAccount = async (data: AccountFormValues) => {
    try {
      setIsLoading(true);
      await userService.updateUsername(data.username);
      toast({
        title: "Success",
        description: "Account details updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update account details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPassword = async (data: PasswordFormValues) => {
    try {
        setIsLoading(true);
        await userService.updatePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
        });
        
        // Clear the form
        passwordForm.reset();

        // Show success message
        toast({
            title: "Password Updated",
            description: "Your password has been successfully changed.",
            duration: 5000  // Show for 5 seconds
        });

    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message || "Failed to update password",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
};

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await userService.deleteAccount();
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted",
      });
      // Clear local storage and redirect to home
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Overview */}
      <Card className="rounded-xl shadow-sm dark:bg-[#0A0B14] dark:border-[#1d1e30] bg-white">
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="h-16 w-16 bg-white ring-2 ring-purple-100 dark:ring-[#1d1e30]">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Profile picture" />
            <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-[#1d1e30] dark:text-white">
              {userDetails?.full_name.split(" ").map(name => name[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{userDetails?.full_name}</h2>
            <p className="text-muted-foreground">{userDetails?.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="rounded-xl shadow-sm dark:bg-[#0A0B14] dark:border-[#1d1e30] bg-white">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...accountForm}>
            <form
              onSubmit={accountForm.handleSubmit(onSubmitAccount)}
              className="space-y-4"
            >
              <FormField
                control={accountForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          className="pl-9 bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 transition-colors shadow-sm dark:shadow-none"
                          placeholder="username"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={accountForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          className="pl-9 bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 transition-colors shadow-sm dark:shadow-none"
                          {...field}
                          disabled
                          readOnly
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={accountForm.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <div className="relative">
                          <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                          <SelectTrigger className="pl-9 bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 shadow-sm dark:shadow-none">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-[#0A0B14] border-input dark:border-[#1d1e30]">
                        {languages.map((language) => (
                          <SelectItem
                            key={language.value}
                            value={language.value}
                          >
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                  onClick={() => accountForm.reset()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card className="rounded-xl shadow-sm dark:bg-[#0A0B14] dark:border-[#1d1e30] bg-white">
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="password"
                          className="pl-9 bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 transition-colors shadow-sm dark:shadow-none"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="password"
                          className="pl-9 bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 transition-colors shadow-sm dark:shadow-none"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="password"
                          className="pl-9 bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] hover:border-muted dark:hover:border-[#1d1e30]/80 transition-colors shadow-sm dark:shadow-none"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                >
                  Update Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] hover:bg-gray-50 dark:hover:bg-[#0A0B14] shadow-sm dark:shadow-none"
                  onClick={() => passwordForm.reset()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Delete Account Section */}
      <Card className="rounded-xl shadow-sm bg-red-50 dark:bg-[#0A0B14] border-red-100 dark:border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-500">
            Delete Account
          </CardTitle>
          <CardDescription className="text-red-600/70 dark:text-red-500/70">
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/10 dark:text-red-500 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-[#0A0B14] border-input dark:border-[#1d1e30]">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white dark:bg-[#070810] border-input dark:border-[#1d1e30] hover:bg-gray-50 dark:hover:bg-[#0A0B14] shadow-sm dark:shadow-none">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}