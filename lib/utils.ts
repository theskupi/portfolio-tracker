import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BrandInfo } from "./brandfetchApi";

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

// Alternative palette:
// const CUSTOM_PALETTE = ["#f72585", "#b5179e", "#7209b7", "#560bad", "#480ca8", "#3a0ca3", "#3f37c9", "#4361ee", "#4895ef", "#4cc9f0"];

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
  const baseIndex = index % CUSTOM_PALETTE.length;
  return CUSTOM_PALETTE[baseIndex];
};

// Get brand color from BrandInfo, with fallback to palette
export const getBrandColor = (
  brandColors:
    | Array<{ hex: string; type: string; brightness: number }>
    | undefined,
  fallbackIndex: number,
  symbol?: string
): string => {
  // Only use fallback if no brand colors exist at all
  if (!brandColors || brandColors.length === 0) {
    return generateColor(fallbackIndex);
  }

  // Use only accent color
  const accentColor = brandColors.find((c) => c.type === "accent");
  if (accentColor) {
    return accentColor.hex;
  }

  // If no accent color, fall back to palette
  return generateColor(fallbackIndex);
};

// Get gradient colors for a given index (lighter, base, darker)
export const getGradientColors = (index: number) => {
  const baseColor = generateColor(index);
  return {
    id: `gradient-${index}`,
    lighter: adjustBrightness(baseColor, 1.3),
    base: baseColor,
    darker: adjustBrightness(baseColor, 0.7),
  };
};

// Helper function to get the best logo from BrandInfo
export const getBestLogo = (brandInfo?: BrandInfo): string | null => {
  if (!brandInfo || !brandInfo.logos || brandInfo.logos.length === 0) {
    return null;
  }

  // Prioritize icon type logos
  const iconLogo = brandInfo.logos.find((logo) => logo.type === "icon");
  const logoToUse = iconLogo || brandInfo.logos[0];

  if (!logoToUse.formats || logoToUse.formats.length === 0) {
    return null;
  }

  // Prefer SVG format, then PNG
  const svgFormat = logoToUse.formats.find((f) => f.format === "svg");
  const pngFormat = logoToUse.formats.find((f) => f.format === "png");
  const format = svgFormat || pngFormat || logoToUse.formats[0];

  return format.src;
};
