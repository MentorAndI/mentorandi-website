import {loadFont as loadHanken} from "@remotion/google-fonts/HankenGrotesk";
import {loadFont as loadNewsreader} from "@remotion/google-fonts/Newsreader";
import {loadFont as loadSpaceMono} from "@remotion/google-fonts/SpaceMono";

export const hanken = loadHanken("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
}).fontFamily;

export const newsreader = loadNewsreader("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
}).fontFamily;

export const spaceMono = loadSpaceMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
}).fontFamily;
