"use client";
// TODO: 4. Call the signOut() function when the button is clicked
// hint: You may want to change the first line of this file
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { publicEnv } from "@/lib/env/public";

export default function SignOutButton() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    if (session) {
      signOut({callbackUrl: publicEnv.NEXT_PUBLIC_BASE_URL});
    };
  };

  return <Button variant={"outline"} onClick={handleSignOut} data-testid="sign-out-button">Sign Out</Button>;
}
// TODO: 4. end
