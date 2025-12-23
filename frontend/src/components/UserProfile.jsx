import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";
import React from "react";

const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function UserProfile({ user, onLogout, onProfile, onSettings }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white hover:bg-accent transition-colors shadow-sm cursor-pointer border border-muted"
          aria-label="User menu"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatarUrl} alt={user?.name} />
            <AvatarFallback>
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start min-w-0">
            <span className="text-xs text-muted-foreground">Xin chào</span>
            <span className="font-semibold text-base truncate max-w-[120px]">
              {user?.name}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[220px]">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="font-semibold truncate">{user?.name}</span>
          <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onProfile} className="gap-2">
          <User className="w-4 h-4" />
          Tài khoản
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSettings} className="gap-2">
          <Settings className="w-4 h-4" />
          Cài đặt
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Usage example:
// <UserProfile
//   user={{ name: "Nguyễn Văn A", email: "a@gmail.com", avatarUrl: "https://..." }}
//   onLogout={() => ...}
//   onProfile={() => ...}
//   onSettings={() => ...}
// />
