"use client"

import { GraduationCap, ArrowRight, Globe } from "lucide-react"

export default function LoginPage() {
  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = (formData.get("email") as string) || "user@example.com"

    // Mock login — any email + any password works instantly
    const displayName = email.split("@")[0]
    const mockUser = {
      id: "mock-" + displayName + "-" + Date.now(),
      email,
      display_name: displayName,
      current_level: "beginner",
      streak_count: 0,
    }
    localStorage.setItem("token", "mock-token-" + Date.now())
    localStorage.setItem("user", JSON.stringify(mockUser))

    // Hard redirect — bypasses any Next.js router/basePath confusion
    window.location.href = "/eigo/"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8">

        {/* Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-16 w-16 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-200 mb-2">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-indigo-950">Eigo Master</h1>
          <p className="text-slate-500 font-medium italic">英語マスターへの第一歩</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-indigo-100/50 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">ログイン</h2>
            <p className="text-slate-500 font-medium mb-6">
              任意のメールアドレスとパスワードでログインできます
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1">
                  メールアドレス
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  defaultValue="demo@example.com"
                  required
                  className="w-full h-12 px-4 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                    パスワード
                  </label>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  defaultValue="demo123"
                  required
                  className="w-full h-12 px-4 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                ログイン
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-bold tracking-widest">または他でログイン</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="h-12 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
              >
                <Globe className="h-5 w-5" />
                Google
              </button>
              <button
                type="button"
                className="h-12 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
              >
                <div className="h-5 w-5 rounded-full bg-[#00B900] flex items-center justify-center text-[10px] text-white font-bold">L</div>
                LINE
              </button>
            </div>
          </div>

          <div className="bg-slate-50/50 flex flex-col items-center py-6 border-t border-slate-100">
            <p className="text-sm text-slate-500 font-medium">アカウントをお持ちではありませんか？</p>
            <a href="/eigo/" className="text-indigo-600 font-black hover:text-indigo-700 hover:underline mt-1">
              デモとして入る (無料)
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
