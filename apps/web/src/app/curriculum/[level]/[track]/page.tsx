'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ChevronLeft, Play, FileText, BookOpen, Layers, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClickableText } from '@/components/WordTooltip';
import { Badge } from '@/components/ui/badge';

export default function CurriculumContentPage() {
  const params = useParams();
  const router = useRouter();
  const level = params.level as string;
  const track = params.track as string;

  const { data: content, isLoading } = useQuery({
    queryKey: ['curriculumContent', level, track],
    queryFn: async () => {
      const response = await api.get(`/lessons/content?level=${level}&track=${track}`);
      return response.data;
    },
    enabled: !!level && !!track,
  });

  const getTitle = () => {
    const levelName = level.charAt(0).toUpperCase() + level.slice(1);
    const trackName = track.charAt(0).toUpperCase() + track.slice(1);
    return `${levelName} - ${trackName}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold">コンテンツを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" /> 戻る
          </button>
          <Badge variant="outline" className="bg-white text-indigo-600 border-indigo-200 px-3 py-1 font-bold">
            {getTitle()}
          </Badge>
        </header>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-2 capitalize">{track}</h1>
          <p className="text-slate-500 font-medium">単語をタップして日本語の意味を確認できます。</p>
        </div>

        <div className="grid gap-6">
          {track === 'vocabulary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content?.map((item: any) => (
                <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl bg-white overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-800">{item.english_word}</h3>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{item.ipa_phonetic} · {item.part_of_speech}</p>
                      </div>
                      <Badge className="bg-indigo-50 text-indigo-600 border-none font-black">{item.japanese_translation}</Badge>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs font-bold text-slate-400 mb-1 uppercase">例文</p>
                      <ClickableText text={item.example_en} className="text-slate-700 font-medium mb-1" />
                      <p className="text-sm text-slate-400 font-medium">{item.example_ja}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {track === 'grammar' && (
            <div className="space-y-6">
              {content?.map((item: any) => (
                <Card key={item.id} className="border-none shadow-md rounded-2xl bg-white overflow-hidden">
                  <CardHeader className="bg-indigo-600 text-white p-6">
                    <CardTitle className="text-xl font-black">{item.pattern_en}</CardTitle>
                    <p className="text-indigo-100 font-medium">{item.pattern_ja}</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <p className="text-xs font-bold text-slate-400 mb-2 uppercase">説明</p>
                      <p className="text-slate-800 font-medium leading-relaxed">{item.explanation_ja}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                      <p className="text-xs font-bold text-emerald-600 mb-2 uppercase">例文</p>
                      <ClickableText text={item.example_en} className="text-lg font-black text-slate-800 mb-1" />
                      <p className="text-slate-500 font-medium">{item.example_ja}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {track === 'reading' && (
            <div className="space-y-8">
              {content?.map((item: any) => (
                <Card key={item.id} className="border-none shadow-lg rounded-3xl bg-white overflow-hidden">
                  <div className="p-8 border-b border-slate-100">
                    <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold mb-4">{item.topic}</Badge>
                    <h3 className="text-3xl font-black text-slate-800 mb-2">{item.title_en}</h3>
                    <p className="text-slate-400 font-bold">{item.title_ja}</p>
                  </div>
                  <CardContent className="p-8">
                    <div className="prose prose-slate max-w-none mb-10">
                      <ClickableText text={item.body_en} className="text-xl leading-loose font-medium text-slate-700" />
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-6 text-white">
                      <h4 className="flex items-center gap-2 font-black mb-4">
                        <Sparkles className="h-5 w-5 text-indigo-400" /> 要約 (Summary)
                      </h4>
                      <p className="text-slate-300 font-medium leading-relaxed">{item.summary_ja}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {track === 'listening' && (
            <div className="space-y-8">
              {content?.map((item: any) => (
                <Card key={item.id} className="border-none shadow-lg rounded-3xl bg-white overflow-hidden">
                  <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
                    <div>
                      <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-bold mb-2">Listening Exercise</Badge>
                      <h3 className="text-2xl font-black">{item.title_ja}</h3>
                    </div>
                    <Button size="icon" className="h-16 w-16 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-900/50">
                      <Play className="h-8 w-8 fill-white" />
                    </Button>
                  </div>
                  <CardContent className="p-8">
                    <div className="mb-8">
                      <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">ヒント</p>
                      <p className="text-slate-600 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                        "{item.hint_ja}"
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">トランスクリプト (Tap words to see translation)</p>
                      <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                        <ClickableText text={item.transcript} className="text-lg leading-relaxed font-medium text-slate-800" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
