import { AudioSample } from "./types";

export const DEFAULT_SAMPLES: AudioSample[] = [];

export function getStoredSamples(): AudioSample[] {
  const stored = localStorage.getItem("dj_vocal_adda_samples");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading stored samples", e);
    }
  }
  return DEFAULT_SAMPLES;
}

export function saveStoredSamples(samples: AudioSample[]) {
  localStorage.setItem("dj_vocal_adda_samples", JSON.stringify(samples));
}
