import React from 'react';
import { motion } from 'framer-motion';
import {
  Bug,
  ShieldAlert,
  Gauge,
  Wand2,
  GitBranch,
  MessageSquare,
  FileBarChart,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Bug,
    title: 'Bug Detection',
    description: 'AI scans your code for logic errors, edge cases, and potential runtime bugs.',
  },
  {
    icon: ShieldAlert,
    title: 'Security Analysis',
    description: 'Detect SQL injection, XSS, hardcoded secrets, and weak input validation.',
  },
  {
    icon: Gauge,
    title: 'Performance Insights',
    description: 'Identify bottlenecks with Big-O complexity analysis and optimization tips.',
  },
  {
    icon: Wand2,
    title: 'Refactor Engine',
    description: 'Get a complete, cleaner rewrite of your code following best practices.',
  },
  {
    icon: GitBranch,
    title: 'GitHub Analysis',
    description: 'Paste a repo URL and let CodeView review files directly from GitHub.',
  },
  {
    icon: MessageSquare,
    title: 'AI Chat Support',
    description: 'Ask follow-up questions, request conversions, or get line-by-line explanations.',
  },
  {
    icon: FileBarChart,
    title: 'Quality Scoring',
    description: 'Every review includes an overall score plus a maintainability breakdown.',
  },
  {
    icon: BookOpen,
    title: 'Learning Resources',
    description: 'Get curated docs, interview questions, and resources tailored to your code.',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for <span className="gradient-text">better code</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            A complete AI-powered toolkit that reviews, explains, refactors, and teaches — all in one
            place.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              <Card className="glass h-full transition-transform hover:-translate-y-1 hover:border-primary/40">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-cyan-400/20">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}