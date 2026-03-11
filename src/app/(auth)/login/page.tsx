import Link from "next/link";
import { ArrowLeft, User, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background text-foreground font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">

      {/* Navigation Bar (Minimal) */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <div className="font-heading text-xl tracking-tighter mix-blend-difference">
          TIC
        </div>
      </nav>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-black/5 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl">
        <div className="flex flex-col space-y-2 text-center mb-10">
          <h1 className="text-3xl font-heading tracking-tight">Welcome back</h1>
          <p className="text-[11px] uppercase tracking-widest text-foreground/60 max-w-[250px] mx-auto leading-relaxed">
            ENTER YOUR CREDENTIALS TO ACCESS YOUR ACCOUNT
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full pl-11 pr-4 py-3 bg-transparent border-b border-black/20 dark:border-white/20 focus:border-foreground outline-none transition-colors placeholder:text-[11px] placeholder:uppercase placeholder:tracking-widest text-sm"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="password"
                placeholder="PASSWORD"
                className="w-full pl-11 pr-4 py-3 bg-transparent border-b border-black/20 dark:border-white/20 focus:border-foreground outline-none transition-colors placeholder:text-[11px] placeholder:uppercase placeholder:tracking-widest text-sm"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest mt-6 mb-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-black/20 dark:border-white/20 bg-transparent" />
              <span className="text-foreground/80 mt-0.5">REMEMBER ME</span>
            </label>
            <Link href="#" className="font-medium hover:text-foreground text-foreground/80 transition-colors">
              FORGOT PASSWORD?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-8 bg-foreground text-white dark:text-black font-medium text-xs uppercase tracking-[0.2em] rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
          >
            SIGN IN
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] sm:text-[11px] uppercase tracking-widest text-foreground/60 flex items-center justify-center gap-1">
          DON&apos;T HAVE AN ACCOUNT?{" "}
          <Link href="/register" className="font-semibold text-foreground transition-colors hover:text-foreground/80">
            REQUEST ACCESS
          </Link>
        </div>
      </div>
    </div>
  );
}
