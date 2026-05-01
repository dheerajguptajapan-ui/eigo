'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, BookOpen, Headphones, FileText, Layers, Lock, CheckCircle, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const LEVELS = [
  {
    id: 'elementary',
    nameJa: '小学生レベル',
    nameEn: 'Elementary',
    tagline: 'アルファベットから基本会話まで',
    color: 'from-emerald-400 to-green-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    locked: false,
    cefr: 'A1–A2',
    desc: '挨拶・自己紹介・基本単語・be動詞など、英語学習のスタートに必要な基礎をマスターします。',
  },
  {
    id: 'chugaku',
    nameJa: '中学生レベル',
    nameEn: 'Chugaku',
    tagline: '日常会話から社会的テーマまで',
    color: 'from-sky-400 to-blue-500',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    badge: 'bg-sky-500',
    textColor: 'text-sky-700',
    locked: false,
    cefr: 'B1',
    desc: '現在完了・受動態・仮定法など、学校で習う文法と、環境・社会問題を扱う実用的な英語を学びます。',
  },
  {
    id: 'kougaku',
    nameJa: '高校生レベル',
    nameEn: 'Kougaku',
    tagline: '学術英語・ディベート・長文読解',
    color: 'from-violet-400 to-purple-500',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    badge: 'bg-violet-500',
    textColor: 'text-violet-700',
    locked: false,
    cefr: 'B2',
    desc: '分詞構文・相関接続詞・批評的思考など、大学入試や英検2級レベルの高度な英語表現を習得します。',
  },
  {
    id: 'advanced',
    nameJa: '上級者レベル',
    nameEn: 'Advanced',
    tagline: 'ネイティブ表現・学術論文・哲学的議論',
    color: 'from-rose-400 to-red-500',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    badge: 'bg-rose-500',
    textColor: 'text-rose-700',
    locked: false,
    cefr: 'C1–C2',
    desc: '倒置・仮定法過去完了・ニュアンス表現など、英語のネイティブスピーカーに近い表現力を鍛えます。',
  },
];

const TRACKS = [
  { id: 'vocabulary', nameJa: '単語', icon: Layers, color: 'text-amber-500', bg: 'bg-amber-50', desc: 'フラッシュカードとSRS復習' },
  { id: 'grammar', nameJa: '文法', icon: BookOpen, color: 'text-sky-500', bg: 'bg-sky-50', desc: 'パターン練習と例文' },
  { id: 'reading', nameJa: 'リーディング', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50', desc: '長文読解と設問' },
  { id: 'listening', nameJa: 'リスニング', icon: Headphones, color: 'text-violet-500', bg: 'bg-violet-50', desc: '音声と書き取り' },
];

export default function CurriculumPage() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const level = LEVELS.find(l => l.id === selectedLevel);

  if (selectedLevel && level) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedLevel(null)}
            className="flex items-center text-slate-500 hover:text-slate-800 font-bold mb-8 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" /> 戻る
          </button>

          <div className={`bg-gradient-to-r ${level.color} rounded-3xl p-8 text-white mb-8 shadow-xl`}>
            <Badge className="bg-white/20 text-white border-white/30 mb-3">{level.cefr}</Badge>
            <h1 className="text-3xl font-black mb-1">{level.nameJa}</h1>
            <p className="text-white/80 font-medium mb-3">{level.tagline}</p>
            <p className="text-white/70 text-sm leading-relaxed">{level.desc}</p>
          </div>

          <h2 className="text-xl font-black text-slate-800 mb-4">学習トラックを選択</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TRACKS.map((track) => {
              const Icon = track.icon;
              return (
                <Link href={`/curriculum/${selectedLevel}/${track.id}`} key={track.id}>
                  <Card className="border-none shadow-md hover:shadow-xl transition-all cursor-pointer group rounded-2xl overflow-hidden bg-white">
                    <CardContent className="p-6 flex items-center gap-5">
                      <div className={`h-14 w-14 rounded-2xl ${track.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-7 w-7 ${track.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-slate-800 text-lg mb-0.5">{track.nameJa}</h3>
                        <p className="text-sm text-slate-500 font-medium">{track.desc}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />)}
                        </div>
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
            <p className="text-sm font-bold text-indigo-700 mb-1">💡 ヒント: 単語をタップ！</p>
            <p className="text-sm text-indigo-600 leading-relaxed">
              会話練習やリーディング中に <strong>英単語をタップ or 長押し</strong> すると、日本語の意味・読み方・例文がポップアップ表示されます。
            </p>
          </div>

          <Button asChild className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-black py-6 rounded-2xl shadow-lg">
            <Link href="/chat">AI会話練習を始める →</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-colors">
            <ChevronLeft className="h-5 w-5 mr-1" /> ホームへ
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-3">📚 カリキュラム</h1>
          <p className="text-slate-500 font-medium text-lg">レベルを選んで学習を始めましょう</p>
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            {TRACKS.map(t => {
              const Icon = t.icon;
              return (
                <span key={t.id} className={`flex items-center gap-1.5 px-3 py-1.5 ${t.bg} rounded-full text-sm font-bold ${t.color}`}>
                  <Icon className="h-4 w-4" /> {t.nameJa}
                </span>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5">
          {LEVELS.map((level, idx) => (
            <button
              key={level.id}
              onClick={() => !level.locked && setSelectedLevel(level.id)}
              className="text-left w-full group focus:outline-none"
            >
              <Card className={`border-2 ${level.border} shadow-md group-hover:shadow-xl transition-all rounded-2xl overflow-hidden ${level.locked ? 'opacity-60' : ''}`}>
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-r ${level.color} px-6 py-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-black text-2xl">{idx + 1}</span>
                      <div>
                        <div className="font-black text-white text-lg leading-tight">{level.nameJa}</div>
                        <div className="text-white/70 text-xs font-medium">{level.nameEn} · {level.cefr}</div>
                      </div>
                    </div>
                    {level.locked ? <Lock className="h-6 w-6 text-white/60" /> : <span className="text-white font-bold text-sm group-hover:translate-x-1 transition-transform">→</span>}
                  </div>
                  <div className={`${level.bg} px-6 py-4`}>
                    <p className={`text-sm font-medium ${level.textColor} mb-3 leading-relaxed`}>{level.desc}</p>
                    <div className="flex gap-2 flex-wrap">
                      {TRACKS.map(t => {
                        const Icon = t.icon;
                        return (
                          <span key={t.id} className="flex items-center gap-1 bg-white/70 rounded-full px-2.5 py-1 text-xs font-bold text-slate-600">
                            <Icon className={`h-3 w-3 ${t.color}`} /> {t.nameJa}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
