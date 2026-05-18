import React from "react";
import appLogo from "@/../public/typo_graphy.png";
import Image from "next/image";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-bg transition-colors duration-300">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-16">
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <div className="w-full aspect-square flex-center rounded-xl opacity-40">
            <Image src={appLogo} alt="logo"></Image>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">{children}</div>
      </div>
    </div>
  );
}
