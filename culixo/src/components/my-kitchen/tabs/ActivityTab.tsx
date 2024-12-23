import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Heart, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Mock data for activity
const mockActivity = [
  {
    id: "1",
    type: "comment" as const,
    userId: "user2",
    userImage: "/api/placeholder/32/32",
    userName: "Sarah Johnson",
    recipeName: "Homemade Pizza",
    timestamp: "2 hours ago"
  },
  {
    id: "2",
    type: "like" as const,
    userId: "user3",
    userImage: "/api/placeholder/32/32",
    userName: "Mike Brown",
    recipeName: "Chicken Tikka",
    timestamp: "4 hours ago"
  },
  {
    id: "3",
    type: "follow" as const,
    userId: "user4",
    userImage: "/api/placeholder/32/32",
    userName: "Emma Wilson",
    timestamp: "1 day ago"
  },
]

const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }
  
  export default function ActivityTab() {
    return (
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {mockActivity.map((activity) => (
          <motion.div 
            key={activity.id}
            variants={item} 
            className={cn(
              "group relative overflow-hidden rounded-xl border bg-card/50",
              "backdrop-blur-sm transition-all duration-300",
              "hover:bg-card hover:shadow-lg hover:shadow-primary/5"
            )}
          >
            <div className="relative flex items-start gap-4 p-4">
              {/* Activity Icon - Positioned as accent */}
              <div className="absolute right-4 top-4">
                {activity.type === "comment" && (
                  <div className="rounded-full bg-blue-500/10 p-2.5 transition-transform group-hover:scale-110">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                  </div>
                )}
                {activity.type === "like" && (
                  <div className="rounded-full bg-red-500/10 p-2.5 transition-transform group-hover:scale-110">
                    <Heart className="h-4 w-4 text-red-500" />
                  </div>
                )}
                {activity.type === "follow" && (
                  <div className="rounded-full bg-green-500/10 p-2.5 transition-transform group-hover:scale-110">
                    <UserPlus className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
  
              {/* Avatar with subtle hover effect */}
              <div className="relative">
                <Avatar className="h-12 w-12 transition-transform duration-300 group-hover:scale-105">
                  <AvatarImage src={activity.userImage} />
                  <AvatarFallback className="text-base">
                    {activity.userName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
              </div>
              
              {/* Content with improved typography */}
              <div className="flex-1 space-y-1 pr-12">
                <div className="flex flex-col gap-1">
                  <div className="flex items-start justify-between">
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold text-foreground hover:text-primary cursor-pointer transition-colors">
                        {activity.userName}
                      </span>
                      <span className="text-muted-foreground">
                        {activity.type === "comment" && (
                          <>
                            {" "}commented on{" "}
                            <span className="font-medium text-foreground hover:text-primary cursor-pointer transition-colors">
                              {activity.recipeName}
                            </span>
                          </>
                        )}
                        {activity.type === "like" && (
                          <>
                            {" "}liked your{" "}
                            <span className="font-medium text-foreground hover:text-primary cursor-pointer transition-colors">
                              {activity.recipeName}
                            </span>
                          </>
                        )}
                        {activity.type === "follow" && " started following you"}
                      </span>
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </div>
  
            {/* Subtle hover effect line */}
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </motion.div>
        ))}
      </motion.div>
    )
  }