"use client";

import Script from "next/script";
import { useEffect, useId } from "react";

type TurnstileFieldProps = {
  siteKey: string;
  value: string;
  onChange: (value: string) => void;
};

declare global {
  interface Window {
    [key: string]: unknown;
  }
}

export function TurnstileField({ siteKey, onChange }: TurnstileFieldProps) {
  const callbackName = useId().replace(/:/g, "_");

  useEffect(() => {
    if (!siteKey) {
      return;
    }

    window[callbackName] = (token: string) => onChange(token);

    return () => {
      delete window[callbackName];
    };
  }, [callbackName, onChange, siteKey]);

  if (!siteKey) {
    return null;
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div
        className="cf-turnstile"
        data-sitekey={siteKey}
        data-theme="light"
        data-callback={callbackName}
      />
    </>
  );
}
