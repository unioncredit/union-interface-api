import path from "path";
import stream from "stream";
import { createCanvas, Image, registerFont } from "canvas";
import { centerX } from "../utils/canvas";

export class CanvasBuilder {
  constructor(width, height) {
    registerFont(path.resolve(__dirname, "../public/Inter-Regular.ttf"), {
      family: "Inter400",
    });
    registerFont(path.resolve(__dirname, "../public/Inter-Medium.ttf"), {
      family: "Inter500",
    });

    this.width = width;
    this.height = height;
    this.canvas = createCanvas(width, height);
    this.context = this.canvas.getContext("2d");
  }

  pipeToResponse(res) {
    const buffer = this.canvas.toBuffer("image/png");
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    res.setHeader("Content-Type", "image/png");
    bufferStream.pipe(res);
  }

  setBackground(color) {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.width, this.height);
  }

  drawImage(image, x, y, w, h) {
    this.context.drawImage(image, x, y, w, h);
  }

  drawClipCircle(x, y, size) {
    const radius = size / 2;

    this.context.beginPath();
    this.context.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
    this.context.clip();
    this.context.closePath();
  }

  save() {
    this.context.save()
  }

  restore() {
    this.context.restore();
  }

  drawCircle(x, y, size, fill = null, stroke = null, strokeWidth = 1) {
    const radius = size / 2;

    this.context.beginPath();
    this.context.arc(x + radius, y + radius, radius, 0, Math.PI * 2);

    if (fill) {
      this.context.fillStyle = fill
      this.context.fill()
    }
    if (stroke) {
      this.context.lineWidth = strokeWidth
      this.context.strokeStyle = stroke
      this.context.stroke()
    }

    if (clip) {
      this.context.clip();
    }

    this.context.closePath();
  }

  drawText(text, x, y, color, size, weight = 400) {
    this.context.fillStyle = color;
    this.context.font = `${size}px "Inter${weight}", normal`;
    this.context.textBaseline = "top";
    this.context.fillText(text, x, y);
  }

  drawCenterText(text, y, color, size, weight = 400) {
    this.context.fillStyle = color;
    this.context.font = `${size}px "Inter${weight}", normal`;
    this.context.textBaseline = "top";
    const textWidth = this.context.measureText(text).width;
    const x = (this.width - textWidth) / 2;

    this.context.fillText(text, x, y);
  }

  drawRoundRect(x, y, width, height, radius, color) {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.moveTo(x + radius.tl, y);
    this.context.lineTo(x + width - radius.tr, y);
    this.context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    this.context.lineTo(x + width, y + height - radius.br);
    this.context.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius.br,
      y + height
    );
    this.context.lineTo(x + radius.bl, y + height);
    this.context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    this.context.lineTo(x, y + radius.tl);
    this.context.quadraticCurveTo(x, y, x + radius.tl, y);
    this.context.closePath();
    this.context.fill();
  }

  drawRoundRectText(y, text, textColor, textSize, backgroundColor, borderRadius = 12, padding = 12) {
    this.context.font = `${textSize}px "Inter500", normal`;
    const textMeasure = this.context.measureText(text);
    const textWidth = textMeasure.width;

    const totalWidth = textWidth + padding * 4;
    const totalHeight = textSize + padding * 2;

    const posX = centerX(totalWidth);

    this.drawRoundRect(posX, y, totalWidth, totalHeight, borderRadius, backgroundColor);
    this.drawText(text, posX + (padding * 2), y + padding - (textSize * 0.1), textColor, textSize, 500);
  }
}