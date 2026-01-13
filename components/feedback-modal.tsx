"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
    interface Window {
        SMCX: any;
    }
}

import { trackSurveyTap } from "@/app/actions";

export function FeedbackModal() {
    const [isOpen, setIsOpen] = useState(false);

    // We'll use this to trigger the SurveyMonkey widget
    const handleOpen = () => {
        setIsOpen(true);
        trackSurveyTap(); // Track the tap
    };

    useEffect(() => {
        if (isOpen) {
            const moveWidget = () => {
                const widget = document.querySelector('.smcx-widget') || document.querySelector('.smcx-embed');
                const container = document.getElementById('survey-monkey-container');

                if (widget && container) {
                    // Remove from body and append to our container
                    container.innerHTML = ''; // Clear loading state
                    container.appendChild(widget);

                    // Re-trigger show if needed via SDK
                    if (window.SMCX) {
                        try {
                            window.SMCX.push(['show']);
                        } catch (e) { }
                    }
                } else if (!widget) {
                    // If widget isn't loaded yet, try again in a bit
                    setTimeout(moveWidget, 500);
                }
            };

            // Delay slightly to allow modal animation
            const timer = setTimeout(moveWidget, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return (
        <>
            <Button
                variant="outline"
                onClick={handleOpen}
                className="mt-8 border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 rounded-full px-8 py-6 text-lg font-medium backdrop-blur-sm"
            >
                Share Your Thoughts
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#1a1c1e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#1a1c1e]">
                                <h3 className="text-xl font-semibold text-white">Your Feedback Matters</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-zinc-400 saturate-0" />
                                </button>
                            </div>

                            {/* Survey Content */}
                            <div className="p-0 min-h-[550px] flex flex-col items-center justify-center relative bg-white">
                                <div id="survey-monkey-container" className="w-full h-full min-h-[550px]">
                                    <div className="flex flex-col items-center justify-center h-full p-12 text-center text-zinc-500 bg-[#1a1c1e]">
                                        <div className="w-12 h-12 border-2 border-zinc-700 border-t-white rounded-full animate-spin mb-4" />
                                        <p>Loading Survey...</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
        /* Style the SurveyMonkey widget to fit our modal */
        .smcx-widget, .smcx-embed {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: white !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
          z-index: 10 !important;
          display: block !important;
          opacity: 1 !important;
        }
        
        /* Ensure the iframe fills the container */
        #smcx_frame, .smcx-iframe-container {
          width: 100% !important;
          height: 100% !important;
          min-height: 550px !important;
        }

        /* Hide SurveyMonkey's internal footer/branding if possible */
        .smcx-footer, .smcx-branding {
          display: none !important;
        }
      `}</style>
        </>
    );
}
