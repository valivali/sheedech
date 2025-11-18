"use client";

import { Suspense } from "react";
import { useUser, SignInButton, UserButton } from "@/lib/auth";
import { Loading } from "@/components/UI/Loading";
import styles from "./UserMenu.module.scss";

function UserMenuContent() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button className={styles.signInButton}>Sign In</button>
      </SignInButton>
    );
  }

  return (
    <div className={styles.userMenu}>
      <UserButton />
    </div>
  );
}

export function UserMenu() {
  return (
    <Suspense fallback={<Loading variant="dots" size="sm" />}>
      <UserMenuContent />
    </Suspense>
  );
}

