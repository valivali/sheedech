import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 100%)",
      }}
    >
      <SignUp
        fallbackRedirectUrl="/onboarding"
        signInUrl="/sign-in"
      />
    </div>
  );
}

