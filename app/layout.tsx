import React from "react";
import type { Metadata } from "next";
import { Cal_Sans as FontHeading, Plus_Jakarta_Sans as FontSans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontHeading = FontHeading({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "400"
});

export const metadata: Metadata = {
  title: "Waitly: Waiting list Next.js template.",
  description:
    "A simple and useful waiting list Next.js template. It's free and open source. Built with React, Tailwind CSS, and shadcn/ui. Typescript compatible.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontHeading.variable} font-sans antialiased`}
      >
        <div className="bg-pattern"></div>
        {children}
        <Script id="smcx-sdk-loader">
          {`(function(t,e,s,n){var o,a,c;t.SMCX=t.SMCX||[],e.getElementById(n)||(o=e.getElementsByTagName(s),a=o[o.length-1],c=e.createElement(s),c.type="text/javascript",c.async=!0,c.id=n,c.src="https://widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgd2AGsEw4L_2BF3pai9P4pXeLZrAoMkpsx5tAE3m2Lf9DNV.js",a.parentNode.insertBefore(c,a))})(window,document,"script","smcx-sdk");`}
        </Script>
        <style dangerouslySetInnerHTML={{
          __html: `
          /* Initially hide SurveyMonkey but let it load */
          .smcx-widget, .smcx-embed {
            opacity: 0 !important;
            pointer-events: none !important;
            position: fixed !important;
            bottom: -9999px !important;
          }
          
          /* Reveal and reset when inside our custom modal */
          #survey-monkey-container .smcx-widget, 
          #survey-monkey-container .smcx-embed {
            opacity: 1 !important;
            pointer-events: auto !important;
            position: absolute !important;
            bottom: 0 !important;
            display: block !important;
          }
        ` }} />
        <div className="fixed bottom-4 right-4 z-[9999] opacity-30 hover:opacity-100 transition-opacity">
          <a style={{ font: "10px Helvetica, sans-serif", color: "#666", textDecoration: "none" }} href="https://www.surveymonkey.com"> Create your own user feedback survey </a>
        </div>
      </body>
    </html>
  );
}
