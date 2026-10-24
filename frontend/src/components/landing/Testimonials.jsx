import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Senior Backend Engineer',
    avatar: 'SC',
    quote:
      'CodeView caught a SQL injection vulnerability in a PR that two reviewers had already approved. It has become a mandatory step in our workflow.',
  },
  {
    name: 'Marcus Patel',
    role: 'Engineering Manager',
    avatar: 'MP',
    quote:
      'The refactored code suggestions are genuinely production-quality. Our onboarding time for junior devs dropped significantly.',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Full-Stack Developer',
    avatar: 'ER',
    quote:
      'I love the AI chat — being able to ask "why is this slow?" and get a real Big-O breakdown instantly is a huge time saver.',
  },
  {
    name: 'David Kim',
    role: 'Security Consultant',
    avatar: 'DK',
    quote:
      'The security scanner is impressively thorough for an automated tool. It flags hardcoded secrets we routinely miss in manual review.',
  },
  {
    name: 'Priya Nair',
    role: 'Tech Lead',
    avatar: 'PN',
    quote:
      'The GitHub repo analysis feature let us audit an entire legacy codebase in an afternoon instead of a week.',
  },
  {
    name: 'Tom Becker',
    role: 'Indie Developer',
    avatar: 'TB',
    quote:
      'As a solo dev, CodeView is like having a senior engineer review every commit. The interview questions feature is a nice bonus too.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by <span className="gradient-text">developers</span> everywhere
          </h2>
          <p className="mt-4 text-muted-foreground">
            See what engineering teams are saying about CodeView AI.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              <Card className="glass h-full">
                <CardContent className="pt-6">
                  <div className="flex gap-1 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">&quot;{t.quote}&quot;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-semibold text-white">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}