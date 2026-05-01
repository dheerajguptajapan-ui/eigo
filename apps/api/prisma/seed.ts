import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Eigo Master curriculum...');

  // Clear existing data to avoid conflicts and duplicates
  await prisma.lessonProgress.deleteMany({});
  await prisma.userSRSCard.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.listeningExercise.deleteMany({});
  await prisma.readingPassage.deleteMany({});
  await prisma.grammarItem.deleteMany({});
  await prisma.vocabularyItem.deleteMany({});

  // ─── Vocabulary ───────────────────────────────────────────────────────────
  const vocab = [
    // ELEMENTARY
    { en: 'Hello', jp: 'こんにちは', ipa: '/həˈloʊ/', pos: 'Greeting', level: 'elementary', ex_en: 'Hello, how are you?', ex_ja: 'こんにちは、元気ですか？' },
    { en: 'Thank you', jp: 'ありがとう', ipa: '/θæŋk juː/', pos: 'Phrase', level: 'elementary', ex_en: 'Thank you very much!', ex_ja: 'どうもありがとうございます！' },
    { en: 'Please', jp: 'お願いします', ipa: '/pliːz/', pos: 'Adverb', level: 'elementary', ex_en: 'Please help me.', ex_ja: '手伝ってください。' },
    { en: 'Sorry', jp: 'ごめんなさい', ipa: '/ˈsɒri/', pos: 'Phrase', level: 'elementary', ex_en: 'I am sorry for being late.', ex_ja: '遅れてすみません。' },
    { en: 'Yes', jp: 'はい', ipa: '/jes/', pos: 'Adverb', level: 'elementary', ex_en: 'Yes, I understand.', ex_ja: 'はい、わかりました。' },
    { en: 'No', jp: 'いいえ', ipa: '/noʊ/', pos: 'Adverb', level: 'elementary', ex_en: 'No, thank you.', ex_ja: 'いいえ、結構です。' },
    { en: 'Water', jp: '水', ipa: '/ˈwɔːtər/', pos: 'Noun', level: 'elementary', ex_en: 'Can I have some water?', ex_ja: '水をもらえますか？' },
    { en: 'Food', jp: '食べ物', ipa: '/fuːd/', pos: 'Noun', level: 'elementary', ex_en: 'This food is delicious.', ex_ja: 'この食べ物はおいしいです。' },
    { en: 'School', jp: '学校', ipa: '/skuːl/', pos: 'Noun', level: 'elementary', ex_en: 'I go to school every day.', ex_ja: '毎日学校に行きます。' },
    { en: 'Book', jp: '本', ipa: '/bʊk/', pos: 'Noun', level: 'elementary', ex_en: 'I read a book.', ex_ja: '本を読みます。' },
    { en: 'Happy', jp: '嬉しい', ipa: '/ˈhæpi/', pos: 'Adjective', level: 'elementary', ex_en: 'I am very happy today.', ex_ja: '今日はとても嬉しいです。' },
    { en: 'Big', jp: '大きい', ipa: '/bɪɡ/', pos: 'Adjective', level: 'elementary', ex_en: 'That is a big house.', ex_ja: 'あれは大きな家です。' },
    { en: 'Small', jp: '小さい', ipa: '/smɔːl/', pos: 'Adjective', level: 'elementary', ex_en: 'My cat is small.', ex_ja: '私の猫は小さいです。' },
    { en: 'Eat', jp: '食べる', ipa: '/iːt/', pos: 'Verb', level: 'elementary', ex_en: 'Let us eat lunch.', ex_ja: '昼ごはんを食べましょう。' },
    { en: 'Go', jp: '行く', ipa: '/ɡoʊ/', pos: 'Verb', level: 'elementary', ex_en: 'I go to the park.', ex_ja: '公園に行きます。' },
    // CHUGAKU
    { en: 'Environment', jp: '環境', ipa: '/ɪnˈvaɪrənmənt/', pos: 'Noun', level: 'chugaku', ex_en: 'We must protect the environment.', ex_ja: '環境を守らなければなりません。' },
    { en: 'Technology', jp: '技術・テクノロジー', ipa: '/tekˈnɒlədʒi/', pos: 'Noun', level: 'chugaku', ex_en: 'Technology changes our lives.', ex_ja: 'テクノロジーは私たちの生活を変えます。' },
    { en: 'Improve', jp: '改善する', ipa: '/ɪmˈpruːv/', pos: 'Verb', level: 'chugaku', ex_en: 'I want to improve my English.', ex_ja: '英語を上達させたいです。' },
    { en: 'However', jp: 'しかしながら', ipa: '/haʊˈevər/', pos: 'Conjunction', level: 'chugaku', ex_en: 'It is cold; however, I like it.', ex_ja: '寒いですが、好きです。' },
    { en: 'Reduce', jp: '減らす', ipa: '/rɪˈdjuːs/', pos: 'Verb', level: 'chugaku', ex_en: 'We should reduce waste.', ex_ja: 'ごみを減らすべきです。' },
    { en: 'Community', jp: 'コミュニティ・地域社会', ipa: '/kəˈmjuːnɪti/', pos: 'Noun', level: 'chugaku', ex_en: 'I love my local community.', ex_ja: '地域のコミュニティが大好きです。' },
    { en: 'Opportunity', jp: '機会', ipa: '/ˌɒpəˈtjuːnɪti/', pos: 'Noun', level: 'chugaku', ex_en: 'This is a great opportunity.', ex_ja: 'これは素晴らしい機会です。' },
    { en: 'Consequence', jp: '結果・影響', ipa: '/ˈkɒnsɪkwəns/', pos: 'Noun', level: 'chugaku', ex_en: 'Think about the consequences.', ex_ja: '結果について考えてください。' },
    // KOUGAKU
    { en: 'Ambiguous', jp: '曖昧な', ipa: '/æmˈbɪɡjuəs/', pos: 'Adjective', level: 'kougaku', ex_en: 'The instructions were ambiguous.', ex_ja: '指示が曖昧でした。' },
    { en: 'Phenomenon', jp: '現象', ipa: '/fɪˈnɒmɪnən/', pos: 'Noun', level: 'kougaku', ex_en: 'This is a natural phenomenon.', ex_ja: 'これは自然現象です。' },
    { en: 'Inevitable', jp: '避けられない', ipa: '/ɪnˈevɪtəbl/', pos: 'Adjective', level: 'kougaku', ex_en: 'Change is inevitable.', ex_ja: '変化は避けられません。' },
    { en: 'Paradox', jp: '逆説', ipa: '/ˈpærədɒks/', pos: 'Noun', level: 'kougaku', ex_en: 'That is a classic paradox.', ex_ja: 'それは古典的な逆説です。' },
    { en: 'Collaborate', jp: '協力する', ipa: '/kəˈlæbəreɪt/', pos: 'Verb', level: 'kougaku', ex_en: 'Teams collaborate to succeed.', ex_ja: 'チームは成功するために協力します。' },
    // ADVANCED
    { en: 'Epistemology', jp: '認識論', ipa: '/ɪˌpɪstɪˈmɒlədʒi/', pos: 'Noun', level: 'advanced', ex_en: 'Epistemology is the study of knowledge.', ex_ja: '認識論は知識の研究です。' },
    { en: 'Nuance', jp: 'ニュアンス', ipa: '/ˈnjuːɑːns/', pos: 'Noun', level: 'advanced', ex_en: 'Understanding nuance is key.', ex_ja: 'ニュアンスを理解することが重要です。' },
    { en: 'Ubiquitous', jp: 'どこにでもある', ipa: '/juːˈbɪkwɪtəs/', pos: 'Adjective', level: 'advanced', ex_en: 'Smartphones are now ubiquitous.', ex_ja: 'スマートフォンは今やどこにでもあります。' },
    { en: 'Articulate', jp: '明確に表現する', ipa: '/ɑːˈtɪkjʊleɪt/', pos: 'Verb', level: 'advanced', ex_en: 'She can articulate her ideas clearly.', ex_ja: '彼女はアイデアを明確に表現できます。' },
    { en: 'Pragmatic', jp: '実用的な', ipa: '/præɡˈmætɪk/', pos: 'Adjective', level: 'advanced', ex_en: 'We need a pragmatic solution.', ex_ja: '実用的な解決策が必要です。' },
  ];

  for (const item of vocab) {
    await prisma.vocabularyItem.create({
      data: {
        english_word: item.en,
        japanese_translation: item.jp,
        ipa_phonetic: item.ipa,
        part_of_speech: item.pos,
        cefr_level: item.level,
        example_en: item.ex_en,
        example_ja: item.ex_ja,
        frequency_rank: Math.floor(Math.random() * 5000),
      },
    });
  }
  console.log(`✅ ${vocab.length} vocabulary items seeded`);

  // ─── Grammar ─────────────────────────────────────────────────────────────
  const grammar = [
    // ELEMENTARY
    { pattern_en: 'Subject + am/is/are + Noun/Adjective', pattern_ja: '主語 + am/is/are + 名詞/形容詞', example_en: 'I am a student.', example_ja: '私は学生です。', explanation_ja: 'be動詞の基本文。主語に合わせてam/is/areを使い分けます。', level: 'elementary', category: 'be_verb' },
    { pattern_en: 'Subject + do not + Verb', pattern_ja: '主語 + do not + 動詞', example_en: 'I do not like coffee.', example_ja: '私はコーヒーが好きではありません。', explanation_ja: '否定文の作り方。do notまたはdoesn\'tを動詞の前に置きます。', level: 'elementary', category: 'negation' },
    { pattern_en: 'Do + Subject + Verb?', pattern_ja: 'Do + 主語 + 動詞？', example_en: 'Do you like music?', example_ja: 'あなたは音楽が好きですか？', explanation_ja: '疑問文の作り方。DoまたはDoesを文頭に置きます。', level: 'elementary', category: 'questions' },
    { pattern_en: 'Subject + Verb + ed (Past)', pattern_ja: '主語 + 動詞の過去形', example_en: 'I walked to school yesterday.', example_ja: '昨日、学校まで歩きました。', explanation_ja: '規則動詞の過去形。動詞の語尾にedをつけます。', level: 'elementary', category: 'tense' },
    // CHUGAKU
    { pattern_en: 'Subject + have/has + Past Participle', pattern_ja: '主語 + have/has + 過去分詞', example_en: 'I have visited Tokyo three times.', example_ja: '東京に3回行ったことがあります。', explanation_ja: '現在完了形。過去の経験や継続中の状態を表します。', level: 'chugaku', category: 'tense' },
    { pattern_en: 'If + Past Simple, would + Verb', pattern_ja: 'If + 過去形, would + 動詞', example_en: 'If I had money, I would travel the world.', example_ja: 'お金があれば、世界を旅するのに。', explanation_ja: '仮定法過去。現実とは異なる仮定の状況を表します。', level: 'chugaku', category: 'conditional' },
    { pattern_en: 'Subject + was/were + Past Participle (Passive)', pattern_ja: '主語 + was/were + 過去分詞（受動態）', example_en: 'The book was written by Soseki.', example_ja: 'その本は漱石によって書かれました。', explanation_ja: '受動態の過去形。動作を受ける側を主語にします。', level: 'chugaku', category: 'passive' },
    // KOUGAKU
    { pattern_en: 'Not only A but also B', pattern_ja: 'AだけでなくBも', example_en: 'Not only is she smart, but she is also kind.', example_ja: '彼女は賢いだけでなく、親切でもあります。', explanation_ja: '相関接続詞。AとBを強調して結びます。', level: 'kougaku', category: 'conjunction' },
    { pattern_en: 'Having + Past Participle, Subject + ...', pattern_ja: '過去分詞句（完了の分詞構文）', example_en: 'Having finished the work, he went home.', example_ja: '仕事を終えてから、彼は帰宅しました。', explanation_ja: '完了の分詞構文。主節より前に完了した行為を表します。', level: 'kougaku', category: 'participle' },
    // ADVANCED
    { pattern_en: 'Subject + would have + Past Participle', pattern_ja: '主語 + would have + 過去分詞', example_en: 'I would have helped if I had known.', example_ja: '知っていたら、助けたでしょうに。', explanation_ja: '仮定法過去完了。過去の事実に反する仮定です。', level: 'advanced', category: 'conditional' },
    { pattern_en: 'Inversion: Rarely/Seldom + Aux + Subject', pattern_ja: '否定副詞による倒置', example_en: 'Rarely do I see such talent.', example_ja: 'このような才能を見ることはほとんどありません。', explanation_ja: '否定の副詞が文頭に来ると、主語と助動詞が倒置されます。', level: 'advanced', category: 'inversion' },
  ];

  for (const item of grammar) {
    await prisma.grammarItem.create({ data: item });
  }
  console.log(`✅ ${grammar.length} grammar items seeded`);

  // ─── Reading Passages ─────────────────────────────────────────────────────
  const readings = [
    {
      title_en: 'My Daily Routine',
      title_ja: '私の日課',
      body_en: 'Every morning, I wake up at 7 o\'clock. First, I wash my face and brush my teeth. Then I eat breakfast. I usually have rice, miso soup, and eggs. After breakfast, I go to school by bicycle. School starts at 8:30. In the afternoon, I practice baseball with my club. I come home at 6 o\'clock and do my homework. I go to bed at 10 o\'clock.',
      summary_ja: '毎朝7時に起きて、朝食を食べ、自転車で学校に行く日課について書かれています。野球クラブの練習後、帰宅して宿題をし、10時に就銭します。',
      level: 'elementary',
      topic: 'daily_life',
      word_count: 75,
      questions: JSON.stringify([
        { q: 'What time does the writer wake up?', a: '7 o\'clock' },
        { q: 'How does the writer go to school?', a: 'By bicycle' },
        { q: 'What club does the writer belong to?', a: 'Baseball club' },
      ]),
    },
    {
      title_en: 'The Internet and Society',
      title_ja: 'インターネットと社会',
      body_en: 'The internet has changed the way we live, work, and communicate. Today, billions of people use the internet every day to access information, shop online, and connect with friends. However, there are also negative aspects. Too much screen time can harm our health, and cyberbullying is a serious problem for young people. It is important to use the internet responsibly and be aware of its dangers.',
      summary_ja: 'インターネットは私たちの生活を変えました。情報収集やコミュニケーションに便利ですが、過度なスクリーンタイムやサイバーいじめなどの問題もあります。',
      level: 'chugaku',
      topic: 'science',
      word_count: 82,
      questions: JSON.stringify([
        { q: 'How many people use the internet every day?', a: 'Billions of people' },
        { q: 'What is one negative aspect of the internet?', a: 'Cyberbullying / Too much screen time' },
        { q: 'What is important when using the internet?', a: 'To use it responsibly and be aware of its dangers' },
      ]),
    },
    {
      title_en: 'The Paradox of Choice',
      title_ja: '選択のパラドックス',
      body_en: 'Modern consumer culture offers an unprecedented variety of choices. From hundreds of shampoo brands to thousands of streaming shows, we have more options than ever before. Psychologist Barry Schwartz argues in his book "The Paradox of Choice" that this abundance of options, rather than liberating us, actually increases anxiety and dissatisfaction. When faced with too many alternatives, people often experience decision paralysis, and even after choosing, they ruminate over what they might have missed.',
      summary_ja: '現代社会では選択肢が多すぎることで、かえって不安や不満が増えるというパラドックスについて述べています。心理学者バリー・シュワルツの研究を基に、選択の自由が必ずしも幸福につながらないことを説明しています。',
      level: 'kougaku',
      topic: 'culture',
      word_count: 90,
      questions: JSON.stringify([
        { q: 'What does Barry Schwartz argue?', a: 'Too many choices increase anxiety and dissatisfaction' },
        { q: 'What is "decision paralysis"?', a: 'Being unable to make a decision when faced with too many alternatives' },
      ]),
    },
    {
      title_en: 'The Nature of Consciousness',
      title_ja: '意識の本質',
      body_en: 'The question of what consciousness is remains one of the most profound unsolved problems in science and philosophy. The "hard problem of consciousness," coined by philosopher David Chalmers, asks why and how physical processes in the brain give rise to subjective experience. Why does red look red? Why does pain feel painful? While neuroscience has made significant strides in mapping brain activity, the explanatory gap between neural correlates and subjective qualia remains a formidable challenge to our understanding of the mind.',
      summary_ja: '意識とは何かという問いは科学と哲学における最も難解な問題の一つです。デイヴィッド・チャーマーズが提唱した「意識のハード・プロブレム」は、なぜ脳の物理的プロセスが主観的経験を生み出すのかを問います。',
      level: 'advanced',
      topic: 'science',
      word_count: 100,
      questions: JSON.stringify([
        { q: 'Who coined the term "hard problem of consciousness"?', a: 'David Chalmers' },
        { q: 'What gap does neuroscience struggle to explain?', a: 'The gap between neural correlates and subjective qualia' },
      ]),
    },
  ];

  for (const item of readings) {
    await prisma.readingPassage.create({ data: item });
  }
  console.log(`✅ ${readings.length} reading passages seeded`);

  // ─── Listening Exercises ──────────────────────────────────────────────────
  const listening = [
    {
      title_ja: '動物園で',
      transcript: 'Welcome to City Zoo! Today we have a special event. At 11 AM, you can watch the dolphins swim. At 2 PM, the zookeeper will feed the lions. The gift shop is near the main gate. Enjoy your visit!',
      level: 'elementary',
      topic: 'daily_life',
      hint_ja: 'イルカのショーやライオンの餌やりなど、動物園でのアナウンスです。時刻と場所に注意して聴きましょう。',
      questions: JSON.stringify([
        { q: 'What time can you watch the dolphins?', a: '11 AM' },
        { q: 'Where is the gift shop?', a: 'Near the main gate' },
      ]),
    },
    {
      title_ja: '環境問題に関するスピーチ',
      transcript: 'Climate change is the most urgent challenge of our generation. Every year, global temperatures rise, causing more extreme weather events such as floods, droughts, and hurricanes. Scientists agree that human activities, particularly the burning of fossil fuels, are the main cause. To solve this problem, governments, companies, and individuals must all take action by switching to renewable energy and reducing carbon emissions.',
      level: 'chugaku',
      topic: 'science',
      hint_ja: '気候変動に関するスピーチです。原因と解決策に注目しましょう。fossil fuels（化石燃料）、renewable energy（再生可能エネルギー）がキーワードです。',
      questions: JSON.stringify([
        { q: 'What is identified as the main cause of climate change?', a: 'Human activities, particularly burning fossil fuels' },
        { q: 'What three groups must take action?', a: 'Governments, companies, and individuals' },
      ]),
    },
    {
      title_ja: '大学の講義（抜粋）',
      transcript: 'Today we\'ll examine the concept of cognitive bias, specifically confirmation bias. This is our tendency to search for, interpret, and recall information in a way that confirms our pre-existing beliefs. For example, a person who believes vaccines are harmful will tend to notice and remember news stories that support this view, while discounting contradictory evidence. Being aware of this bias is the first step toward more rational thinking.',
      level: 'kougaku',
      topic: 'culture',
      hint_ja: '認知バイアス、特に確証バイアスに関する大学の講義です。confirmation bias（確証バイアス）の定義と例に注目しましょう。',
      questions: JSON.stringify([
        { q: 'What is confirmation bias?', a: 'Our tendency to seek information that confirms our existing beliefs' },
        { q: 'What is the first step toward rational thinking?', a: 'Being aware of the bias' },
      ]),
    },
    {
      title_ja: '学術シンポジウム（発言抜粋）',
      transcript: 'The ramifications of artificial general intelligence, should it be achieved, are difficult to overstate. Unlike narrow AI systems which excel at specific tasks, an AGI system would possess the capacity to understand and learn any intellectual task that a human can. The question is not merely technical but profoundly ethical: who controls such a system, and how do we ensure that its goals remain aligned with human values? These questions demand interdisciplinary collaboration between computer scientists, philosophers, and policymakers.',
      level: 'advanced',
      topic: 'science',
      hint_ja: '汎用人工知能（AGI）に関する学術シンポジウムの発言です。AGIの定義と倫理的問題、学際的協力の必要性が述べられています。',
      questions: JSON.stringify([
        { q: 'How does AGI differ from narrow AI?', a: 'AGI can understand and learn any intellectual task, not just specific ones' },
        { q: 'What disciplines need to collaborate on AGI?', a: 'Computer scientists, philosophers, and policymakers' },
      ]),
    },
  ];

  for (const item of listening) {
    await prisma.listeningExercise.create({ data: item });
  }
  console.log(`✅ ${listening.length} listening exercises seeded`);

  // ─── Lessons ─────────────────────────────────────────────────────────────
  const levels = ['elementary', 'chugaku', 'kougaku', 'advanced'];
  const tracks = ['vocabulary', 'grammar', 'reading', 'listening'];
  const levelNames: Record<string, string> = { elementary: '小学生レベル', chugaku: '中学生レベル', kougaku: '高校生レベル', advanced: '上級者レベル' };
  const trackNames: Record<string, string> = { vocabulary: '単語', grammar: '文法', reading: 'リーディング', listening: 'リスニング' };

  for (const level of levels) {
    for (const track of tracks) {
      await prisma.lesson.create({
        data: {
          unit_id: `${level}-${track}`,
          title_ja: `${levelNames[level]} - ${trackNames[track]}`,
          level,
          track,
          exercise_count: 10,
          xp_reward: level === 'elementary' ? 30 : level === 'chugaku' ? 50 : level === 'kougaku' ? 80 : 120,
        },
      });
    }
  }
  console.log(`✅ ${levels.length * tracks.length} lessons seeded`);

  // ─── Demo user ────────────────────────────────────────────────────────────
  const existingUser = await prisma.user.findUnique({ where: { email: 'demo@example.com' } });
  if (!existingUser) {
    const hash = await bcrypt.hash('demo123', 10);
    await prisma.user.create({
      data: { email: 'demo@example.com', password_hash: hash, display_name: 'デモユーザー' },
    });
    console.log('✅ Demo user created: demo@example.com / demo123');
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
