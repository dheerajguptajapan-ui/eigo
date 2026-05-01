"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, ArrowRight, Globe } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/auth/login", data)
      return response.data
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      router.push("/")
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "ログインに失敗しました")
    },
  })

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")
    
    loginMutation.mutate({ email, password })
  }

  const isLoading = loginMutation.isPending

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-16 w-16 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-200 mb-2">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-indigo-950">
            Eigo Master
          </h1>
          <p className="text-slate-500 font-medium italic">
            英語マスターへの第一歩
          </p>
        </div>

        <Card className="border-none shadow-2xl shadow-indigo-100/50 overflow-hidden">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-2xl font-bold text-slate-800">ログイン</CardTitle>
            <CardDescription className="font-medium text-slate-500">
              メールアドレスとパスワードを入力してください
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="font-bold text-slate-700">メールアドレス</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-12 border-slate-200 focus:ring-2 focus:ring-indigo-500 rounded-xl font-medium"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-bold text-slate-700">パスワード</Label>
                  <Link 
                    href="#" 
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    パスワードを忘れた場合
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="h-12 border-slate-200 focus:ring-2 focus:ring-indigo-500 rounded-xl font-medium"
                  disabled={isLoading}
                  required
                />
              </div>
              {error && (
                <p className="text-sm font-bold text-rose-500 text-center">{error}</p>
              )}
              <Button 
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] mt-2" 
                disabled={isLoading}
              >
                {isLoading ? "ログイン中..." : "ログイン"}
                {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-bold tracking-widest">
                  または他でログイン
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">
                <Globe className="mr-2 h-5 w-5" />
                Google
              </Button>
              <Button variant="outline" className="h-12 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">
                <div className="mr-2 h-5 w-5 rounded-full bg-[#00B900] flex items-center justify-center text-[10px] text-white font-bold">L</div>
                LINE
              </Button>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50/50 flex flex-col items-center py-6 border-t border-slate-100">
            <p className="text-sm text-slate-500 font-medium">
              アカウントをお持ちではありませんか？
            </p>
            <Link 
              href="/register" 
              className="text-indigo-600 font-black hover:text-indigo-700 hover:underline mt-1"
            >
              新しくアカウントを作成する (無料)
            </Link>
          </CardFooter>
        </Card>

        <p className="px-8 text-center text-xs text-slate-400 leading-relaxed font-medium">
          ログインすることで、当社の{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-indigo-500 transition-colors">
            利用規約
          </Link>{" "}
          および{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-indigo-500 transition-colors">
            プライバシーポリシー
          </Link>{" "}
          に同意したものとみなされます。
        </p>
      </div>
    </div>
  )
}
