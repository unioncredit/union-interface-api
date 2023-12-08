import { CanvasBuilder } from "../canvasbuilder";
import { Colors, Images, PREVIEW_HEIGHT, PREVIEW_WIDTH } from "../constants";

export function drawDefaultPreview(res) {
  const canvas = new CanvasBuilder(PREVIEW_WIDTH, PREVIEW_HEIGHT);
  canvas.setBackground(Colors.Background);
  canvas.drawCenterImage(77, 32, Images.Union, 5);

  canvas.pipeToResponse(res);
}