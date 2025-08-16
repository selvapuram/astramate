import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Sparkles, ArrowRight, Heart, Users, Compass, BarChart, Download } from "lucide-react";

// ------------------------------------------------------------
// AstraMate — Clickable MVP Wireframe Prototype (Single File)
// ------------------------------------------------------------
// Notes:
// • This is a self-contained interactive prototype (no backend).
// • Navigation is handled via component state.
// • Includes: Landing → Quiz → Results → Matches → Pricing → About.
// • Uses shadcn/ui + Tailwind + framer-motion for a clean wireframe look.
// ------------------------------------------------------------

const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="w-full max-w-6xl mx-auto px-4 py-10">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm md:text-base text-muted-foreground mt-1">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </motion.div>
  </section>
);

const navItems = [
  { key: "home", label: "Home" },
  { key: "quiz", label: "Quiz" },
  { key: "results", label: "Results" },
  { key: "matches", label: "Matches" },
  { key: "pricing", label: "Pricing" },
  { key: "about", label: "About" },
];

const QUESTIONS = [
  { id: "openness", q: "I enjoy trying new activities and experiences.", type: "likert" },
  { id: "conscientiousness", q: "I prefer to plan and stick to routines.", type: "likert" },
  { id: "extraversion", q: "I feel energized by social interactions.", type: "likert" },
  { id: "agreeableness", q: "I try to avoid conflict in relationships.", type: "likert" },
  { id: "neuroticism", q: "I often worry about relationship outcomes.", type: "likert" },
  { id: "loveLanguage", q: "Primary love language?", type: "mcq", options: ["Words", "Acts", "Gifts", "Time", "Touch"] },
  { id: "attachment", q: "Attachment style?", type: "mcq", options: ["Secure", "Anxious", "Avoidant", "Disorganized"] },
  { id: "family", q: "Preferred family setup?", type: "mcq", options: ["Joint", "Nuclear", "Flexible"] },
  { id: "relocate", q: "Willing to relocate for a partner?", type: "mcq", options: ["Yes", "No", "Maybe"] },
];

const LIKERT = [1, 2, 3, 4, 5];

function Likert({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {LIKERT.map((n) => (
        <Button key={n} variant={value === n ? "default" : "outline"} className="w-10" onClick={() => onChange(n)}>
          {n}
        </Button>
      ))}
    </div>
  );
}

function MCQ({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((op) => (
        <Button key={op} variant={value === op ? "default" : "outline"} onClick={() => onChange(op)}>
          {op}
        </Button>
      ))}
    </div>
  );
}

function computeProfile(answers) {
  // Normalize Big Five 0..1. Defaults to 0.5 if unanswered.
  const norm = (v) => (typeof v === "number" ? (v - 1) / 4 : 0.5);
  return {
    openness: norm(answers.openness),
    conscientiousness: norm(answers.conscientiousness),
    extraversion: norm(answers.extraversion),
    agreeableness: norm(answers.agreeableness),
    neuroticism: norm(answers.neuroticism),
    loveLanguage: answers.loveLanguage || null,
    attachment: answers.attachment || null,
    family: answers.family || null,
    relocate: answers.relocate || null,
  };
}

function compatibilityScore(a, b) {
  // Psychological distance (Euclidean over Big Five)
  const dims = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"];
  const dist = Math.sqrt(
    dims.map((k) => (a[k] - b[k]) ** 2).reduce((s, n) => s + n, 0)
  );
  const psych = 1 - dist / Math.sqrt(dims.length);

  // Simple heuristics for preferences
  const loveBonus = a.loveLanguage && b.loveLanguage && a.loveLanguage === b.loveLanguage ? 0.1 : 0;
  const attachBonus = a.attachment && b.attachment && (a.attachment === "Secure" || b.attachment === "Secure") ? 0.05 : 0;
  const familyBonus = a.family && b.family && (a.family === b.family || a.family === "Flexible" || b.family === "Flexible") ? 0.05 : 0;
  const relocateBonus = a.relocate && b.relocate && (a.relocate !== "No" || b.relocate !== "No") ? 0.03 : 0;

  // Placeholder astrology (wireframe): use love language proximity as proxy
  const astro = 0.6 + (a.loveLanguage === b.loveLanguage ? 0.2 : 0);

  const final = 0.4 * psych + 0.4 * astro + 0.2 * (loveBonus + attachBonus + familyBonus + relocateBonus);
  return Math.max(0, Math.min(1, final));
}

