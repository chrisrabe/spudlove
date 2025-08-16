import { atom } from "jotai";
import type { Location } from "@/types/location.ts";

export const locationsAtom = atom<Location[]>([]);
