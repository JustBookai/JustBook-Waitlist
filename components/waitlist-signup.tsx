"use client";

import { XIcon } from "@/components/icons/x-icon";
import { DiscordIcon } from "@/components/icons/discord-icon";
import { FacebookIcon } from "@/components/icons/facebook-icon";
import { LinkedInIcon } from "@/components/icons/linkedin-icon";
import { WaitlistForm } from "./waitlist-form";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { SocialIcon } from "@/components/social-icon";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FeedbackModal } from "./feedback-modal";
import { motion, easeOut } from "motion/react";
import { GithubIcon } from "@/components/icons/github-icon";
import { useEffect, useState } from "react";
import { getLiveStats } from "@/app/actions";

const variants = {
  hide: {
    opacity: 0,
    translateY: -10
  },
  visible: (custom: number) => ({
    opacity: 1, translateY: 0,
    transition: {
      delay: custom * 0.2,
      ease: easeOut,
      duration: 0.5
    }
  })
}

export function WaitlistSignup() {
  const [stats, setStats] = useState({ signups: 200, surveyTaps: 45 });

  useEffect(() => {
    // Initial fetch
    getLiveStats().then(setStats);

    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      getLiveStats().then(setStats);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[900px] mx-auto p-8 flex flex-col justify-center min-h-screen">
      <motion.div initial="hide" animate="visible" className="flex-1 flex flex-col justify-center items-center text-center">

        {/* Logo Placeholder */}
        <motion.div custom={0} variants={variants} className="mb-[60px]">
          <div className="h-16 w-48 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
            <img src="JB.png" alt="Logo" />
          </div>
        </motion.div>

        <header className="space-y-6 mb-10 max-w-[800px]">
          <motion.h1 custom={1} variants={variants} className="font-bold text-4xl sm:text-[64px] leading-[1.2] text-foreground tracking-tight">
            Join the JustBook Waitlist
          </motion.h1>
          <motion.div custom={1} variants={variants}>
            <p className="text-lg sm:text-xl text-muted-foreground text-balance">
              Be part of something truly extraordinary. Join thousands of others
              already gaining early access to our revolutionary new product.
            </p>
          </motion.div>
        </header>

        <motion.div
          custom={2}
          variants={variants}
          className="max-w-[700px] mb-12 text-left"
        >
          <div className="relative p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#12A19A] to-[#FF921E]" />

            <p className="text-foreground/90 leading-relaxed mb-6">
              <span className="text-white font-semibold">JustBook</span> is an upcoming Zambian SAAS multiplatform application designed to bridge the gap between service excellence and convenience.
            </p>

            <blockquote className="border-l-2 border-zinc-700 pl-6 my-6 italic text-muted-foreground">
              "We're transforming how you interact with your favorite service providers. No more waiting in long queues or wasting precious hours."
            </blockquote>

            <p className="text-foreground/80 leading-relaxed">
              Instead of physically visiting premises to wait in line, JustBook empowers you to secure your session at the exact time you choose. Whether it's a barber shop, a clinical consultation, or a professional advisor, you can now book your slot digitally and be attended to without the wait.
            </p>
          </div>
        </motion.div>

        <motion.div custom={4} variants={variants} className="w-full max-w-md mx-auto">
          <WaitlistForm onSuccess={() => getLiveStats().then(setStats)} />
        </motion.div>

        <motion.div custom={3} variants={variants} className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-3">
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/150?img=10" />
              </Avatar>
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/150?img=20" />
              </Avatar>
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/150?img=5" />
              </Avatar>
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/150?img=40" />
              </Avatar>
            </div>
            <p className="text-foreground text-sm opacity-70">
              {stats.signups} people on the waitlist
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF921E] animate-pulse" />
            <span>{stats.surveyTaps} survey interactions today</span>
          </div>
        </motion.div>

        <motion.div custom={5} variants={variants}>
          <FeedbackModal />
        </motion.div>
      </motion.div>
    </div>
  );
}
