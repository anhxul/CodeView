import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'What programming languages does CodeView support?',
    answer:
      'CodeView supports Python, Java, C, C++, JavaScript, TypeScript, Go, Rust, PHP, Kotlin, and Swift, with full syntax highlighting and language-aware AI analysis for each.',
  },
  {
    question: 'How accurate is the AI code review?',
    answer:
      'CodeView is powered by Google Gemini 2.5 Flash with carefully engineered prompts that force structured analysis across bugs, security, performance, and readability. While highly accurate, we recommend treating AI suggestions as expert guidance alongside human review for critical systems.',
  },
  {
    question: 'Can I analyze an entire GitHub repository?',
    answer:
      'Yes. Paste a public GitHub repository URL, and CodeView will list analyzable source files. Select any file to run a full AI review on it, with results saved to your history.',
  },
  {
    question: 'Is my code stored or used to train AI models?',
    answer:
      'Your code is stored securely in your account history so you can revisit past reviews. We do not use your code to train third-party AI models. You can delete any review at any time.',
  },
  {
    question: 'What is included in the free plan?',
    answer:
      'The Free plan includes 10 AI code reviews per month, support for all 11 languages, basic security scanning, and complexity analysis — no credit card required.',
  },
  {
    question: 'Can I export my review as a PDF?',
    answer:
      'Yes, every completed review can be exported as a professional PDF report containing the full analysis, refactored code, and recommendations — perfect for sharing with your team.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to know about CodeView AI.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {faqs.map((faq, idx) => (
            <div key={faq.question} className="glass overflow-hidden rounded-xl">
              <button
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-muted-foreground transition-transform',
                    openIndex === idx && 'rotate-180 text-primary'
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-6 pb-5 text-sm text-muted-foreground">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}