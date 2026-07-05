import { SignIn } from "@clerk/react";
import { Link } from "react-router-dom";

export function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060816] px-4 py-8 text-white">
      <div className="w-full max-w-5xl rounded-[36px] border border-white/10 bg-black/20 p-6 backdrop-blur md:grid md:grid-cols-[1fr_440px] md:gap-8 md:p-10">
        <div className="mb-8 md:mb-0">
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">EatFit Access</div>
          <h1 className="mt-4 max-w-lg font-serif text-5xl leading-tight">
            Sign in to your nutrition operating board.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-400">
            Your dashboard keeps profile data, plan snapshots, grocery output, and AI coaching sessions in one place.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-full border border-white/10 px-5 py-3 text-sm text-zinc-200 transition hover:bg-white/5"
          >
            Back to official site
          </Link>
        </div>
        <div className="flex justify-center">
          <SignIn fallbackRedirectUrl="/app" signUpUrl="/sign-up" />
        </div>
      </div>
    </div>
  );
}
