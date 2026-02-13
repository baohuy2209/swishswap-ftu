"use client";
import { User } from "@/lib/generated/prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "@/actions/auth";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
const UserAction = ({ user }: { user: Omit<User, "password_hash"> | null }) => {
  const router = useRouter();
  if (!user) {
    return null;
  }
  return (
    <div className="w-fit flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage
              src={user.avatar_url ? user.avatar_url : "/image.png"}
              alt={user.name}
            />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link
                href="/profile"
                className="w-full flex flex-row justify-between items-center"
              >
                Thông tin cá nhân
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="/profile"
                className="w-full flex justify-between items-center"
              >
                <span>Hóa đơn</span>
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="/profile"
                className="w-full flex justify-between items-center"
              >
                Cài đặt
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <span
              onClick={() => {
                logoutUser();
                router.push("/");
              }}
            >
              Đăng xuất
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Bell />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default UserAction;
