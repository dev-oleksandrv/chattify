import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export function enableMediaTracks(tracks: MediaStreamTrack[]) {
  tracks.forEach((track) => {
    track.enabled = true;
  });
}

export function disableMediaTracks(tracks: MediaStreamTrack[]) {
  tracks.forEach((track) => {
    track.enabled = false;
  });
}
