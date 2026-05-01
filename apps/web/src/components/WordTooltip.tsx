'use client';

import { useState, useRef, useCallback } from 'react';

interface WordData {
  word: string;
  translation: string;
  reading: string;
  partOfSpeech: string;
  example: string;
}

// Simple local dictionary for common words
const DICT: Record<string, Omit<WordData, 'word'>> = {
  hello: { translation: 'こんにちは', reading: 'ハロー', partOfSpeech: '挨拶', example: 'Hello, nice to meet you! (はじめまして！)' },
  thank: { translation: 'ありがとう', reading: 'サンク', partOfSpeech: '動詞', example: 'Thank you very much. (どうもありがとう。)' },
  please: { translation: 'お願いします', reading: 'プリーズ', partOfSpeech: '副詞', example: 'Please help me. (手伝ってください。)' },
  water: { translation: '水', reading: 'ウォーター', partOfSpeech: '名詞', example: 'Can I have water? (水をください。)' },
  food: { translation: '食べ物', reading: 'フード', partOfSpeech: '名詞', example: 'The food is delicious. (食べ物がおいしい。)' },
  school: { translation: '学校', reading: 'スクール', partOfSpeech: '名詞', example: 'I go to school. (学校に行きます。)' },
  happy: { translation: '嬉しい・幸せ', reading: 'ハッピー', partOfSpeech: '形容詞', example: 'I am happy. (私は嬉しいです。)' },
  good: { translation: '良い', reading: 'グッド', partOfSpeech: '形容詞', example: 'Good morning! (おはようございます！)' },
  bad: { translation: '悪い', reading: 'バッド', partOfSpeech: '形容詞', example: 'That is bad. (それは悪い。)' },
  big: { translation: '大きい', reading: 'ビッグ', partOfSpeech: '形容詞', example: 'This is a big house. (大きな家です。)' },
  small: { translation: '小さい', reading: 'スモール', partOfSpeech: '形容詞', example: 'My cat is small. (猫が小さい。)' },
  book: { translation: '本', reading: 'ブック', partOfSpeech: '名詞', example: 'I read a book. (本を読む。)' },
  time: { translation: '時間', reading: 'タイム', partOfSpeech: '名詞', example: 'What time is it? (何時ですか？)' },
  day: { translation: '日', reading: 'デイ', partOfSpeech: '名詞', example: 'Have a good day! (良い一日を！)' },
  work: { translation: '仕事・働く', reading: 'ワーク', partOfSpeech: '名詞/動詞', example: 'I work every day. (毎日働きます。)' },
  love: { translation: '愛する・大好き', reading: 'ラブ', partOfSpeech: '動詞/名詞', example: 'I love Japan. (日本が大好きです。)' },
  eat: { translation: '食べる', reading: 'イート', partOfSpeech: '動詞', example: 'Let\'s eat! (食べましょう！)' },
  go: { translation: '行く', reading: 'ゴー', partOfSpeech: '動詞', example: 'Let\'s go! (行きましょう！)' },
  study: { translation: '勉強する', reading: 'スタディ', partOfSpeech: '動詞', example: 'I study English. (英語を勉強します。)' },
  help: { translation: '助ける・手伝う', reading: 'ヘルプ', partOfSpeech: '動詞/名詞', example: 'Can you help me? (助けてもらえますか？)' },
  environment: { translation: '環境', reading: 'エンバイロンメント', partOfSpeech: '名詞', example: 'Protect the environment. (環境を守ろう。)' },
  technology: { translation: '技術・テクノロジー', reading: 'テクノロジー', partOfSpeech: '名詞', example: 'Technology changes our lives. (技術が生活を変える。)' },
  community: { translation: 'コミュニティ・地域社会', reading: 'コミュニティ', partOfSpeech: '名詞', example: 'Our community is strong. (コミュニティが強い。)' },
  however: { translation: 'しかしながら', reading: 'ハウエバー', partOfSpeech: '接続詞', example: 'However, I disagree. (しかしながら、反対です。)' },
  improve: { translation: '改善する・上達する', reading: 'インプルーブ', partOfSpeech: '動詞', example: 'I want to improve. (上達したいです。)' },
};

function lookupWord(word: string): Omit<WordData, 'word'> | null {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (DICT[clean]) return DICT[clean];
  // Try removing common suffixes
  for (const suffix of ['ing', 'ed', 'ly', 'er', 'est', 's', 'es']) {
    const root = clean.endsWith(suffix) ? clean.slice(0, -suffix.length) : null;
    if (root && DICT[root]) return DICT[root];
  }
  return null;
}

interface TooltipState {
  word: string;
  data: Omit<WordData, 'word'>;
  x: number;
  y: number;
}

interface ClickableTextProps {
  text: string;
  className?: string;
}

export function ClickableText({ text, className }: ClickableTextProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showTooltip = useCallback((word: string, e: React.MouseEvent | React.TouchEvent) => {
    const data = lookupWord(word);
    if (!data) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    const x = rect.left - (containerRect?.left ?? 0) + rect.width / 2;
    const y = rect.top - (containerRect?.top ?? 0);
    setTooltip({ word, data, x, y });
  }, []);

  const words = text.split(/(\s+)/);

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`} onClick={() => setTooltip(null)}>
      <span className="leading-relaxed">
        {words.map((part, i) => {
          if (/^\s+$/.test(part)) return <span key={i}>{part}</span>;
          const hasData = !!lookupWord(part);
          return (
            <span
              key={i}
              className={`cursor-pointer transition-colors rounded px-0.5 ${hasData ? 'hover:bg-indigo-100 hover:text-indigo-700 active:bg-indigo-200' : ''}`}
              onClick={(e) => { e.stopPropagation(); if (hasData) showTooltip(part, e); }}
              onMouseDown={(e) => {
                if (!hasData) return;
                holdTimer.current = setTimeout(() => showTooltip(part, e), 600);
              }}
              onMouseUp={() => { if (holdTimer.current) clearTimeout(holdTimer.current); }}
              onTouchStart={(e) => {
                if (!hasData) return;
                holdTimer.current = setTimeout(() => {
                  const touch = e.touches[0];
                  showTooltip(part, { currentTarget: e.currentTarget, clientX: touch.clientX, clientY: touch.clientY } as any);
                }, 500);
              }}
              onTouchEnd={() => { if (holdTimer.current) clearTimeout(holdTimer.current); }}
              title={hasData ? 'タップで日本語を確認' : undefined}
            >
              {part}
            </span>
          );
        })}
      </span>

      {tooltip && (
        <div
          className="absolute z-50 pointer-events-auto"
          style={{ left: Math.max(8, tooltip.x - 120), top: tooltip.y - 8, transform: 'translateY(-100%)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-4 w-60 border border-slate-700">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-lg font-black text-white">{tooltip.word}</div>
                <div className="text-xs text-slate-400 font-medium">{tooltip.data.reading} · {tooltip.data.partOfSpeech}</div>
              </div>
              <button
                className="text-slate-400 hover:text-white ml-2 text-lg leading-none"
                onClick={() => setTooltip(null)}
              >×</button>
            </div>
            <div className="text-xl font-bold text-indigo-300 mb-2">{tooltip.data.translation}</div>
            <div className="text-xs text-slate-300 leading-relaxed border-t border-slate-700 pt-2">{tooltip.data.example}</div>
            {/* Tooltip arrow */}
            <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-slate-900" />
          </div>
        </div>
      )}
    </div>
  );
}
