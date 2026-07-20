import type { AiLearnDetail } from "@/curriculum/ai-content/types";

function d(answer: string, realWorld: string): AiLearnDetail {
  return { answer, realWorld };
}

/** Short, practical communication content — all 12 weeks */
export const COMMUNICATION_CONTENT: Record<string, AiLearnDetail> = {
  "comm-w1-ex-1": d(
    `Record 60s: name, role, one hobby, one goal.`,
    `Reuse for college intro and interviews.`
  ),

  "comm-w1-ex-2": d(
    `Say 5 pairs aloud: Hello–Hi / Good morning–Good evening / Nice to meet you–Pleased to meet you.`,
    `Muscle memory for real greetings.`
  ),

  "comm-w1-ex-3": d(
    `Write 5 simple sentences about today. Read each aloud twice.`,
    `I woke up. I had breakfast. I opened my laptop.`
  ),

  "comm-w1-ex-4": d(
    `Listen 5 min English (podcast/video). Note 3 words you heard.`,
    `Daily habit beats one long session.`
  ),

  "comm-w1-topic-1": d(
    `• Sender — you
• Message — words + tone
• Listener — who hears you
• Good comm = clear message + active listening`,
    `Stand-up: say what you did, what you will do, blockers — one clear message.`
  ),

  "comm-w1-topic-2": d(
    `• Fear is normal — everyone feels it
• Start small: 1 sentence, then 2
• Practice alone first, then with a friend
• Mistakes help you learn`,
    `Record yourself 30s daily — fear drops after a week.`
  ),

  "comm-w1-topic-3": d(
    `• Hello / Hi — casual
• Good morning — formal
• Nice to meet you — first time
• My name is… I am a… — intro`,
    `First day: 'Hi, I'm Priya. I'm joining the backend team.'`
  ),

  "comm-w1-topic-4": d(
    `• Subject + Verb + Object
• I write code.
• She tests the API.
• Keep sentences short`,
    `'I fixed the bug' beats 'Bug fixing was done by me.'`
  ),

  "comm-w1-topic-5": d(
    `• Listen without planning your reply
• Nod, eye contact, short replies (I see, Got it)
• 5 min English audio daily builds habit`,
    `In meetings: listen first, then ask one clear question.`
  ),

  "comm-w2-ex-1": d(
    `Fix 5 spoken errors (write correct + say aloud).`,
    `He works. I deployed. I don't know anything.`
  ),

  "comm-w2-ex-2": d(
    `Tell a 1-min story: yesterday / today / tomorrow — correct tenses.`,
    `Interview favorite: 'What did you do last week?'`
  ),

  "comm-w2-ex-3": d(
    `10 sentences with a, an, the — read aloud.`,
    `I found a bug in the login module.`
  ),

  "comm-w2-ex-4": d(
    `Record 1 min free talk. Replay. Fix 3 grammar slips. Re-record.`,
    `Self-correction builds speaking accuracy.`
  ),

  "comm-w2-topic-1": d(
    `• Noun — person, place, thing (developer, server)
• Verb — action (deploy, test)
• Adjective — describes (fast, broken)`,
    `'The fast API returns errors' — noun + adjective + noun + verb.`
  ),

  "comm-w2-topic-2": d(
    `• English: Subject + Verb + Object
• I deploy code. (not: Code I deploy)
• One idea per sentence when speaking`,
    `Stand-up: 'I finished login. I will start payments.'`
  ),

  "comm-w2-topic-3": d(
    `• Past — I deployed yesterday
• Present — I am testing now
• Future — I will deploy tomorrow`,
    `Status: past work → current task → next step.`
  ),

  "comm-w2-topic-4": d(
    `• a/an — one thing (a bug, an error)
• the — specific thing (the main branch)
• I, you, we, they — don't drop pronouns`,
    `'I will check the logs' — not 'Will check logs.'`
  ),

  "comm-w2-topic-5": d(
    `• Wrong tense: 'I deploy yesterday'
• Missing 's': 'He work on it'
• Double negative: 'I don't know nothing'`,
    `Record 1 min — catch your top 2 mistakes.`
  ),

  "comm-w3-ex-1": d(
    `Pick 10 new words. Write + speak 1 sentence each.`,
    `deadline, feedback, requirement, merge, review…`
  ),

  "comm-w3-ex-2": d(
    `List 15 work words you use weekly. Read list aloud.`,
    `Your personal glossary for interviews.`
  ),

  "comm-w3-ex-3": d(
    `Record 10 hard words. Compare with dictionary audio.`,
    `Focus on endings: -ed, -tion, -ment.`
  ),

  "comm-w3-ex-4": d(
    `2-min talk on any topic. Zero fillers. Pause if stuck.`,
    `Fluency + clarity beat perfect grammar.`
  ),

  "comm-w3-topic-1": d(
    `• Learn 10 words/week: schedule, deadline, update, confirm
• Use each in one real sentence`,
    `Daily: 'Can we confirm the meeting time?'`
  ),

  "comm-w3-topic-2": d(
    `• Stakeholder, deploy, milestone, escalate, align
• Say them clearly in stand-up`,
    `'We need to align with QA before deploy.'`
  ),

  "comm-w3-topic-3": d(
    `• Sound out syllables: de-PLOY, a-SYNC, da-TA-base
• Copy native speaker audio for hard words`,
    `repository, architecture, authentication — practice daily.`
  ),

  "comm-w3-topic-4": d(
    `• Stress the right syllable: com-MU-ni-cate
• Rise tone on questions; fall on statements`,
    `Wrong stress → people misunderstand on calls.`
  ),

  "comm-w3-topic-5": d(
    `• Cut: um, uh, like, basically, actually
• Pause instead — sounds confident
• Fix: develop (not devalop), specific (not pacific)`,
    `Count fillers in 2 min. Aim under 3.`
  ),

  "comm-w4-ex-1": d(
    `Role-play: ask a classmate about assignment deadline.`,
    `2 min — question, answer, follow-up.`
  ),

  "comm-w4-ex-2": d(
    `Practice 5 openers aloud. Use one in a real chat today.`,
    `How's the project going? Need any help?`
  ),

  "comm-w4-ex-3": d(
    `Shopping dialogue: price, size, return policy — 2 min.`,
    `Builds confidence for real stores.`
  ),

  "comm-w4-ex-4": d(
    `60s opinion: remote work / online classes / your hobby.`,
    `Structure: opinion + one reason + example.`
  ),

  "comm-w4-topic-1": d(
    `• Home: polite requests — 'Could you help me?'
• College: group work — 'When is our deadline?'`,
    `Practice with family or roommate in English 5 min.`
  ),

  "comm-w4-topic-2": d(
    `• 'How's your week going?'
• 'Working on anything interesting?'
• Short answers + one question back`,
    `Coffee chat before sprint planning.`
  ),

  "comm-w4-topic-3": d(
    `• Shop: 'How much is this?' 'Do you have size M?'
• Travel: 'Where is the gate?' 'One ticket, please'`,
    `Role-play before a real trip or mall visit.`
  ),

  "comm-w4-topic-4": d(
    `• Start: Could you / May I / What is…
• One question at a time
• Wait for full answer`,
    `'What is the expected response time for this API?'`
  ),

  "comm-w4-topic-5": d(
    `• I think… / In my view… / I prefer…
• Give one reason
• Stay respectful if others disagree`,
    `'I think we should test first because it reduces risk.'`
  ),

  "comm-w5-ex-1": d(
    `2-min story: a challenge you solved. No notes.`,
    `Interview STAR stories start here.`
  ),

  "comm-w5-ex-2": d(
    `Describe your morning in English only — 2 min timer.`,
    `Forces thinking in English.`
  ),

  "comm-w5-ex-3": d(
    `Pick a photo. Describe it for 90 seconds.`,
    `Trains quick vocabulary access.`
  ),

  "comm-w5-ex-4": d(
    `Speak non-stop 3 min on any topic. No long pauses.`,
    `If stuck, say 'Another point is…' and continue.`
  ),

  "comm-w5-topic-1": d(
    `• Name things in English as you see them
• Plan your day in English in your head
• Stop translating word-by-word`,
    `Think 'I need coffee' not 'I need coffee' via mother tongue.`
  ),

  "comm-w5-topic-2": d(
    `• Short phrases are OK: 'Still working on it'
• Keep talking — don't freeze for perfect words
• Use simple words when stuck`,
    `Stand-up: better to speak simply than stay silent.`
  ),

  "comm-w5-topic-3": d(
    `• Start — set the scene
• Middle — what happened
• End — result or lesson`,
    `'Last sprint we had a bug… we fixed it… now tests pass.'`
  ),

  "comm-w5-topic-4": d(
    `• Read aloud 5 min daily
• Shadow a short podcast clip
• Describe your screen for 1 min`,
    `Fluency = repetition + speed drills.`
  ),

  "comm-w5-topic-5": d(
    `• Power pose 30s before speaking
• Smile — relaxes voice
• Breathe out before first word`,
    `Before demo: 3 deep breaths, then start.`
  ),

  "comm-w6-ex-1": d(
    `Watch 5-min English video. Summarize in 3 sentences aloud.`,
    `Tests comprehension + speaking together.`
  ),

  "comm-w6-ex-2": d(
    `Listen to 2 different accents. Write 5 new words each.`,
    `Builds ear for global teams.`
  ),

  "comm-w6-ex-3": d(
    `Play a 3-min talk. Take notes. Recap in 60s.`,
    `Same skill as sprint review listening.`
  ),

  "comm-w6-ex-4": d(
    `Partner says something. You paraphrase before replying.`,
    `'So you're saying the API is slow in production?'`
  ),

  "comm-w6-topic-1": d(
    `• Put phone away
• Don't interrupt
• Show you listen: 'So you mean…'`,
    `Client call: repeat requirement before you build.`
  ),

  "comm-w6-topic-2": d(
    `• US, UK, Indian English — all valid
• Focus on meaning, not accent
• Replay hard parts at 0.75x speed`,
    `YouTube tech talks — expose yourself weekly.`
  ),

  "comm-w6-topic-3": d(
    `• Note keywords, not full sentences
• Who / what / when / decision`,
    `Meeting notes: 'John — deploy Friday — need QA sign-off.'`
  ),

  "comm-w6-topic-4": d(
    `• 3 sentences max: main idea + key detail + next step
• Use your words, not copy`,
    `After stand-up: tell a friend what team decided.`
  ),

  "comm-w6-topic-5": d(
    `• 1 podcast or video episode/week
• Pause and predict what comes next
• Write 5 new words from it`,
    `Lex Fridman clips, freeCodeCamp — pick your level.`
  ),

  "comm-w7-ex-1": d(
    `2-min speech: open, 2 points, close. Record it.`,
    `College presentation or team demo format.`
  ),

  "comm-w7-ex-2": d(
    `Read one paragraph: loud, soft, slow, fast — 1 min each.`,
    `Trains voice control.`
  ),

  "comm-w7-ex-3": d(
    `Record 1-min talk. Watch — did you look at camera?`,
    `Fix before next Zoom presentation.`
  ),

  "comm-w7-ex-4": d(
    `Checklist before speaking: posture, breath, smile, opening line.`,
    `Print and use before every presentation.`
  ),

  "comm-w7-topic-1": d(
    `• Stand/sit tall — shoulders back
• Open posture — no crossed arms
• Hands visible — natural gestures`,
    `Video call: camera at eye level looks professional.`
  ),

  "comm-w7-topic-2": d(
    `• Look at camera or people — not only slides
• 2–3 seconds per person in a group
• Glance at notes, return to audience`,
    `Eye contact builds trust in demos.`
  ),

  "comm-w7-topic-3": d(
    `• Pace — slow for important points
• Pitch — vary tone (monotone = boring)
• Volume — loud enough for back row`,
    `Pause before key line: 'The result was… zero downtime.'`
  ),

  "comm-w7-topic-4": d(
    `• Nerves = normal energy
• Prepare opening line by heart
• Small audience first — room, mirror, friend`,
    `First 15 seconds memorized = calm rest of talk.`
  ),

  "comm-w7-topic-5": d(
    `• Open — hook + topic
• Body — 2–3 points
• Close — summary + thank you`,
    `Today I'll cover X, Y, Z. In summary… Thanks.`
  ),

  "comm-w8-ex-1": d(
    `Write 1 request email: clear subject, polite ask, deadline.`,
    `Template for manager and client emails.`
  ),

  "comm-w8-ex-2": d(
    `30s meeting intro: name, role, why you're here.`,
    `First day on client call.`
  ),

  "comm-w8-ex-3": d(
    `Speak 5 professional questions aloud — natural tone.`,
    `Could we schedule a sync to align on scope?`
  ),

  "comm-w8-ex-4": d(
    `90s team update: done, doing, blocked — record or say live.`,
    `Daily stand-up practice.`
  ),

  "comm-w8-topic-1": d(
    `• Subject — specific (PR review needed — auth module)
• Opening — purpose in line 1
• Close — Thanks / Best regards`,
    `Bad: 'Hi' / Good: 'Could you review PR #42 by EOD?'`
  ),

  "comm-w8-topic-2": d(
    `• Be polite + direct
• Use names
• Don't overshare personal life at work`,
    `'Hi Sam, do you have 5 minutes about the API?'`
  ),

  "comm-w8-topic-3": d(
    `• Join on time, mute when not speaking
• One topic at a time
• End with: 'So next steps are…'`,
    `Stand-up: yesterday / today / blockers — under 2 min.`
  ),

  "comm-w8-topic-4": d(
    `• 'Could you clarify…'
• 'What is the priority for…'
• 'Who is the owner of…'`,
    `Better questions = fewer wrong builds.`
  ),

  "comm-w8-topic-5": d(
    `• We, not only I — teamwork
• deadline, stakeholder, deliverable, sync, blocker
• Thank people by name`,
    `'Thanks, Anya, for the quick review.'`
  ),

  "comm-w9-ex-1": d(
    `1-min positive self-talk, then 1-min speech on a strength.`,
    `Builds inner + outer confidence.`
  ),

  "comm-w9-ex-2": d(
    `3 scenarios: late teammate, harsh feedback, happy client — respond aloud.`,
    `EQ practice for real office moments.`
  ),

  "comm-w9-ex-3": d(
    `Etiquette checklist: email, chat, call — 5 rules each. Read aloud.`,
    `Your personal professional standards.`
  ),

  "comm-w9-ex-4": d(
    `Role-play: teammate upset about bug in prod. Listen + empathize + next step.`,
    `'I hear you — let's triage together.'`
  ),

  "comm-w9-topic-1": d(
    `• Prepare — confidence comes from practice
• Celebrate small wins (spoke 1 min!)
• Posture + clear voice = look confident`,
    `Even if nervous inside, clear speech reads as confident.`
  ),

  "comm-w9-topic-2": d(
    `• Know your emotions before you speak
• Stay calm when others are upset
• Respond, don't react`,
    `Angry Slack reply? Wait 10 min, then write.`
  ),

  "comm-w9-topic-3": d(
    `• Say please, thank you, sorry when needed
• Don't interrupt
• Reply within reasonable time`,
    `Professional ≠ cold. Be kind and clear.`
  ),

  "comm-w9-topic-4": d(
    `• Listen to teammates
• Share credit: 'We fixed it'
• Offer help without being asked sometimes`,
    `Good teammate = easy to work with globally.`
  ),

  "comm-w9-topic-5": d(
    `• 'I understand that must be frustrating'
• Ask how they feel before giving advice
• Active listening again — reflect their words`,
    `PM stressed about deadline — acknowledge first.`
  ),

  "comm-w10-ex-1": d(
    `Record 90s career intro. Replay. Cut filler words. Re-record.`,
    `First question in almost every interview.`
  ),

  "comm-w10-ex-2": d(
    `Write + speak 3 STAR stories: challenge, teamwork, failure.`,
    `Covers 80% of behavioral questions.`
  ),

  "comm-w10-ex-3": d(
    `Answer 5 HR questions aloud: strengths, weakness, why us, where in 5 years, conflict.`,
    `Time yourself — under 2 min each.`
  ),

  "comm-w10-ex-4": d(
    `Practice one salary line + one negotiation line — polite, firm.`,
    `I'm excited about the role. Could we discuss compensation?`
  ),

  "comm-w10-topic-1": d(
    `• Research company + role
• Prepare intro, projects, why this job
• Dress neat, test mic/camera`,
    `HR round: culture fit + communication — practice aloud.`
  ),

  "comm-w10-topic-2": d(
    `• Name, stack, years, current focus
• One impressive project in 20 seconds
• End with what you want next`,
    `'I'm a Java developer. I built a payment API serving 10k users.'`
  ),

  "comm-w10-topic-3": d(
    `• Know every line on resume
• Explain project: problem, your role, result
• No lies — they will ask details`,
    `'I owned the auth module — reduced login errors 40%.'`
  ),

  "comm-w10-topic-4": d(
    `• Situation Task Action Result
• 2-min max per story
• Use real examples`,
    `'Tell me about a conflict' → STAR with teammate disagreement.`
  ),

  "comm-w10-topic-5": d(
    `• Salary: research range, state expectation politely
• Intro: same 90s script every time — polished`,
    `'Based on my research, I expect X–Y. Open to discussion.'`
  ),

  "comm-w11-ex-1": d(
    `3-min GD solo: intro topic, 2 points, invite others, summary.`,
    `Practice both speaking and inviting others.`
  ),

  "comm-w11-ex-2": d(
    `2-min debate — pick one side of: AI helps or hurts juniors.`,
    `Builds quick structured argument.`
  ),

  "comm-w11-ex-3": d(
    `Script calm talk: two teammates disagree on approach.`,
    `'Let's list pros of each option and decide together.'`
  ),

  "comm-w11-ex-4": d(
    `60s pitch: convince team to adopt one tool or practice.`,
    `End with: 'Can we try this for one sprint?'`
  ),

  "comm-w11-topic-1": d(
    `• Listen to others first
• Add value — don't dominate
• Summarize: 'So far we agree on…'`,
    `Campus placement GD — structure beats shouting.`
  ),

  "comm-w11-topic-2": d(
    `• Debate: respect other side
• Negotiate: offer options, not ultimatums
• 'What if we…' opens doors`,
    `'Could we split the feature across two sprints?'`
  ),

  "comm-w11-topic-3": d(
    `• Stay on facts, not personal attacks
• 'I feel… when… because…'
• Find win-win when possible`,
    `Two devs want same task — discuss trade-offs calmly.`
  ),

  "comm-w11-topic-4": d(
    `• Lead with benefit to listener
• Use evidence + story
• Call to action at end`,
    `'This refactor saves 2 hours/week — I recommend we do it in Sprint 3.'`
  ),

  "comm-w11-topic-5": d(
    `• Clear vision in few words
• Praise in public, feedback in private
• Admit mistakes — builds trust`,
    `Tech lead: 'Here's the plan. Questions?'`
  ),

  "comm-w12-ex-1": d(
    `Full mock: 90s intro + 5 questions (HR + tech). Record or with friend.`,
    `Capstone — use all prior weeks.`
  ),

  "comm-w12-ex-2": d(
    `5-min presentation on your best project. Slides optional.`,
    `College viva or client demo ready.`
  ),

  "comm-w12-ex-3": d(
    `3 random topics — 1 min each, no prep. Timer on.`,
    `Impromptu builds interview confidence.`
  ),

  "comm-w12-ex-4": d(
    `Write improvement plan: 3 strengths, 3 goals, weekly habits.`,
    `Your roadmap after Prathyu Communication module.`
  ),

  "comm-w12-topic-1": d(
    `• Full flow: intro → technical → behavioral → your questions
• Dress, lighting, backup internet
• Thank you email after`,
    `Treat mock like real — builds muscle memory.`
  ),

  "comm-w12-topic-2": d(
    `• Slides: few words, big visuals
• Tell story, don't read slides
• Q&A: pause, repeat question, answer`,
    `Project demo for college or client.`
  ),

  "comm-w12-topic-3": d(
    `• Structure fast: point → reason → example
• 1 min per topic — practice random prompts
• Breathe — don't rush`,
    `'Tell me about a book you read' — impromptu favorite.`
  ),

  "comm-w12-topic-4": d(
    `• Elevator intro 30s
• Ask about their work
• Exchange LinkedIn — follow up`,
    `Meetup or conference: 'What are you working on?'`
  ),

  "comm-w12-topic-5": d(
    `• Ask for specific feedback
• Note 3 strengths, 3 improvements
• Weekly practice plan going forward`,
    `Communication is lifelong — plan next 12 weeks.`
  ),
};

export function getCommunicationDetail(
  id: string,
  title: string,
  kind: "topic" | "practice"
): AiLearnDetail {
  if (COMMUNICATION_CONTENT[id]) return COMMUNICATION_CONTENT[id];
  return d(
    `${title} — try once in writing or aloud. Keep it under 1 minute.`,
    "Clear updates at work = same care as clean code."
  );
}
