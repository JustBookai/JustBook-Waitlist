"use client";

import { XIcon } from "@/components/icons/x-icon";
import { DiscordIcon } from "@/components/icons/discord-icon";
import { FacebookIcon } from "@/components/icons/facebook-icon";
import { LinkedInIcon } from "@/components/icons/linkedin-icon";
import { WaitlistForm } from "./waitlist-form";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { SocialIcon } from "@/components/social-icon";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { motion, easeOut} from "motion/react";
import {GithubIcon} from "@/components/icons/github-icon";

const variants = {
  hide: {opacity: 0,
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
            <p className="text-lg sm:text-xl  text-muted-foreground text-balance">
              Be part of something truly extraordinary. Join thousands of others
              already gaining early access to our revolutionary new product.
            </p>
          </motion.div>
        </header>

        <motion.div custom={4} variants={variants} className="w-full max-w-md mx-auto">
          <WaitlistForm />
        </motion.div>
        <motion.div custom={3} variants={variants} className="flex items-center justify-center  space-x-4">
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
            200+ people on the waitlist
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
