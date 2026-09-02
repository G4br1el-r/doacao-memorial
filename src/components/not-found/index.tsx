"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { HeroBackground } from "@/components/landing-page/hero/hero-background";
import { Signature } from "@/components/landing-page/hero/hero-signature";
import { SMOOTH } from "@/lib/animation/easing";
import { NOT_FOUND_COPY } from "./constants";

export function NotFoundScreen() {
  return (
    <main className="min-h-dvh-fallback relative flex flex-col items-center justify-center overflow-x-clip bg-black px-6 py-16 text-center">
      <HeroBackground />

      <div className="absolute inset-0 z-20 bg-black/55" />
      <div className="absolute bottom-0 left-0 z-20 h-1/2 w-full bg-linear-to-t from-black to-transparent" />

      <motion.div
        className="relative z-30 flex w-full max-w-lg flex-col items-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: SMOOTH }}
      >
        <motion.span
          className="text-lg text-[#d9c9a3]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: SMOOTH }}
        >
          ✦
        </motion.span>

        <motion.p
          className="mt-4 text-[13px] tracking-[0.3em] text-[#d9c9a3]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: SMOOTH }}
        >
          {NOT_FOUND_COPY.eyebrow}
        </motion.p>

        <motion.p
          className="mt-6 font-display text-[clamp(5.5rem,26vw,9rem)] font-bold leading-none tracking-[0.02em] text-[#e8dcc0]"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.5, ease: SMOOTH }}
        >
          404
        </motion.p>

        <motion.h1
          className="mt-4 font-serif text-3xl font-medium leading-snug text-[#e8dcc0] sm:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.75, ease: SMOOTH }}
        >
          {NOT_FOUND_COPY.title}
        </motion.h1>

        <motion.div
          className="mt-7 h-px w-24 bg-linear-to-r from-transparent via-[#d9c9a3]/60 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.9, ease: SMOOTH }}
        />

        <motion.p
          className="mt-7 max-w-md text-[15px] leading-relaxed text-white/75"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.05, ease: SMOOTH }}
        >
          {NOT_FOUND_COPY.message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.25, ease: SMOOTH }}
        >
          <Link
            href="/"
            className="group mt-9 inline-flex min-h-11 items-center justify-center gap-3 rounded-lg bg-linear-to-r from-[#c9b184] via-[#f0e2c0] to-[#c9b184] px-8 py-3 text-[13px] font-semibold tracking-[0.15em] text-black transition-opacity hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {NOT_FOUND_COPY.action}
          </Link>
        </motion.div>
      </motion.div>

      <Signature
        className="relative z-30 mt-14 w-[clamp(12rem,58vw,17rem)]"
        delay={1.5}
      />
    </main>
  );
}
