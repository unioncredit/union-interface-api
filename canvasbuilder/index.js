import path from "path";
import stream from "stream";
import { createCanvas, Image, registerFont } from "canvas";

export class CanvasBuilder {
  constructor(width, height) {
    registerFont(path.resolve(__dirname, "../public/arial.ttf"), {
      family: "arial",
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

  drawCenterImage(w, h, src, scale = 1) {
    this.drawImage(
      (this.width - w * scale) / 2,
      (this.height - h * scale) / 2,
      w,
      h,
      src,
      scale,
    );
  }

  drawImage(x, y, w, h, src, scale = 1) {
    const img = new Image();
    img.onload = (function (context) {
      return function() {
        context.drawImage(img, x, y, w * scale, h * scale);
      }
    })(this.context);
    img.src = src;
  }
}