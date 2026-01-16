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
import { Users, Star } from "lucide-react";

const variants = {
  hide: {
    opacity: 0,
    translateY: 20
  },
  visible: (custom: number) => ({
    opacity: 1, translateY: 0,
    transition: {
      delay: custom * 0.1,
      ease: easeOut,
      duration: 0.6
    }
  })
}

export function WaitlistSignup() {
  const [stats, setStats] = useState({ signups: 0, surveyTaps: 0 });

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
    <div className="w-full max-w-[1200px] mx-auto px-6 py-12 flex flex-col justify-center min-h-screen relative">
      <div className="bg-pattern" />

      <motion.div initial="hide" animate="visible" className="relative z-10 flex flex-col items-center">

        {/* Logo Section */}
        <motion.div custom={0} variants={variants} className="mb-12">
          <img src="JB.png" alt="JustBook Logo" className="h-20 w-auto drop-shadow-2xl" />
        </motion.div>

        {/* Hero Section */}
        <header className="text-center space-y-6 mb-16 max-w-[800px]">
          <motion.div custom={1} variants={variants}>
            <span className="px-4 py-1.5 rounded-full bg-[#12A19A]/10 text-[#12A19A] text-xs font-bold uppercase tracking-widest border border-[#12A19A]/20 inline-block mb-4">
              Coming Soon to Zambia
            </span>
          </motion.div>
          <motion.h1 custom={2} variants={variants} className="font-extrabold text-5xl sm:text-[72px] leading-[1.1] text-white tracking-tight">
            The Future of <span className="text-white">Booking</span>
          </motion.h1>
          <motion.p custom={3} variants={variants} className="text-lg sm:text-xl text-muted-foreground text-balance max-w-[600px] mx-auto">
            Secure your sessions digitally. No queues, no delays—just pure efficiency for your favorite service providers.
          </motion.p>
        </header>

        {/* Main Content Area */}
        <div className="w-full max-w-4xl space-y-8 mb-16">

          {/* Form & Stats */}
          <motion.div custom={4} variants={variants} className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#12A19A] to-[#FF921E]" />
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Users className="text-[#12A19A]" size={24} /> Get Early Access
            </h2>
            <WaitlistForm onSuccess={() => getLiveStats().then(setStats)} />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10 mt-6">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-3">
                  {[10, 20, 5, 40].map(img => (
                    <Avatar key={img} className="border-2 border-[#090D31] w-10 h-10">
                      <AvatarImage src={`https://i.pravatar.cc/150?img=${img}`} />
                    </Avatar>
                  ))}
                </div>
                <p className="text-white font-bold text-sm">
                  {stats.signups} <span className="text-muted-foreground font-normal">on the list</span>
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-bold text-[#FF921E] bg-[#FF921E]/10 px-4 py-2 rounded-full border border-[#FF921E]/20">
                <span className="flex h-2 w-2 rounded-full bg-[#FF921E] animate-pulse" />
                <span>{stats.surveyTaps} INTERACTIONS TODAY</span>
              </div>
            </div>
          </motion.div>

          {/* About Section */}
          <motion.div custom={5} variants={variants} className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl group hover:border-[#12A19A]/30 transition-colors">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#12A19A]">
              <Star size={18} /> About JustBook
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              JustBook is an upcoming Zambian SaaS multiplatform application designed to bridge the gap between service excellence and convenience. Securing your slot digitally means you spend time where it matters, not in a queue.
            </p>
          </motion.div>
        </div>

        {/* Socials */}
        <motion.div custom={6} variants={variants} className="flex justify-center items-center gap-8 py-8 border-t border-white/5 w-full">
          <SocialIcon href="#" icon={<XIcon />} label="X (Twitter)" />
          <SocialIcon href="#" icon={<InstagramIcon />} label="Instagram" />
          <SocialIcon href="#" icon={<LinkedInIcon />} label="LinkedIn" />
          <SocialIcon href="#" icon={<FacebookIcon />} label="Facebook" />
        </motion.div>

        {/* Feedback Section - Moved Down */}
        <motion.div custom={7} variants={variants} className="mt-8">
          <FeedbackModal />
        </motion.div>

      </motion.div>
    </div>
  );
}
