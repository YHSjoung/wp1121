"use client";

import Link from "next/link";
import Image from "next/image";

import larry from "@/assets/larry.png";

import { LogOut } from "lucide-react";

export default function Header() {
  return (
    <aside className="flex h-screen flex-col justify-between px-4 py-10">
      <div className="flex items-center text-xl gap-4 w-full">
        <Image src={larry} alt="larry the messenger" className="h-10 w-10" />
        Messenger
      </div>
      <Link
        href="/"
        className="p-2 rounded-full hover:bg-gray-200  w-2/3 flex gap-4 text-md font-bold"
      >
        <LogOut />
        Logout
      </Link>
    </aside>
  );
}
