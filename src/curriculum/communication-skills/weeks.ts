import type { CurriculumAISkill } from "@/curriculum/types";

export const COMMUNICATION_WEEKS_COUNT = 12;

export interface CommunicationWeekModule {
  weekId: number;
  title: string;
  subtitle: string;
  focus: string;
  skill: CurriculumAISkill;
}

function weekSkill(
  weekId: number,
  title: string,
  description: string,
  topics: { title: string }[],
  exercises: { title: string }[]
): CurriculumAISkill {
  return {
    id: `comm-week-${weekId}`,
    title,
    description,
    learningTopics: topics.map((t, i) => ({
      id: `comm-w${weekId}-topic-${i + 1}`,
      title: t.title,
    })),
    tools: ["Mirror", "Journal", "Voice recorder", "Partner practice"],
    exercises: exercises.map((e, i) => ({
      id: `comm-w${weekId}-ex-${i + 1}`,
      title: e.title,
    })),
  };
}

export const COMMUNICATION_WEEKS: CommunicationWeekModule[] = [
  {
    weekId: 1,
    title: "Communication Foundations",
    subtitle: "Basics, confidence, greetings, sentences, and listening habits.",
    focus: "Speak simply. Listen fully. Build daily confidence.",
    skill: weekSkill(1, "Week 1 — Communication Foundations", "Understand communication basics and build speaking confidence.", [
      { title: "What is communication — sender, message, listener" },
      { title: "Overcome fear of speaking English" },
      { title: "Greetings and introductions (formal & casual)" },
      { title: "Simple sentence formation (subject + verb + object)" },
      { title: "Listening habits and confidence-building" },
    ], [
      { title: "Record a 60-second self-introduction" },
      { title: "Practice 5 greeting pairs (Hello / Nice to meet you)" },
      { title: "Write and speak 5 simple sentences about your day" },
      { title: "5-minute daily listening log (what you heard + learned)" },
    ]),
  },
  {
    weekId: 2,
    title: "English Grammar for Speaking",
    subtitle: "Parts of speech, tenses, articles, and common speaking mistakes.",
    focus: "Correct grammar in short spoken sentences.",
    skill: weekSkill(2, "Week 2 — English Grammar for Speaking", "Use grammar naturally while speaking, not only in writing.", [
      { title: "Parts of speech you use every day (noun, verb, adjective)" },
      { title: "Sentence structure — S + V + O" },
      { title: "Tenses in daily conversation (past, present, future)" },
      { title: "Articles and pronouns (a, an, the, I, you, they)" },
      { title: "Common grammar mistakes while speaking" },
    ], [
      { title: "Fix 5 grammar errors in spoken sentences" },
      { title: "Speak one story using past, present, and future" },
      { title: "Article drill — 10 sentences aloud" },
      { title: "Record 1 minute, then correct your grammar" },
    ]),
  },
  {
    weekId: 3,
    title: "Vocabulary & Pronunciation",
    subtitle: "Daily words, professional terms, stress, intonation, and fillers.",
    focus: "Clear sounds. Right stress. Fewer fillers.",
    skill: weekSkill(3, "Week 3 — Vocabulary & Pronunciation", "Sound clear and use the right words in daily and work talk.", [
      { title: "Daily vocabulary — 10 useful words" },
      { title: "Professional vocabulary for work" },
      { title: "Pronunciation basics and phonics" },
      { title: "Word stress and intonation" },
      { title: "Fillers and commonly mispronounced words" },
    ], [
      { title: "Learn 10 new words — use each in a sentence" },
      { title: "Build a 15-word professional word bank" },
      { title: "Record 10 hard words — compare with clear audio" },
      { title: "2-minute talk with zero fillers (um, like, basically)" },
    ]),
  },
  {
    weekId: 4,
    title: "Daily Communication Skills",
    subtitle: "Home, college, work, shopping, travel — real conversations.",
    focus: "Talk naturally in everyday situations.",
    skill: weekSkill(4, "Week 4 — Daily Communication Skills", "Handle common real-life conversations with confidence.", [
      { title: "Conversations at home and college" },
      { title: "Workplace small talk" },
      { title: "Shopping and travel English" },
      { title: "Asking questions confidently" },
      { title: "Expressing opinions naturally" },
    ], [
      { title: "Role-play a college/class conversation" },
      { title: "Practice 5 workplace small-talk openers" },
      { title: "Shopping dialogue — ask price, size, return" },
      { title: "Give your opinion on one topic in 60 seconds" },
    ]),
  },
  {
    weekId: 5,
    title: "Speaking Fluency Development",
    subtitle: "Think in English, speak without hesitation, tell stories.",
    focus: "Flow beats perfection. Keep speaking.",
    skill: weekSkill(5, "Week 5 — Speaking Fluency Development", "Reduce hesitation and speak English more smoothly.", [
      { title: "Thinking in English (stop translating)" },
      { title: "Speaking without long pauses" },
      { title: "Storytelling structure (beginning, middle, end)" },
      { title: "Fluency exercises and drills" },
      { title: "Confidence drills for daily practice" },
    ], [
      { title: "Tell a 2-minute story without notes" },
      { title: "Describe your morning only in English (2 min)" },
      { title: "Picture description — speak for 90 seconds" },
      { title: "Fluency timer — speak non-stop for 3 minutes" },
    ]),
  },
  {
    weekId: 6,
    title: "Listening & Comprehension Skills",
    subtitle: "Active listening, accents, notes, summaries, podcasts.",
    focus: "Listen first. Understand fully. Then reply.",
    skill: weekSkill(6, "Week 6 — Listening & Comprehension Skills", "Understand spoken English better in real situations.", [
      { title: "Active listening — focus and respond" },
      { title: "Understanding different accents" },
      { title: "Note-taking while listening" },
      { title: "Summarizing conversations" },
      { title: "Learning from videos and podcasts" },
    ], [
      { title: "Summarize a 5-minute English video in 3 sentences" },
      { title: "Listen to 2 accents — note 5 new words" },
      { title: "Take notes during a short talk, then recap" },
      { title: "Paraphrase what a partner said before you reply" },
    ]),
  },
  {
    weekId: 7,
    title: "Public Speaking Fundamentals",
    subtitle: "Body language, voice, confidence, and short presentations.",
    focus: "Stand tall. Speak clear. Structure your message.",
    skill: weekSkill(7, "Week 7 — Public Speaking Fundamentals", "Deliver short talks with confidence and control.", [
      { title: "Body language that shows confidence" },
      { title: "Eye contact and audience connection" },
      { title: "Voice modulation — pace, pitch, volume" },
      { title: "Stage confidence and managing nerves" },
      { title: "Speech structure — open, body, close" },
    ], [
      { title: "Deliver a 2-minute speech with clear structure" },
      { title: "Voice drill — loud, soft, slow, fast (1 min each)" },
      { title: "Record yourself — check eye contact on camera" },
      { title: "Body language checklist before your next talk" },
    ]),
  },
  {
    weekId: 8,
    title: "Professional Communication",
    subtitle: "Email, meetings, teamwork, and business vocabulary.",
    focus: "Polite, clear, professional — every message.",
    skill: weekSkill(8, "Week 8 — Professional Communication", "Communicate effectively at work and with clients.", [
      { title: "Email etiquette — subject, tone, close" },
      { title: "Workplace conversations" },
      { title: "Meeting etiquette — join, speak, summarize" },
      { title: "Asking questions professionally" },
      { title: "Teamwork language and business vocabulary" },
    ], [
      { title: "Write one professional request email" },
      { title: "Practice a 30-second meeting introduction" },
      { title: "Ask 5 professional questions aloud" },
      { title: "Give a 90-second team status update" },
    ]),
  },
  {
    weekId: 9,
    title: "Personality Development & Soft Skills",
    subtitle: "Confidence, EQ, etiquette, empathy, and interpersonal skills.",
    focus: "Calm mind. Kind words. Strong presence.",
    skill: weekSkill(9, "Week 9 — Personality Development & Soft Skills", "Grow confidence and emotional intelligence at work.", [
      { title: "Building self-confidence in communication" },
      { title: "Emotional intelligence basics" },
      { title: "Communication etiquette" },
      { title: "Interpersonal skills with teammates" },
      { title: "Empathy and active listening" },
    ], [
      { title: "1-minute confident self-talk + short speech" },
      { title: "Respond to 3 workplace EQ scenarios" },
      { title: "Etiquette checklist for calls and chat" },
      { title: "Empathy role-play — upset teammate" },
    ]),
  },
  {
    weekId: 10,
    title: "Interview & Career Communication",
    subtitle: "HR prep, introductions, resume talk, behavioral Qs, salary.",
    focus: "Prepare stories. Practice aloud. Stay honest.",
    skill: weekSkill(10, "Week 10 — Interview & Career Communication", "Speak clearly in interviews and career conversations.", [
      { title: "HR interview preparation" },
      { title: "Technical self-introduction for developers" },
      { title: "Discussing your resume confidently" },
      { title: "Behavioral questions — STAR method" },
      { title: "Salary talk and professional self-intro" },
    ], [
      { title: "Record your 90-second career introduction" },
      { title: "Write and speak 3 STAR stories" },
      { title: "Answer 5 common HR questions aloud" },
      { title: "Practice a polite salary expectation line" },
    ]),
  },
  {
    weekId: 11,
    title: "Advanced Communication Mastery",
    subtitle: "Group discussions, negotiation, conflict, persuasion, leadership.",
    focus: "Lead discussions. Resolve conflict. Persuade with respect.",
    skill: weekSkill(11, "Week 11 — Advanced Communication Mastery", "Handle advanced speaking situations like a pro.", [
      { title: "Group discussion skills" },
      { title: "Debates and negotiation language" },
      { title: "Conflict resolution communication" },
      { title: "Persuasive speaking techniques" },
      { title: "Leadership communication" },
    ], [
      { title: "3-minute group discussion on a tech topic" },
      { title: "2-minute debate — one side only" },
      { title: "Script a calm conflict-resolution talk" },
      { title: "60-second persuasive pitch for an idea" },
    ]),
  },
  {
    weekId: 12,
    title: "Real-World Communication & Final Assessment",
    subtitle: "Mocks, presentations, impromptu talk, networking, final plan.",
    focus: "Show everything you learned. Plan what comes next.",
    skill: weekSkill(12, "Week 12 — Real-World Communication & Final Assessment", "Capstone: real scenarios, feedback, and your growth plan.", [
      { title: "Mock interview readiness" },
      { title: "Presentation delivery skills" },
      { title: "Impromptu speaking" },
      { title: "Networking conversations" },
      { title: "Feedback and improvement plan" },
    ], [
      { title: "Full mock interview (intro + 5 questions)" },
      { title: "5-minute presentation on your best project" },
      { title: "3 impromptu topics — 1 minute each" },
      { title: "Write your 12-week communication improvement plan" },
    ]),
  },
];

export function getCommunicationWeek(weekId: number): CommunicationWeekModule | undefined {
  return COMMUNICATION_WEEKS.find((w) => w.weekId === weekId);
}

export function collectCommunicationIds(skill: CurriculumAISkill): string[] {
  return [
    ...skill.learningTopics.map((t) => t.id),
    ...skill.exercises.map((e) => e.id),
  ];
}

export function getCommunicationWeekProgress(skill: CurriculumAISkill, isDone: (id: string) => boolean): number {
  const ids = collectCommunicationIds(skill);
  if (!ids.length) return 0;
  return Math.round((ids.filter((id) => isDone(id)).length / ids.length) * 100);
}
