export interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: Date;
  current_level: string;
  streak_count: number;
  timezone: string;
  ui_language: string;
}

export interface VocabularyItem {
  id: string;
  english_word: string;
  ipa_phonetic?: string;
  japanese_translation: string;
  audio_url?: string;
  cefr_level: string;
  frequency_rank?: number;
  part_of_speech: string;
  example_en?: string;
  example_ja?: string;
}

export interface SRSCard {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'vocabulary' | 'grammar';
  due_date: Date;
  interval_days: number;
  ease_factor: number;
  review_count: number;
  last_reviewed_at?: Date;
}
