"use client";
import React from "react";
import { SparklesCore } from "../ui/sprakles";
import TitleSection from "../globals/title-section";
import { TextGenerateEffect } from "../ui/text-generate-effect";

export default function MainShit() {
  return (
    <div className=" h-[15rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      {/* <TitleSection pill='' title="we actually don't need a logout button"></TitleSection> */}
      <TextGenerateEffect className="text-washed-purple-700 text-center" words="⚡️ Supercharge your note-taking with AI-powered ✨ autocomplete ✨" />
    </div>
  );
}
