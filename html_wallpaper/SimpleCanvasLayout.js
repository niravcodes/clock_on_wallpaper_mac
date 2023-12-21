// Bounding Box: Encodes position and size of a 2D box
class BBox {
  x;
  y;
  height;
  width;

  constructor({ x = 0, y = 0, height = 0, width = 0 }) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }

  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.setLineDash([5]);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}

const DEBUG = false;

class SimpleCanvasLayout {
  canvas;
  ctx;
  width;
  height;

  constructor(root, { width = 800, height = 500, background = "white" }) {
    function setUpHiResCanvas(canvas) {
      // Get the device pixel ratio, falling back to 1.
      const dpr = window.devicePixelRatio || 1;
      // Get the size of the canvas in CSS pixels.
      const rect = canvas.getBoundingClientRect();
      // Scale the resolution of the drawing surface
      // (without affecting the physical size of the canvas window).
      canvas.width = rect.width * dpr * 2;
      canvas.height = rect.height * dpr * 2;
      const ctx = canvas.getContext("2d");
      // Scale all drawing operations,
      // to account for the resolution scaling.
      ctx.scale(dpr * 2, dpr * 2);
      return ctx;
    }

    const canvas = document.createElement("canvas");
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    root.appendChild(canvas);
    setUpHiResCanvas(canvas);

    // canvas.width = this.width = width;
    // canvas.height = this.height = height;
    this.width = width;
    this.height = height;

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.fillStyle = background;
    this.ctx.fillRect(0, 0, width, height);
  }

  renderLayout(layout) {
    const instruction = layout.getDrawingProcedure(this.ctx);

    if (layout.isCenteredInContainer)
      this.ctx.translate(this.width / 2 - instruction.dim.width / 2, 0);

    instruction.drawFunction(this.ctx);
  }
}

// Abstract class to inherit from
class Drawable {
  getDrawingProcedure(ctx) {
    console.error("This method needs to be implemented by you");
    // use ctx to draw. dim is the Dimension
    return { dim: new BBox(), drawFunction: (ctx) => {} };
  }
}

class Text extends Drawable {
  constructor(text = "hello", font = "serif", color = "red", fontSize = 20) {
    super();
    this.text = text;
    this.font = font;
    this.color = color;
    this.fontSize = fontSize;
  }

  getDrawingProcedure(ctx) {
    ctx.save();
    ctx.font = `${this.fontSize}px ${this.font}`;
    ctx.fillStyle = this.color;
    const textMetrics = ctx.measureText(this.text);
    ctx.restore();

    const dim = new BBox({
      width: textMetrics.width,
      height:
        textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent,
    });

    return {
      dim,
      drawFunction: (ctx) => {
        if (DEBUG) dim.draw(ctx);
        ctx.font = `${this.fontSize}px ${this.font}`;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, 0, textMetrics.fontBoundingBoxAscent);
      },
    };
  }
}

class VStack extends Drawable {
  elements = [];
  constructor(...elements) {
    super();
    this.elements = elements;
  }

  rightAligned() {
    this.isRightAligned = true;
    return this;
  }
  centerInContainer() {
    this.isCenteredInContainer = true;
    return this;
  }

  getDrawingProcedure(ctx) {
    const drawingInstructions = this.elements.map((el) =>
      el.getDrawingProcedure(ctx)
    );

    // get the greatest width, that's our width
    const {
      dim: { width },
    } = drawingInstructions.reduce((prev, curr) =>
      prev.dim.width > curr.dim.width ? prev : curr
    );

    const height = drawingInstructions.reduce(
      (acc, el) => acc + el.dim.height,
      0
    );
    return {
      dim: new BBox({ width, height }),
      drawFunction: (ctx) => {
        if (DEBUG) new BBox({ width, height }).draw(ctx);
        ctx.save();
        if (this.isRightAligned) ctx.translate(width, 0);
        for (let instruction of drawingInstructions) {
          if (this.isRightAligned) ctx.translate(-instruction.dim.width, 0);
          instruction.drawFunction(ctx);
          if (this.isRightAligned) ctx.translate(instruction.dim.width, 0);
          ctx.translate(0, instruction.dim.height);
        }
        ctx.restore();
      },
    };
  }
}

class HStack extends Drawable {
  elements = [];
  constructor(...elements) {
    super();
    this.elements = elements;
  }

  getDrawingProcedure(ctx) {
    const drawingInstructions = this.elements.map((el) =>
      el.getDrawingProcedure(ctx)
    );
    const width = drawingInstructions.reduce(
      (acc, el) => acc + el.dim.width,
      0
    );

    // get the greatest height, that's our height
    const {
      dim: { height },
    } = drawingInstructions.reduce((prev, curr) =>
      prev.dim.height > curr.dim.height ? prev : curr
    );

    return {
      dim: new BBox({ width, height }),
      drawFunction: (ctx) => {
        if (DEBUG) new BBox({ width, height }).draw(ctx);
        ctx.save();
        for (let instruction of drawingInstructions) {
          instruction.drawFunction(ctx);
          ctx.translate(instruction.dim.width, 0);
        }
        ctx.restore();
      },
    };
  }
}

class Spacer extends Drawable {
  constructor(height, width) {
    super();
    this.height = height;
    this.width = width;
  }

  getDrawingProcedure() {
    const dim = new BBox({ width: this.width, height: this.height });
    return {
      dim,
      drawFunction: (ctx) => {
        if (DEBUG) dim.draw(ctx);
      },
    };
  }
}

class CustomItem extends Drawable {
  constructor(dim, drawFunction) {
    super();
    this.dim = dim;
    this.drawFunction = drawFunction;
  }
  getDrawingProcedure() {
    return {
      dim: this.dim,
      drawFunction: this.drawFunction,
    };
  }
}

const vstack = (...args) => new VStack(...args);
const hstack = (...args) => new HStack(...args);
const text = (...args) => new Text(...args);
const customItem = (...args) => new CustomItem(...args);
const spacer = (...args) => new Spacer(...args);
