import { PREVIEW_HEIGHT, PREVIEW_WIDTH } from "../constants";

export function centerX(width) {
  return (PREVIEW_WIDTH - width) / 2;
}

export function centerY(height) {
  return (PREVIEW_HEIGHT - height) / 2;
}