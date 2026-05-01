import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial curriculum...');

  // 1. Beginner Vocabulary Items
  const vocabData = [
    { en: 'Hello', jp: 'こんにちは', ipa: '/həˈloʊ/', pos: 'Greeting', level: 'beginner' },
    { en: 'Thank you', jp: 'ありがとう', ipa: '/θæŋk juː/', pos: 'Phrase', level: 'beginner' },
    { en: 'Yes', jp: 'はい', ipa: '/jes/', pos: 'Adverb', level: 'beginner' },
    { en: 'No', jp: 'いいえ', ipa: '/noʊ/', pos: 'Adverb', level: 'beginner' },
    { en: 'Please', jp: 'お願いします / どうぞ', ipa: '/pliːz/', pos: 'Adverb', level: 'beginner' },
    { en: 'Excuse me', jp: 'すみません', ipa: '/ɪkˈskjuːz miː/', pos: 'Phrase', level: 'beginner' },
    { en: 'I', jp: '私', ipa: '/aɪ/', pos: 'Pronoun', level: 'beginner' },
    { en: 'You', jp: 'あなた', ipa: '/juː/', pos: 'Pronoun', level: 'beginner' },
    { en: 'Eat', jp: '食べる', ipa: '/iːt/', pos: 'Verb', level: 'beginner' },
    { en: 'Drink', jp: '飲む', ipa: '/drɪŋk/', pos: 'Verb', level: 'beginner' },
    { en: 'Water', jp: '水', ipa: '/ˈwɔːtər/', pos: 'Noun', level: 'beginner' },
    { en: 'Apple', jp: 'りんご', ipa: '/ˈæpəl/', pos: 'Noun', level: 'beginner' },
    { en: 'Bread', jp: 'パン', ipa: '/bred/', pos: 'Noun', level: 'beginner' },
    { en: 'Coffee', jp: 'コーヒー', ipa: '/ˈkɔːfi/', pos: 'Noun', level: 'beginner' },
    { en: 'Cat', jp: '猫', ipa: '/kæt/', pos: 'Noun', level: 'beginner' },
    { en: 'Dog', jp: '犬', ipa: '/dɔːɡ/', pos: 'Noun', level: 'beginner' },
    { en: 'Book', jp: '本', ipa: '/bʊk/', pos: 'Noun', level: 'beginner' },
    { en: 'School', jp: '学校', ipa: '/skuːl/', pos: 'Noun', level: 'beginner' },
    { en: 'Teacher', jp: '先生', ipa: '/ˈtiːtʃər/', pos: 'Noun', level: 'beginner' },
    { en: 'Student', jp: '学生', ipa: '/ˈstuːdənt/', pos: 'Noun', level: 'beginner' },
  ];

  for (const item of vocabData) {
    await prisma.vocabularyItem.create({
      data: {
        english_word: item.en,
        japanese_translation: item.jp,
        ipa_phonetic: item.ipa,
        part_of_speech: item.pos,
        cefr_level: item.level,
      },
    });
  }

  // 2. Initial Lessons
  const lessonsData = [
    { unit: 'U1', title: 'アルファベットの基本', level: 'beginner', track: 'vocab' },
    { unit: 'U1', title: '挨拶を覚えよう', level: 'beginner', track: 'vocab' },
    { unit: 'U2', title: '数字と数え方', level: 'beginner', track: 'vocab' },
    { unit: 'U2', title: '基本的な自己紹介', level: 'beginner', track: 'speaking' },
    { unit: 'U3', title: '「A」と「The」の違い', level: 'beginner', track: 'grammar' },
  ];

  for (const lesson of lessonsData) {
    await prisma.lesson.create({
      data: {
        unit_id: lesson.unit,
        title_ja: lesson.title,
        level: lesson.level,
        track: lesson.track,
      },
    });
  }

  console.log('Seeding complete! Added 20 vocab items and 5 lessons.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
