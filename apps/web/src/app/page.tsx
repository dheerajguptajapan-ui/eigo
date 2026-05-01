"use client"

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Star, BookOpen, GraduationCap, ChevronRight, Trophy, Map } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const { data: dueCards, isLoading: isLoadingDue } = useQuery({
    queryKey: ["dueCards"],
    queryFn: async () => {
      if (!user) return [];
      const response = await api.get("/srs/due");
      return response.data;
    },
    enabled: !!user,
  });

  const dueCount = dueCards?.length || 0;
  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-indigo-950">おかえりなさい、{user?.display_name || "学習者"}さん！</h2>
          <p className="text-muted-foreground font-medium">今日も英語の練習を続けましょう。継続は力なり！</p>
        </div>
        <div className="flex items-center space-x-4">
          <Card className="flex items-center gap-2 px-4 py-2 border-orange-200 bg-orange-50 shadow-sm">
            <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
            <div className="text-lg font-bold text-orange-700">72 日</div>
            <span className="text-xs font-semibold text-orange-600/80 mt-0.5">連続！</span>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-md bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold opacity-90">現在のレベル</CardTitle>
            <GraduationCap className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black italic">英語の芽 (Me)</div>
            <p className="text-xs mt-1 opacity-80 font-medium leading-relaxed">
              次のランク: 英語の花 (Hana) まで 1,250 XP
            </p>
            <Progress value={75} className="mt-4 h-2 bg-white/20" />
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">今日の復習</CardTitle>
            <Star className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{isLoadingDue ? "読み込み中..." : `${dueCount} 単語`}</div>
            <p className="text-xs mt-1 text-slate-500 font-medium">
              {dueCount > 0 ? "忘れる前に復習して記憶を定着させましょう" : "今のところ復習する単語はありません！"}
            </p>
            <Button 
              size="sm" 
              className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-all active:scale-95 shadow-md"
              disabled={dueCount === 0 || isLoadingDue}
              asChild
            >
              <Link href="/review">復習を開始する</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">週間の目標</CardTitle>
            <Trophy className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">85% 達成</div>
            <p className="text-xs mt-1 text-slate-500 font-medium">
              今週はあと 150 XP で目標達成です
            </p>
            <div className="flex gap-1 mt-4">
              {[1, 2, 3, 4, 5, 0, 0].map((v, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${v ? 'bg-indigo-500' : 'bg-slate-100'}`} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">学習統計</CardTitle>
            <BookOpen className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">1,240 語</div>
            <p className="text-xs mt-1 text-slate-500 font-medium">
              マスターした合計単語数
            </p>
            <Button variant="ghost" size="sm" className="w-full mt-4 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-bold group">
              統計を見る <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-md overflow-hidden">
          <CardHeader className="bg-slate-900 text-white pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">おすすめのレッスン</CardTitle>
                <CardDescription className="text-slate-400 font-medium">
                  あなたのレベルに最適な次のステップ
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-indigo-500 text-white border-none font-bold">
                初級 (A1)
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[
                { title: "レストランでの注文", type: "会話・リスニング", xp: "+50 XP", color: "bg-rose-500" },
                { title: "過去形 (Basic Past Tense)", type: "文法", xp: "+40 XP", color: "bg-sky-500" },
                { title: "道案内をマスターする", type: "スピーキング", xp: "+60 XP", color: "bg-emerald-500" },
              ].map((lesson, i) => (
                <div key={i} className="flex items-center group cursor-pointer">
                  <div className={`h-12 w-12 rounded-2xl ${lesson.color} flex items-center justify-center text-white shadow-lg mr-4 transition-transform group-hover:scale-110`}>
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{lesson.title}</h4>
                    <p className="text-sm font-medium text-slate-500">{lesson.type}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-indigo-600">{lesson.xp}</span>
                    <Button variant="ghost" size="icon" className="ml-2 rounded-full hover:bg-slate-100">
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild className="w-full mt-8 bg-slate-900 hover:bg-slate-800 text-white font-bold py-6 rounded-xl shadow-lg transition-all active:scale-[0.98]">
              <Link href="/chat">会話練習を始める</Link>
            </Button>
            <Button asChild variant="outline" className="w-full mt-3 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold py-5 rounded-xl">
              <Link href="/curriculum"><Map className="mr-2 h-4 w-4" />カリキュラムを見る</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-none shadow-md overflow-hidden bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">ランキング</CardTitle>
            <CardDescription className="font-medium">
              今週のトップ学習者
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: "Tanaka S.", xp: "2,450 XP", rank: 1, color: "text-yellow-500" },
                { name: "Sato K.", xp: "2,120 XP", rank: 2, color: "text-slate-400" },
                { name: "Suzuki M.", xp: "1,980 XP", rank: 3, color: "text-amber-600" },
                { name: "You (あなた)", xp: "1,240 XP", rank: 12, color: "text-slate-400" },
              ].map((user, i) => (
                <div key={i} className={`flex items-center p-3 rounded-xl transition-colors ${user.name.includes("You") ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50'}`}>
                  <div className={`w-8 font-black text-lg ${user.color}`}>
                    {user.rank}
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-200 mr-3 overflow-hidden shadow-inner flex items-center justify-center font-bold text-slate-500">
                    {user.name[0]}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{user.name}</h4>
                  </div>
                  <div className="font-black text-slate-700">
                    {user.xp}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-8 border-slate-200 text-slate-600 font-bold py-6 rounded-xl hover:bg-slate-50 transition-colors">
              ランキング詳細
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
