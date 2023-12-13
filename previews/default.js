import { CanvasBuilder } from "../canvasbuilder";
import { Colors, Images, PREVIEW_HEIGHT, PREVIEW_WIDTH } from "../constants";
import { loadImage } from "canvas";
import { centerX, centerY } from "../utils/canvas";

const LOGO_WIDTH = 385;
const LOGO_HEIGHT = 160;

export async function drawDefaultPreview(res) {
  const canvas = new CanvasBuilder(PREVIEW_WIDTH, PREVIEW_HEIGHT);
  canvas.setBackground(Colors.Background);

  const unionLogo = await loadImage(Images.Union)
  canvas.drawImage(unionLogo, centerX(LOGO_WIDTH), centerY(LOGO_HEIGHT), LOGO_WIDTH, LOGO_HEIGHT);
  canvas.pipeToResponse(res);
}