function FakeMatches({ profile }) {
  // Create mock candidates and score them against current profile
  const candidates = useMemo(() => [
    { id: 1, name: "Ayesha R.", age: 27, role: "Product Designer", city: "Bengaluru", prefs: { loveLanguage: "Time", attachment: "Secure", family: "Flexible", relocate: "Yes" }, traits: { openness: 0.8, conscientiousness: 0.6, extraversion: 0.7, agreeableness: 0.7, neuroticism: 0.3 } },
    { id: 2, name: "Meera K.", age: 29, role: "Data Scientist", city: "Hyderabad", prefs: { loveLanguage: "Words", attachment: "Anxious", family: "Nuclear", relocate: "Maybe" }, traits: { openness: 0.7, conscientiousness: 0.8, extraversion: 0.4, agreeableness: 0.8, neuroticism: 0.4 } },
    { id: 3, name: "Sara A.", age: 26, role: "Architect", city: "Dubai", prefs: { loveLanguage: "Touch", attachment: "Secure", family: "Joint", relocate: "No" }, traits: { openness: 0.5, conscientiousness: 0.7, extraversion: 0.6, agreeableness: 0.6, neuroticism: 0.2 } },
  ], []);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {candidates.map((c) => {
        const candidateProfile = { ...c.prefs, ...c.traits };
        const score = Math.round(compatibilityScore(profile, candidateProfile) * 100);
        return (
          <Card key={c.id} className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Heart className="w-5 h-5" /> {c.name}
                <Badge className="ml-auto">{score}% match</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex gap-2 flex-wrap text-muted-foreground">
                <span>Age {c.age}</span><span>•</span><span>{c.role}</span><span>•</span><span>{c.city}</span>
              </div>
              <div className="text-xs mt-2">Love Language: {c.prefs.loveLanguage} • Attachment: {c.prefs.attachment}</div>
              <Button className="w-full mt-3" variant="secondary">View Profile</Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function AstraMatePrototype() {
  const [route, setRoute] = useState("home");
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const progress = Math.round(((step) / QUESTIONS.length) * 100);

  const profile = useMemo(() => computeProfile(answers), [answers]);

  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setTimeout(() => setStep((s) => Math.min(s + 1, QUESTIONS.length)), 120);
  };

  const resetQuiz = () => {
    setAnswers({});
    setStep(0);
    setRoute("quiz");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/30">
      {/* Top Nav */}
      <div className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center gap-2 px-4 py-3">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">AstraMate</span>
          <nav className="ml-auto hidden md:flex gap-1">
            {navItems.map((n) => (
              <Button key={n.key} variant={route === n.key ? "default" : "ghost"} onClick={() => setRoute(n.key)}>
                {n.label}
              </Button>
            ))}
          </nav>
          <div className="ml-auto md:ml-2">
            <a href="/mnt/data/AstraMate_PitchDeck.pdf" target="_blank" rel="noreferrer">
              <Button variant="outline"><Download className="w-4 h-4 mr-2"/>Pitch Deck</Button>
            </a>
          </div>
        </div>
      </div>

      {/* Routes */}
      <AnimatePresence mode="wait">
        {route === "home" && (
          <motion.main key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Section id="hero" title="AI Matchmaking that Aligns the Stars and the Soul" subtitle="Horoscope + Psychology + Values → Better Matches, Faster.">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Star className="w-5 h-5"/>Why AstraMate</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2"><Check className="w-4 h-4 mt-1"/>Blend Vedic astrology with modern psychology</div>
                    <div className="flex items-start gap-2"><Check className="w-4 h-4 mt-1"/>Explainable compatibility scores and guidance</div>
                    <div className="flex items-start gap-2"><Check className="w-4 h-4 mt-1"/>Privacy-first, exportable reports for families</div>
                    <div className="pt-2">
                      <Button onClick={() => setRoute("quiz")}>
                        Try the Quiz <ArrowRight className="w-4 h-4 ml-2"/>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5"/>How it Works</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="astro">
                      <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="astro">Astrology</TabsTrigger>
                        <TabsTrigger value="psych">Psychology</TabsTrigger>
                        <TabsTrigger value="coach">Coaching</TabsTrigger>
                      </TabsList>
                      <TabsContent value="astro" className="text-sm mt-3">Input birth details → generate chart → compute Guna-like compatibility.</TabsContent>
                      <TabsContent value="psych" className="text-sm mt-3">5-minute quiz → Big Five + preferences → similarity scoring.</TabsContent>
                      <TabsContent value="coach" className="text-sm mt-3">AI coach suggests conversation tips and growth areas.</TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </Section>

            <Section id="socialproof" title="Built for Modern Matchmaking" subtitle="Respecting tradition, powered by science.">
              <div className="grid md:grid-cols-3 gap-4">
                {["Cultural fit", "Emotional alignment", "Transparent scoring"].map((t, i) => (
                  <Card key={i} className="rounded-2xl"><CardHeader><CardTitle>{t}</CardTitle></CardHeader><CardContent className="text-sm">Lorem ipsum placeholder copy for the wireframe.</CardContent></Card>
                ))}
              </div>
            </Section>
          </motion.main>
        )}

        {route === "quiz" && (
          <motion.main key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Section id="quiz" title="Compatibility Quiz" subtitle="Answer a few questions to generate your profile.">
              <div className="max-w-3xl">
                <div className="mb-3 text-sm text-muted-foreground">Progress: {progress}%</div>
                <Progress value={progress} className="h-2" />
                <Card className="rounded-2xl mt-6">
                  <CardContent className="pt-6 space-y-6">
                    {step < QUESTIONS.length ? (
                      <>
                        <div className="text-base md:text-lg font-medium">{QUESTIONS[step].q}</div>
                        {QUESTIONS[step].type === "likert" && (
                          <Likert value={answers[QUESTIONS[step].id]} onChange={(v) => handleAnswer(QUESTIONS[step].id, v)} />
                        )}
                        {QUESTIONS[step].type === "mcq" && (
                          <MCQ options={QUESTIONS[step].options} value={answers[QUESTIONS[step].id]} onChange={(v) => handleAnswer(QUESTIONS[step].id, v)} />
                        )}
                        <div className="flex justify-between pt-4">
                          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</Button>
                          <Button onClick={() => setStep((s) => Math.min(QUESTIONS.length, s + 1))}>Next</Button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-lg font-semibold flex items-center gap-2"><Compass className="w-5 h-5"/>You're done!</div>
                        <p className="text-sm text-muted-foreground">Generate your profile and see suggested matches.</p>
                        <div className="flex gap-2">
                          <Button onClick={() => setRoute("results")}>
                            View Results <ArrowRight className="w-4 h-4 ml-2"/>
                          </Button>
                          <Button variant="outline" onClick={resetQuiz}>Restart</Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </Section>
          </motion.main>
        )}

        {route === "results" && (
          <motion.main key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Section id="results" title="Your Compatibility Profile" subtitle="A preview of your psychological + preference summary.">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="rounded-2xl">
                  <CardHeader><CardTitle>Traits</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {[
                      ["Openness", profile.openness],
                      ["Conscientiousness", profile.conscientiousness],
                      ["Extraversion", profile.extraversion],
                      ["Agreeableness", profile.agreeableness],
                      ["Neuroticism", profile.neuroticism],
                    ].map(([label, v]) => (
                      <div key={label}>
                        <div className="flex justify-between"><span>{label}</span><span>{Math.round((v || 0) * 100)}%</span></div>
                        <Progress value={Math.round((v || 0) * 100)} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="rounded-2xl">
                  <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1"><div className="text-muted-foreground">Love Language</div><Badge>{profile.loveLanguage || "—"}</Badge></div>
                    <div className="space-y-1"><div className="text-muted-foreground">Attachment</div><Badge>{profile.attachment || "—"}</Badge></div>
                    <div className="space-y-1"><div className="text-muted-foreground">Family</div><Badge>{profile.family || "—"}</Badge></div>
                    <div className="space-y-1"><div className="text-muted-foreground">Relocate</div><Badge>{profile.relocate || "—"}</Badge></div>
                    <div className="col-span-2 pt-2">
                      <Button className="w-full" onClick={() => setRoute("matches")}>
                        See Suggested Matches <ArrowRight className="w-4 h-4 ml-2"/>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Section>
          </motion.main>
        )}

        {route === "matches" && (
          <motion.main key="matches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Section id="matches" title="Suggested Matches" subtitle="Ranked by blended psychology + (placeholder) astrology score.">
              <FakeMatches profile={profile} />
              <div className="flex justify-end mt-6">
                <Button variant="outline" onClick={() => setRoute("pricing")}>Upgrade to Unlock Contact</Button>
              </div>
            </Section>
          </motion.main>
        )}

        {route === "pricing" && (
          <motion.main key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Section id="pricing" title="Simple Pricing" subtitle="Start free. Upgrade when you're ready.">
              <div className="grid md:grid-cols-3 gap-4">
                {[{
                  name: "Free",
                  price: "$0",
                  features: ["Basic quiz", "Profile summary", "Limited matches"],
                },{
                  name: "Premium",
                  price: "$9/mo",
                  features: ["Full compatibility report", "Unlimited matches", "Contact unlock"],
                },{
                  name: "Concierge",
                  price: "$99/session",
                  features: ["Human matchmaker", "Astrologer consult", "Personalized coaching"],
                }].map((tier) => (
                  <Card key={tier.name} className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5"/>{tier.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold">{tier.price}</div>
                      <ul className="mt-3 space-y-2 text-sm">
                        {tier.features.map((f) => (
                          <li key={f} className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5"/>{f}</li>
                        ))}
                      </ul>
                      <Button className="w-full mt-4">Choose {tier.name}</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>
          </motion.main>
        )}

        {route === "about" && (
          <motion.main key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Section id="about" title="About the MVP" subtitle="This interactive wireframe demonstrates the core flows for investors and early users.">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="rounded-2xl">
                  <CardHeader><CardTitle>Vision</CardTitle></CardHeader>
                  <CardContent className="text-sm">Blend tradition and science for a respectful, data-informed matchmaking experience. Next steps include integrating real astrology APIs, privacy-preserving scoring, and family-friendly sharing.</CardContent>
                </Card>
                <Card className="rounded-2xl">
                  <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Founder</div>
                      <div>Your Name • Backend Engineer @ HelloFresh</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Email</div>
                      <div>founder@example.com</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Pitch Deck</div>
                      <a className="underline" href="/mnt/data/AstraMate_PitchDeck.pdf" target="_blank" rel="noreferrer">Open PDF</a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Section>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Bottom CTA */}
      <div className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="font-semibold">Ready to align the stars?</div>
            <div className="text-sm text-muted-foreground">Take the quiz and preview your compatibility today.</div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setRoute("quiz")}>Start Quiz</Button>
            <Button variant="outline" onClick={() => setRoute("pricing")}>See Pricing</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
