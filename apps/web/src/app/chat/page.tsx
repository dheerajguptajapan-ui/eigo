"use client"

import { useState, useEffect, useRef } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Send, Sparkles, User, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [scenarioId, setScenarioId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: scenarios, isLoading: isLoadingScenarios } = useQuery({
    queryKey: ["scenarios"],
    queryFn: async () => {
      const response = await api.get("/ai/scenarios")
      return response.data
    },
  })

  const chatMutation = useMutation({
    mutationFn: async (newMessages: any[]) => {
      const response = await api.post("/ai/chat", { scenarioId, messages: newMessages })
      return response.data
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, data])
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const startScenario = (scenario: any) => {
    setScenarioId(scenario.id)
    setMessages([{ role: "assistant", content: scenario.initial_message }])
  }

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return
    const userMsg = { role: "user", content: input }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput("")
    chatMutation.mutate(updatedMessages)
  }

  if (!scenarioId) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
        <header className="w-full max-w-4xl flex items-center mb-12">
          <Link href="/" className="text-slate-500 font-bold hover:text-indigo-600 transition-colors">
            <ChevronLeft className="inline mr-1 h-5 w-5" />
            戻る
          </Link>
        </header>
        <div className="text-center space-y-4 mb-12">
          <div className="h-20 w-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-200">
            <MessageCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-800">AI会話練習</h1>
          <p className="text-slate-500 font-medium text-lg">好きなシチュエーションを選んで、英語で話してみましょう！</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 w-full max-w-4xl">
          {isLoadingScenarios ? (
            <div className="col-span-2 text-center py-12">読み込み中...</div>
          ) : (
            scenarios?.map((s: any) => (
              <Card key={s.id} className="border-none shadow-lg hover:shadow-2xl transition-all cursor-pointer group rounded-3xl overflow-hidden bg-white" onClick={() => startScenario(s)}>
                <CardContent className="p-8 flex flex-col items-start h-full">
                  <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors text-indigo-600">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">{s.title_ja}</h3>
                  <p className="text-slate-500 font-medium mb-8 leading-relaxed">{s.description_ja}</p>
                  <Button variant="ghost" className="mt-auto font-black text-indigo-600 p-0 group-hover:translate-x-2 transition-transform">
                    練習を始める →
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <header className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setScenarioId(null)} className="mr-2 rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-black text-slate-800">
              {scenarios?.find((s: any) => s.id === scenarioId)?.title_ja}
            </h2>
            <div className="flex items-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              AI Tutor Online
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 ml-3' : 'bg-slate-200 mr-3'}`}>
                {msg.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Sparkles className="h-4 w-4 text-slate-500" />}
              </div>
              <div className={`p-4 rounded-3xl font-medium leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="flex items-end">
              <div className="h-8 w-8 rounded-full bg-slate-100 mr-3 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-slate-400" />
              </div>
              <div className="bg-white p-4 rounded-3xl rounded-bl-none shadow-sm flex space-x-1.5">
                <div className="h-2 w-2 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="h-2 w-2 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="h-2 w-2 bg-slate-200 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <Input 
            className="h-14 border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-500 rounded-2xl px-6 font-medium"
            placeholder="Type your message in English..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={chatMutation.isPending}
          />
          <Button 
            className="h-14 w-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg shadow-indigo-100 flex-shrink-0 transition-all active:scale-90"
            onClick={handleSend}
            disabled={chatMutation.isPending || !input.trim()}
          >
            <Send className="h-6 w-6" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
