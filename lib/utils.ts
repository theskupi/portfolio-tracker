import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CUSTOM_PALETTE = [
  "#A6CEE3",
  "#1F78B4",
  "#B2DF8A",
  "#33A02C",
  "#FB9A99",
  "#E31A1C",
  "#FDBF6F",
  "#FF7F00",
  "#CAB2D6",
  "#6A3D9A",
  "#FFFF99",
  "#B15928",
  "#8DD3C7",
  "#FFFFB3",
  "#BEBADA",
  "#FB8072",
  "#80B1D3",
  "#FDB462",
  "#B3DE69",
  "#FCCDE5",
];

// Convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

// Adjust color brightness (factor > 1 = lighter, < 1 = darker)
const adjustBrightness = (hex: string, factor: number): string => {
  const rgb = hexToRgb(hex);
  const adjust = (value: number) =>
    Math.min(255, Math.max(0, Math.round(value * factor)));

  const r = adjust(rgb.r).toString(16).padStart(2, "0");
  const g = adjust(rgb.g).toString(16).padStart(2, "0");
  const b = adjust(rgb.b).toString(16).padStart(2, "0");

  return `#${r}${g}${b}`;
};

// Generate color from palette with lighter/darker shades if needed
export const generateColor = (index: number): string => {
  if (index < CUSTOM_PALETTE.length) {
    return CUSTOM_PALETTE[index];
  }

  // For additional colors, use lighter/darker shades of the palette
  const baseIndex = index % CUSTOM_PALETTE.length;
  const baseColor = CUSTOM_PALETTE[baseIndex];
  const cycle = Math.floor(index / CUSTOM_PALETTE.length);

  // Alternate between lighter and darker shades
  const factor = cycle % 2 === 0 ? 1.3 : 0.7; // Lighter or darker
  return adjustBrightness(baseColor, factor);
};
