// Color contrast checker for accessibility
// https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum

/**
 * Converts a hex color to RGB values
 * @param hex The hex color code (with or without '#')
 * @returns RGB values as an object
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove '#' if it exists
  hex = hex.replace(/^#/, '');
  
  // Parse the hex color
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return { r, g, b };
}

/**
 * Calculates the relative luminance of a color
 * @param rgb RGB values of the color
 * @returns The relative luminance value
 */
function calculateLuminance(rgb: { r: number; g: number; b: number }): number {
  // Normalize RGB values
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  // Calculate sRGB
  const rsrgb = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsrgb = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsrgb = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  // L = 0.2126 * R + 0.7152 * G + 0.0722 * B
  return 0.2126 * rsrgb + 0.7152 * gsrgb + 0.0722 * bsrgb;
}

/**
 * Calculates the contrast ratio between two colors
 * @param luminance1 The luminance of the first color
 * @param luminance2 The luminance of the second color
 * @returns The contrast ratio
 */
function calculateContrastRatio(luminance1: number, luminance2: number): number {
  const lighterLum = Math.max(luminance1, luminance2);
  const darkerLum = Math.min(luminance1, luminance2);
  
  // Calculate contrast ratio: (L1 + 0.05) / (L2 + 0.05)
  return (lighterLum + 0.05) / (darkerLum + 0.05);
}

/**
 * Checks if two colors have sufficient contrast according to WCAG standards
 * @param color1 The first color (hex format)
 * @param color2 The second color (hex format)
 * @returns "yes" if contrast is sufficient (>= 4.5:1), "no" otherwise
 */
export function hasEnoughContrast(color1: string, color2: string): boolean {
  // Convert hex to RGB
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  // Calculate luminance
  const luminance1 = calculateLuminance(rgb1);
  const luminance2 = calculateLuminance(rgb2);
  
  // Calculate contrast ratio
  const contrastRatio = calculateContrastRatio(luminance1, luminance2);
  
  // WCAG 2.1 AA standard requires a contrast ratio of at least 4.5:1 for normal text
  return contrastRatio >= 4.5 ? true : false;
}

export function lightDarkContrast(BGcolor: string, dark: string, light: string): string {
  // Check contrast with light text
  const lightContrast = hasEnoughContrast(BGcolor, light);
  // Check contrast with dark text
  const darkContrast = hasEnoughContrast(BGcolor, dark);

  // Return the color with sufficient contrast
    if (lightContrast && darkContrast) {
        return lightContrast ? light : dark;
    } else if (lightContrast) {
        return light;
    } else if (darkContrast) {
        return dark;
    } else {
        return light; // Default to light if neither has sufficient contrast
    }
}