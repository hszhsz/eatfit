import { SignIn } from "@clerk/react";
import { Link } from "react-router-dom";

export function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF9F2] px-4 py-8 text-[#1F1611]">
      <div className="w-full max-w-5xl rounded-[24px] border border-[#F0E6DD] bg-white p-6 shadow-warm md:grid md:grid-cols-[1fr_440px] md:gap-8 md:p-10">
        <div className="mb-8 md:mb-0">
          <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">EatFit Access</div>
          <h1 className="mt-4 max-w-lg font-serif text-5xl leading-tight">
            Sign in to your nutrition operating board.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#6B5544]">
            Your dashboard keeps profile data, plan snapshots, grocery output, and AI coaching sessions in one place.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-full border border-[#F0E6DD] px-5 py-3 text-sm text-[#3D2817] transition hover:bg-[#FFF5EE]"
          >
            Back to home
          </Link>
        </div>
        <div className="flex justify-center">
          <SignIn fallbackRedirectUrl="/app" signUpUrl="/sign-up" />
        </div>
      </div>
    </div>
  );
}
