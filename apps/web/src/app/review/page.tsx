"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Volume2, CheckCircle2, RotateCcw, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ReviewPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [user, setUser] = useState<any>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
    else router.push("/login")
  }, [router])

  const { data: dueCards, isPending } = useQuery({
    queryKey: ["dueCards"],
    queryFn: async () => {
      const response = await api.get(`/srs/due?userId=${user.id}`)
      return response.data
    },
    enabled: !!user?.id,
  })

  const reviewMutation = useMutation({
    mutationFn: async ({ cardId, rating }: { cardId: string; rating: number }) => {
      const response = await api.post("/srs/review", { cardId, rating })
      return response.data
    },
    onSuccess: () => {
      setShowAnswer(false)
      if (currentIndex < (dueCards?.length || 0) - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        queryClient.invalidateQueries({ queryKey: ["dueCards"] })
      }
    },
  })

  if (!user || (isPending && !dueCards)) return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>

  if (!dueCards || dueCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center space-y-6 max-w-md">
          <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-800">お疲れ様でした！</h1>
          <p className="text-slate-500 font-medium">今日の復習はすべて完了しました。素晴らしい継続力です！</p>
          <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl">
            <Link href="/">ダッシュボードへ戻る</Link>
          </Button>
        </div>
      </div>
    )
  }

  const currentCard = dueCards[currentIndex]
  const progress = ((currentIndex) / dueCards.length) * 100

  const handleRate = (rating: number) => {
    reviewMutation.mutate({ cardId: currentCard.id, rating })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="p-6 flex items-center justify-between bg-white border-b border-slate-100">
        <Link href="/" className="flex items-center text-slate-500 font-bold hover:text-indigo-600 transition-colors">
          <ChevronLeft className="mr-1 h-5 w-5" />
          終了する
        </Link>
        <div className="flex-1 max-w-md mx-8">
          <div className="flex justify-between text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">
            <span>Progress</span>
            <span>{currentIndex + 1} / {dueCards.length}</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-100" />
        </div>
        <div className="w-20" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl perspective-1000">
          <Card 
            className={`min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-none shadow-2xl rounded-[2.5rem] transition-all duration-500 cursor-pointer ${showAnswer ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800'}`}
            onClick={() => !showAnswer && setShowAnswer(true)}
          >
            <CardContent className="space-y-8 w-full">
              {!showAnswer ? (
                <>
                  <Badge className="bg-indigo-50 text-indigo-600 border-none font-black px-4 py-1.5 rounded-full mb-4">
                    日本語を英語に
                  </Badge>
                  <h2 className="text-5xl font-black">{currentCard.vocabulary_item.japanese_translation}</h2>
                  <p className="text-slate-400 font-bold animate-pulse mt-8 flex items-center justify-center">
                    <HelpCircle className="mr-2 h-5 w-5" /> クリックして正解を表示
                  </p>
                </>
              ) : (
                <div className="animate-in fade-in zoom-in duration-300">
                  <h2 className="text-6xl font-black mb-2">{currentCard.vocabulary_item.english_word}</h2>
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <span className="text-xl font-medium opacity-80">{currentCard.vocabulary_item.ipa_phonetic}</span>
                    <Button size="icon" variant="ghost" className="rounded-full bg-white/20 hover:bg-white/30 text-white">
                      <Volume2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="h-px bg-white/20 w-full my-8" />
                  <p className="text-lg font-bold opacity-90 italic">
                    {currentCard.vocabulary_item.part_of_speech}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {showAnswer && (
          <div className="mt-12 w-full max-w-2xl grid grid-cols-4 gap-4 animate-in slide-in-from-bottom-8 duration-500">
            {[
              { label: "Again", rating: 1, sub: "忘れた", color: "bg-rose-500 hover:bg-rose-600", icon: RotateCcw },
              { label: "Hard", rating: 2, sub: "難しい", color: "bg-orange-500 hover:bg-orange-600", icon: HelpCircle },
              { label: "Good", rating: 3, sub: "正解", color: "bg-indigo-500 hover:bg-indigo-600", icon: CheckCircle2 },
              { label: "Easy", rating: 4, sub: "完璧", color: "bg-emerald-500 hover:bg-emerald-600", icon: StarIcon },
            ].map((btn) => (
              <Button
                key={btn.rating}
                onClick={() => handleRate(btn.rating)}
                className={`h-24 flex flex-col rounded-2xl shadow-lg transition-all active:scale-95 ${btn.color} text-white border-none`}
                disabled={reviewMutation.isPending}
              >
                <span className="font-black text-lg">{btn.label}</span>
                <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">{btn.sub}</span>
              </Button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  )
}
