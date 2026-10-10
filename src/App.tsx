import { useEffect, useMemo, useRef, useState } from "react";

type FontFamily = "Inter" | "Arial" | "Georgia";

type TextLayer = {
  id: number;
  kind?: "text" | "rectangle";
  name: string;
  text: string;
  x: number;
  y: number;
  size: number;
  weight: number;
  fontFamily: FontFamily;
  color: string;
  align: "left" | "center" | "right";
  width: number;
  letterSpacing: number;
  backgroundColor: string;
  backgroundOpacity: number;
  backgroundMode: "full" | "fit";
  height?: number;
  radius?: number;
  fill?: string;
  fillOpacity?: number;
};

type ExportFormat = "pdf" | "jpeg" | "svg";
type ExportKind = "design" | "bleed";
type DesignType = "sd" | "micro" | "ram";

type EditorSnapshot = {
  designType: DesignType;
  layersByType: Record<DesignType, TextLayer[]>;
  selectedByType: Record<DesignType, number>;
  colorsByType: Record<DesignType, string>;
  designName: string;
};

type SavedProject = {
  version: number;
  designType: DesignType;
  layersByType: Record<DesignType, TextLayer[]>;
  selectedByType: Record<DesignType, number>;
  colorsByType: Record<DesignType, string>;
  designName: string;
};
type IconName =
  | "arrow"
  | "chevron"
  | "copy"
  | "download"
  | "layers"
  | "minus"
  | "plus"
  | "redo"
  | "rectangle"
  | "text"
  | "trash"
  | "undo";

const initialLayers: TextLayer[] = [
  {
    id: 1,
    name: "Brand",
    text: "NOVA",
    x: 17,
    y: 18,
    size: 32,
    weight: 800,
    fontFamily: "Inter",
    color: "#ffffff",
    align: "left",
    width: 66,
    letterSpacing: 2.5,
    backgroundColor: "#000000",
    backgroundOpacity: 0,
    backgroundMode: "fit",
  },
  {
    id: 2,
    name: "Capacity",
    text: "256",
    x: 17,
    y: 43,
    size: 54,
    weight: 760,
    fontFamily: "Inter",
    color: "#ffffff",
    align: "left",
    width: 66,
    letterSpacing: -2,
    backgroundColor: "#000000",
    backgroundOpacity: 0,
    backgroundMode: "fit",
  },
  {
    id: 3,
    name: "Unit",
    text: "GB",
    x: 20,
    y: 67,
    size: 17,
    weight: 700,
    fontFamily: "Inter",
    color: "#ffffff",
    align: "left",
    width: 30,
    letterSpacing: 1,
    backgroundColor: "#000000",
    backgroundOpacity: 0,
    backgroundMode: "fit",
  },
  {
    id: 4,
    name: "Performance",
    text: "V30  |  A2  |  U3",
    x: 18,
    y: 83,
    size: 8,
    weight: 650,
    fontFamily: "Inter",
    color: "#dce3e2",
    align: "left",
    width: 62,
    letterSpacing: 0.6,
    backgroundColor: "#000000",
    backgroundOpacity: 0,
    backgroundMode: "fit",
  },
  {
    id: 5,
    name: "Series",
    text: "PRO SERIES",
    x: 66,
    y: 91,
    size: 7,
    weight: 500,
    fontFamily: "Inter",
    color: "#ffffff",
    align: "right",
    width: 28,
    letterSpacing: 1.2,
    backgroundColor: "#000000",
    backgroundOpacity: 0,
    backgroundMode: "fit",
  },
];

const initialRamLayers: TextLayer[] = [
  {
    id: 1,
    name: "Brand",
    text: "NOVA",
    x: 5,
    y: 17,
    size: 17,
    weight: 800,
    fontFamily: "Inter",
    color: "#ffffff",
    align: "left",
    width: 28,
    letterSpacing: 2.5,
    backgroundColor: "#000000",
    backgroundOpacity: 0,
    backgroundMode: "fit",
  },
  {
    id: 2,
    name: "Series",
    text: "VECTOR PRO",
    x: 5,
    y: 42,
    size: 9,
    weight: 700,
    fontFamily: "Inter",
    color: "#dce3e2",
    align: "left",
    width: 30,
    letterSpacing: 1.2,
    backgroundColor: "#000000",
    backgroundOpacity: 0,
    backgroundMode: "fit",
  },
  {
    id: 3,
    name: "Capacity",
    text: "32GB",
    x: 72,
    y: 20,
    size: 19,
    weight: 800,
    fontFamily: "Inter",
    color: "#ffffff",
    align: "right",
    width: 22,
    letterSpacing: -0.5,
    backgroundColor: "#000000",
    backgroundOpacity: 0,
    backgroundMode: "fit",
  },
  {
    id: 4,
    name: "Speed",
    text: "6000 MT/s  •  CL36",
    x: 62,
    y: 53,
    size: 8,
    weight: 650,
    fontFamily: "Inter",
    color: "#dce3e2",
    align: "right",
    width: 32,
    letterSpacing: 0.4,
    backgroundColor: "#000000",
    backgroundOpacity: 0,
    backgroundMode: "fit",
  },
  {
    id: 5,
    name: "Generation",
    text: "DDR5",
    x: 70,
    y: 74,
    size: 7,
    weight: 750,
    fontFamily: "Inter",
    color: "#ffffff",
    align: "right",
    width: 26,
    letterSpacing: 1.1,
    backgroundColor: "#000000",
    backgroundOpacity: 0,
    backgroundMode: "fit",
  },
];

const initialMicroLayers: TextLayer[] = [
  {
    id: 1,
    name: "Brand",
    text: "NOVA",
    x: 7,
    y: 18,
    size: 22,
    weight: 800,
    fontFamily: "Inter",
    color: "#ffffff",
    align: "left",
    width: 48,
    letterSpacing: 1.8,
    backgroundColor: "#000000",
    backgroundOpacity: 0,
    backgroundMode: "fit",
  },
  {
    id: 2,
    name: "Capacity",
    text: "256 GB",
    x: 7,
    y: 43,
    size: 24,
    weight: 750,
    fontFamily: "Inter",
    color: "#ffffff",
    align: "left",
    width: 62,
    letterSpacing: -0.8,
    backgroundColor: "#000000",
    backgroundOpacity: 0,
    backgroundMode: "fit",
  },
  {
    id: 3,
    name: "Performance",
    text: "A2  |  U3  |  V30",
    x: 7,
    y: 72,
    size: 8,
    weight: 650,
    fontFamily: "Inter",
    color: "#dce3e2",
    align: "left",
    width: 58,
    letterSpacing: 0.4,
    backgroundColor: "#000000",
    backgroundOpacity: 0,
    backgroundMode: "fit",
  },
  {
    id: 4,
    name: "Series",
    text: "MICRO SD",
    x: 68,
    y: 78,
    size: 7,
    weight: 600,
    fontFamily: "Inter",
    color: "#ffffff",
    align: "right",
    width: 25,
    letterSpacing: 0.8,
    backgroundColor: "#000000",
    backgroundOpacity: 0,
    backgroundMode: "fit",
  },
];

const cardColors = [
  { label: "Forest", value: "#163a35" },
  { label: "Graphite", value: "#24282a" },
  { label: "Clay", value: "#9b493c" },
  { label: "Cobalt", value: "#244b9b" },
  { label: "Plum", value: "#5c365f" },
];

const ramColors = [
  { label: "Midnight", value: "#182725" },
  { label: "Graphite", value: "#292d2d" },
  { label: "Crimson", value: "#713b36" },
  { label: "Navy", value: "#263f68" },
  { label: "Silver", value: "#626a68" },
];

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function hexToRgba(hex: string | undefined, opacity: number | undefined) {
  const value = (hex ?? "#000000").replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${(opacity ?? 0) / 100})`;
}

function snapUp(value: number) {
  return Math.ceil((value + Number.EPSILON) * 10) / 10;
}

function wrapTextLines(text: string, maximumWidth: number, size: number, letterSpacing: number) {
  const charactersPerLine = Math.max(
    1,
    Math.floor(maximumWidth / Math.max(1, size * 0.58 + letterSpacing)),
  );
  return text.split("\n").flatMap((line) => {
    if (!line) return [" "];
    const words = line.split(/(\s+)/);
    const wrapped: string[] = [];
    let current = "";
    words.forEach((word) => {
      if (current && (current + word).length > charactersPerLine) {
        wrapped.push(current.trimEnd());
        current = "";
      }
      if (word.length > charactersPerLine) {
        while (word.length > charactersPerLine) {
          wrapped.push((current + word.slice(0, charactersPerLine)).trimEnd());
          current = "";
          word = word.slice(charactersPerLine);
        }
      }
      current += word;
    });
    if (current || !wrapped.length) wrapped.push(current.trimEnd() || " ");
    return wrapped;
  });
}

const microSdOutlinePath =
  "M68.91 0h300.55C382.41 0 393 10.61 393 23.54v465.03c0 12.93-10.61 23.54-23.54 23.54H45.37C8.5 511.57.01 502.21.01 469.4V348.76l21.06-25.28v-45.29H0v-65.3l45.37-43.18V23.54C45.37 10.59 55.97 0 68.91 0z";

const microSdLandscapeTransform =
  "translate(0 1100) scale(1 -1) translate(1500 0) rotate(90) scale(2.7989822 2.9296875)";

function createDesignSvg(
  layers: TextLayer[],
  cardColor: string,
  designType: DesignType,
) {
  const width = designType === "ram" ? 2400 : designType === "micro" ? 1500 : 1100;
  const height = designType === "ram" ? 562 : designType === "micro" ? 1100 : 1500;
  const scale = width / (designType === "ram" ? 500 : designType === "micro" ? 260 : 308);
  const ridges = Array.from(
    { length: 8 },
    (_, index) =>
      `<rect x="${120 + index * 64}" y="0" width="43" height="68" rx="10" fill="#ffffff" opacity=".12"/>`,
  ).join("");

  const text = layers
    .map((layer) => {
      if (layer.kind === "rectangle") {
        return `<rect x="${(layer.x / 100) * width}" y="${(layer.y / 100) * height}" width="${(layer.width / 100) * width}" height="${((layer.height ?? 30) / 100) * height}" rx="${((layer.radius ?? 0) / 100) * width}" fill="${escapeXml(layer.fill ?? "#ffffff")}" fill-opacity="${(layer.fillOpacity ?? 100) / 100}"/>`;
      }
      const maximumWidth = (layer.width / 100) * width;
      const lines = wrapTextLines(layer.text, maximumWidth, layer.size, layer.letterSpacing);
      const padding = 3 * scale;
      const maxCharacters = Math.max(1, ...lines.map((line) => line.length));
      const estimatedTextWidth =
        (maxCharacters * layer.size * 0.58 +
          Math.max(0, maxCharacters - 1) * layer.letterSpacing) *
          scale +
        padding * 2;
      const boxWidth =
        layer.backgroundMode === "full"
          ? maximumWidth
          : Math.min(maximumWidth, estimatedTextWidth);
      const boxX = (layer.x / 100) * width;
      const boxY = (layer.y / 100) * height;
      const anchor =
        layer.align === "center"
          ? "middle"
          : layer.align === "right"
            ? "end"
            : "start";
      const x =
        layer.align === "center"
          ? boxX + boxWidth / 2
          : layer.align === "right"
            ? boxX + boxWidth - padding
            : boxX + padding;
      const y = boxY + padding;
      const lineHeight = layer.size * scale * 1.05;
      const boxHeight = lines.length * lineHeight + padding * 2;
      const tspans = lines
        .map(
          (line, index) =>
            `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line || " ")}</tspan>`,
        )
        .join("");

      return `<g>
        <rect x="${boxX}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" rx="${2 * scale}" fill="${escapeXml(layer.backgroundColor ?? "#000000")}" fill-opacity="${(layer.backgroundOpacity ?? 0) / 100}"/>
        <text x="${x}" y="${y}" fill="${escapeXml(layer.color)}" font-family="${escapeXml(layer.fontFamily)}" font-size="${layer.size * scale}" font-weight="${layer.weight}" letter-spacing="${layer.letterSpacing * scale}" text-anchor="${anchor}" dominant-baseline="hanging">${tspans}</text>
      </g>`;
    })
    .join("");

  if (designType === "ram") {
    const chips = Array.from(
      { length: 8 },
      (_, index) =>
        `<rect x="${210 + index * 260}" y="102" width="186" height="250" rx="18" fill="#08100f" opacity=".52"/>
         <rect x="${225 + index * 260}" y="118" width="156" height="220" rx="10" fill="none" stroke="#ffffff" stroke-opacity=".055" stroke-width="5"/>`,
    ).join("");
    const contacts = Array.from(
      { length: 42 },
      (_, index) => {
        const padWidth = 43;
        const x = 34 + index * ((2366 - padWidth - 34) / 41);
        return `<path d="M${x} 466h${padWidth}v96h-${padWidth}z" fill="#c7a354"/>
          <path d="M${x + 5} 466h33v79h-33z" fill="#e5c875" opacity=".72"/>`;
      },
    ).join("");
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="133.35mm" height="31.25mm" viewBox="0 0 ${width} ${height}" role="img" aria-label="Custom RAM design">
  <defs>
    <clipPath id="ram-shape">
      <path d="M26 0H2374Q2400 0 2400 26V562H1320L1288 500H1210L1178 562H0V26Q0 0 26 0Z"/>
    </clipPath>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" seed="7"/>
      <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .1 0"/>
    </filter>
  </defs>
  <g clip-path="url(#ram-shape)">
    <rect width="${width}" height="${height}" fill="${escapeXml(cardColor)}"/>
    <rect width="${width}" height="${height}" filter="url(#grain)" opacity=".24"/>
    ${chips}
    <path d="M55 52H2345V430H55Z" fill="none" stroke="#ffffff" stroke-opacity=".1" stroke-width="5"/>
    <path d="M55 385H2345" stroke="#ffffff" stroke-opacity=".08" stroke-width="4"/>
    ${contacts}
    ${text}
  </g>
</svg>`;
  }

  if (designType === "micro") {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="15mm" height="11mm" viewBox="0 0 ${width} ${height}" role="img" aria-label="Custom microSD card design">
  <defs>
    <clipPath id="micro-card-shape">
      <path transform="${microSdLandscapeTransform}" d="${microSdOutlinePath}"/>
    </clipPath>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" seed="7"/>
      <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 .1 0"/>
    </filter>
  </defs>
  <g clip-path="url(#micro-card-shape)">
    <rect width="${width}" height="${height}" fill="${escapeXml(cardColor)}"/>
    <rect width="${width}" height="${height}" filter="url(#grain)" opacity=".28"/>
    <path transform="${microSdLandscapeTransform}" d="${microSdOutlinePath}" fill="none" stroke="#ffffff" stroke-opacity=".08" stroke-width="4" vector-effect="non-scaling-stroke"/>
    ${text}
  </g>
</svg>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="24mm" height="32mm" viewBox="0 0 ${width} ${height}" role="img" aria-label="Custom standard SD card design">
  <defs>
    <clipPath id="card-shape">
      <path d="M0 0H803L1100 300V1500H0Z"/>
    </clipPath>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" seed="7"/>
      <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .1 0"/>
    </filter>
  </defs>
  <g clip-path="url(#card-shape)">
    <rect width="${width}" height="${height}" fill="${escapeXml(cardColor)}"/>
    <rect width="${width}" height="${height}" filter="url(#grain)" opacity=".28"/>
    ${ridges}
    <path d="M28 28H790L1072 312V1472H28Z" fill="none" stroke="#ffffff" stroke-opacity=".08" stroke-width="4"/>
    ${text}
  </g>
</svg>`;
}

function getExportSize(designType: DesignType) {
  return designType === "ram"
    ? { width: 2400, height: 562, widthMm: 133.35, heightMm: 31.25 }
    : designType === "micro"
      ? { width: 1500, height: 1100, widthMm: 15, heightMm: 11 }
      : { width: 1100, height: 1500, widthMm: 24, heightMm: 32 };
}

function createBleedArtworkSvg(designSvg: string, designType: DesignType) {
  const size = getExportSize(designType);
  const bleedMm = 1.5;
  const bleed = (size.width / size.widthMm) * bleedMm;
  const width = size.width + bleed * 2;
  const height = size.height + bleed * 2;
  const nestedDesign = designSvg
    .replace(/^<\?xml[^>]*>\s*/, "")
    .replace(
      /<svg\b[^>]*>/,
      `<svg x="${bleed}" y="${bleed}" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}">`,
    );

  return {
    svg: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size.widthMm + bleedMm * 2}mm" height="${size.heightMm + bleedMm * 2}mm" viewBox="0 0 ${width} ${height}" role="img" aria-label="Bleed-sized card design">
  ${nestedDesign}
</svg>`,
    width: Math.round(width),
    height: Math.round(height),
    widthMm: size.widthMm + bleedMm * 2,
    heightMm: size.heightMm + bleedMm * 2,
  };
}

function createBleedGuidesSvg(designType: DesignType) {
  const size = getExportSize(designType);
  const bleedMm = 1.5;
  const bleed = (size.width / size.widthMm) * bleedMm;
  const width = size.width + bleed * 2;
  const height = size.height + bleed * 2;
  const mark = Math.max(20, bleed * 0.55);
  const gap = Math.max(8, bleed * 0.12);
  return {
    svg: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size.widthMm + bleedMm * 2}mm" height="${size.heightMm + bleedMm * 2}mm" viewBox="0 0 ${width} ${height}" role="img" aria-label="Design with 1.5 mm bleed and trim marks">
  <rect width="${width}" height="${height}" fill="#ffffff"/>
  <rect x="${bleed}" y="${bleed}" width="${size.width}" height="${size.height}" fill="none" stroke="#ef4770" stroke-width="${Math.max(2, bleed * 0.025)}"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="#3d7ec9" stroke-width="${Math.max(2, bleed * 0.025)}" stroke-dasharray="${Math.max(8, bleed * 0.12)} ${Math.max(6, bleed * 0.08)}"/>
  <g fill="none" stroke="#202422" stroke-width="${Math.max(2, bleed * 0.02)}">
    <path d="M${bleed - gap - mark} ${bleed}H${bleed - gap}M${bleed} ${bleed - gap - mark}V${bleed - gap}"/>
    <path d="M${width - bleed + gap} ${bleed}H${width - bleed + gap + mark}M${width - bleed} ${bleed - gap - mark}V${bleed - gap}"/>
    <path d="M${bleed - gap - mark} ${height - bleed}H${bleed - gap}M${bleed} ${height - bleed + gap}V${height - bleed + gap + mark}"/>
    <path d="M${width - bleed + gap} ${height - bleed}H${width - bleed + gap + mark}M${width - bleed} ${height - bleed + gap}V${height - bleed + gap + mark}"/>
  </g>
</svg>`,
    width: Math.round(width),
    height: Math.round(height),
    widthMm: size.widthMm + bleedMm * 2,
    heightMm: size.heightMm + bleedMm * 2,
  };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const download = document.createElement("a");
  download.href = url;
  download.download = filename;
  document.body.appendChild(download);
  download.click();
  download.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function svgToJpeg(svg: string, width: number, height: number) {
  return new Promise<Blob>((resolve, reject) => {
    const source = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(source);
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas export is not supported in this browser."));
        return;
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) =>
          blob
            ? resolve(blob)
            : reject(new Error("The JPEG could not be generated.")),
        "image/jpeg",
        0.95,
      );
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The card artwork could not be rendered."));
    };
    image.src = url;
  });
}

function joinBytes(parts: Uint8Array[]) {
  const length = parts.reduce((total, part) => total + part.length, 0);
  const result = new Uint8Array(length);
  let offset = 0;
  parts.forEach((part) => {
    result.set(part, offset);
    offset += part.length;
  });
  return result;
}

async function jpegToPdf(
  jpeg: Blob,
  imageWidth: number,
  imageHeight: number,
  widthMm: number,
  heightMm: number,
) {
  const encoder = new TextEncoder();
  const image = new Uint8Array(await jpeg.arrayBuffer());
  const pageWidth = (widthMm * 72) / 25.4;
  const pageHeight = (heightMm * 72) / 25.4;
  const content = `q ${pageWidth} 0 0 ${pageHeight} 0 0 cm /Im0 Do Q`;
  const objects = [
    encoder.encode("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"),
    encoder.encode("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"),
    encoder.encode(
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
    ),
    joinBytes([
      encoder.encode(
        `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`,
      ),
      image,
      encoder.encode("\nendstream\nendobj\n"),
    ]),
    encoder.encode(
      `5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`,
    ),
  ];
  const header = encoder.encode("%PDF-1.4\n");
  const offsets: number[] = [];
  let position = header.length;
  objects.forEach((object) => {
    offsets.push(position);
    position += object.length;
  });
  const xrefPosition = position;
  const xref = encoder.encode(
    `xref\n0 6\n0000000000 65535 f \n${offsets
      .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
      .join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPosition}\n%%EOF`,
  );

  return new Blob([joinBytes([header, ...objects, xref])], {
    type: "application/pdf",
  });
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    copy: <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 16 9 5 9-5" /></>,
    minus: <path d="M5 12h14" />,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    redo: <><path d="m15 7 4 4-4 4" /><path d="M19 11h-8a6 6 0 0 0-6 6" /></>,
    rectangle: <><rect x="4" y="5" width="16" height="14" rx="2" /></>,
    text: <><path d="M5 5h14" /><path d="M12 5v14" /><path d="M8 19h8" /></>,
    trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="m7 7 1 13h8l1-13" /></>,
    undo: <><path d="m9 7-4 4 4 4" /><path d="M5 11h8a6 6 0 0 1 6 6" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function NumberControl({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="number-control">
      <span>{label}</span>
      <span className="number-field">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(event) =>
            onChange(snapUp(Math.min(max, Math.max(min, Number(event.target.value)))))
          }
        />
        {unit && <small>{unit}</small>}
      </span>
    </label>
  );
}

export default function App() {
  const [designType, setDesignType] = useState<DesignType>("sd");
  const [layersByType, setLayersByType] = useState<Record<DesignType, TextLayer[]>>({
    sd: initialLayers,
    micro: initialMicroLayers,
    ram: initialRamLayers,
  });
  const [selectedByType, setSelectedByType] = useState<Record<DesignType, number>>({
    sd: 2,
    micro: 2,
    ram: 2,
  });
  const [colorsByType, setColorsByType] = useState<Record<DesignType, string>>({
    sd: cardColors[0].value,
    micro: cardColors[0].value,
    ram: ramColors[0].value,
  });
  const [designName, setDesignName] = useState("Untitled standard SD");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("svg");
  const [exporting, setExporting] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [saved, setSaved] = useState(true);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const clampZoom = (value: number) => Math.min(300, Math.max(70, value));
  const updateZoom = (nextZoom: number) => setZoom(clampZoom(nextZoom));
  const [draggedLayerId, setDraggedLayerId] = useState<number | null>(null);
  const [newLayerType, setNewLayerType] = useState<"text" | "rectangle">("text");
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const pastHistory = useRef<EditorSnapshot[]>([]);
  const futureHistory = useRef<EditorSnapshot[]>([]);
  const nameHistoryRecorded = useRef(false);
  const projectInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRefs = useRef<Record<DesignType, HTMLDivElement | null>>({
    sd: null,
    micro: null,
    ram: null,
  });
  const canvasDrag = useRef<{
    id: number;
    pointerId: number;
    mode: "move" | "scale";
    handle?: string;
    startX: number;
    startY: number;
    originRect?: DOMRect;
    originLeft: number;
    originTop: number;
    originRight: number;
    originBottom: number;
    originSize: number;
    moved: boolean;
  } | null>(null);
  const layers = layersByType[designType];
  const selectedId = selectedByType[designType];
  const cardColor = colorsByType[designType];
  const availableColors = designType === "ram" ? ramColors : cardColors;

  const getSnapshot = (): EditorSnapshot => ({
    designType,
    layersByType,
    selectedByType,
    colorsByType,
    designName,
  });

  const recordHistory = () => {
    pastHistory.current = [...pastHistory.current, getSnapshot()].slice(-50);
    futureHistory.current = [];
  };

  const restoreSnapshot = (snapshot: EditorSnapshot) => {
    setDesignType(snapshot.designType);
    setLayersByType(snapshot.layersByType);
    setSelectedByType(snapshot.selectedByType);
    setColorsByType(snapshot.colorsByType);
    setDesignName(snapshot.designName);
    setSaved(false);
  };

  const undo = () => {
    const previous = pastHistory.current.pop();
    if (!previous) return;
    futureHistory.current = [...futureHistory.current, getSnapshot()];
    restoreSnapshot(previous);
  };

  const redo = () => {
    const next = futureHistory.current.pop();
    if (!next) return;
    pastHistory.current = [...pastHistory.current, getSnapshot()];
    restoreSnapshot(next);
  };

  useEffect(() => {
    const handleHistoryShortcut = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
    };
    window.addEventListener("keydown", handleHistoryShortcut);
    return () => window.removeEventListener("keydown", handleHistoryShortcut);
  });

  const setLayers = (
    value: TextLayer[] | ((current: TextLayer[]) => TextLayer[]),
  ) => {
    setLayersByType((current) => ({
      ...current,
      [designType]:
        typeof value === "function" ? value(current[designType]) : value,
    }));
  };

  const setSelectedId = (id: number) => {
    setSelectedByType((current) => ({ ...current, [designType]: id }));
  };

  const renameDesign = (name: string) => {
    const nextName = name.trim();
    if (!nextName) return;
    setDesignName(nextName);
    setSaved(false);
  };

  const setCardColor = (color: string) => {
    recordHistory();
    setColorsByType((current) => ({ ...current, [designType]: color }));
  };

  const getDefaultLayers = (type: DesignType): TextLayer[] => {
    switch (type) {
      case "micro":
        return initialMicroLayers.map((layer) => ({ ...layer }));
      case "ram":
        return initialRamLayers.map((layer) => ({ ...layer }));
      case "sd":
      default:
        return initialLayers.map((layer) => ({ ...layer }));
    }
  };

  const resetDesignToDefaults = (type: DesignType) => {
    const defaultLayers = getDefaultLayers(type);
    setLayersByType((current) => ({
      ...current,
      [type]: defaultLayers,
    }));
    setSelectedByType((current) => ({
      ...current,
      [type]: defaultLayers[1]?.id ?? defaultLayers[0]?.id ?? 0,
    }));
    setColorsByType((current) => ({
      ...current,
      [type]: type === "ram" ? ramColors[0].value : cardColors[0].value,
    }));
  };

  const switchDesignType = (type: DesignType) => {
    if (type === designType) return;

    // Switching product/template resets to the default element set for that design.
    resetDesignToDefaults(type);

    const defaultNames = ["Untitled standard SD", "Untitled microSD", "Untitled micro SD", "Untitled DDR4 RAM", "Untitled DDR5 RAM"];
    if (defaultNames.includes(designName)) {
      setDesignName(
        type === "sd"
          ? "Untitled standard SD"
          : type === "micro"
            ? "Untitled microSD"
            : "Untitled DDR5 RAM",
      );
    }
    setDesignType(type);
  };

  const selected = useMemo(
    () => layers.find((layer) => layer.id === selectedId) ?? layers[0],
    [layers, selectedId],
  );

  const updateSelected = (changes: Partial<TextLayer>) => {
    recordHistory();
    setLayers((current) =>
      current.map((layer) =>
        layer.id === selectedId ? { ...layer, ...changes } : layer,
      ),
    );
    setSaved(false);
  };

  const addLayer = (kind: "text" | "rectangle") => {
    recordHistory();
    const id = Math.max(0, ...layers.map((layer) => layer.id)) + 1;

    if (kind === "rectangle") {
      setLayers((current) => [
        ...current,
        {
          id,
          kind: "rectangle",
          name: `Rectangle ${id}`,
          text: "",
          x: 20,
          y: 30,
          size: 1,
          weight: 400,
          fontFamily: "Inter",
          color: "#ffffff",
          align: "left",
          width: 40,
          height: 24,
          letterSpacing: 0,
          backgroundColor: "#000000",
          backgroundOpacity: 0,
          backgroundMode: "fit",
          radius: 3,
          fill: "#ffffff",
          fillOpacity: 100,
        },
      ]);
    } else {
      setLayers((current) => [
        ...current,
        {
          id,
          name: `Text ${id}`,
          text: "NEW TEXT",
          x: 20,
          y: 54,
          size: 18,
          weight: 600,
          fontFamily: "Inter",
          color: "#ffffff",
          align: "left",
          width: 60,
          letterSpacing: 0,
          backgroundColor: "#000000",
          backgroundOpacity: 0,
          backgroundMode: "fit",
        },
      ]);
    }

    setSelectedId(id);
    setSaved(false);
  };

  const addText = () => addLayer("text");
  const addRectangle = () => addLayer("rectangle");

  const duplicateText = () => {
    if (!selected) return;
    recordHistory();
    const id = Math.max(...layers.map((layer) => layer.id)) + 1;
    setLayers((current) => [
      ...current,
      { ...selected, id, name: `${selected.name} copy`, x: selected.x + 4, y: selected.y + 4 },
    ]);
    setSelectedId(id);
    setSaved(false);
  };

  const deleteText = () => {
    if (!selected) return;
    recordHistory();
    const remaining = layers.filter((layer) => layer.id !== selectedId);
    setLayers(remaining);
    setSelectedId(remaining[0]?.id ?? 0);
    setSaved(false);
  };

  useEffect(() => {
    const handleDeleteShortcut = (event: KeyboardEvent) => {
      const key = event.key;
      const isDeleteKey = key === "Delete" || key === "Backspace";
      if (!isDeleteKey || !selected || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) {
        return;
      }
      event.preventDefault();
      deleteText();
    };

    window.addEventListener("keydown", handleDeleteShortcut);
    return () => window.removeEventListener("keydown", handleDeleteShortcut);
  }, [selected, selectedId, layers]);

  const reorderLayers = (draggedId: number, targetId: number) => {
    if (draggedId === targetId) return;
    recordHistory();
    const displayedLayers = [...layers].reverse();
    const draggedIndex = displayedLayers.findIndex((layer) => layer.id === draggedId);
    const targetIndex = displayedLayers.findIndex((layer) => layer.id === targetId);
    if (draggedIndex < 0 || targetIndex < 0) return;
    const [draggedLayer] = displayedLayers.splice(draggedIndex, 1);
    displayedLayers.splice(targetIndex, 0, draggedLayer);
    setLayers(displayedLayers.reverse());
    setSaved(false);
  };

  const handleCanvasPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    layer: TextLayer,
  ) => {
    const canvas = canvasRefs.current[designType];
    if (!canvas) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const canvasRect = canvas.getBoundingClientRect();
    const rect = event.currentTarget.getBoundingClientRect();

    recordHistory();
    setSelectedId(layer.id);

    canvasDrag.current = {
      id: layer.id,
      pointerId: event.pointerId,
      mode:
        event.target instanceof HTMLElement && event.target.dataset.handle
          ? "scale"
          : "move",
      handle:
        event.target instanceof HTMLElement ? event.target.dataset.handle : undefined,
      startX: event.clientX,
      startY: event.clientY,
      originRect: rect,
      originLeft: rect.left - canvasRect.left,
      originTop: rect.top - canvasRect.top,
      originRight: rect.right - canvasRect.left,
      originBottom: rect.bottom - canvasRect.top,
      originSize: layer.size,
      moved: false,
    };
  };

  const handleCanvasPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = canvasDrag.current;
    const canvas = canvasRefs.current[designType];
    if (!drag || drag.pointerId !== event.pointerId || !canvas) return;

    const bounds = canvas.getBoundingClientRect();
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
      drag.moved = true;
    }

    if (drag.mode === "scale" && drag.originRect) {
      const nextLeft = drag.handle?.includes("w")
        ? drag.originLeft + deltaX
        : drag.originLeft;
      const nextTop = drag.handle?.includes("n")
        ? drag.originTop + deltaY
        : drag.originTop;
      const nextRight = drag.handle?.includes("e")
        ? drag.originRight + deltaX
        : drag.originRight;
      const nextBottom = drag.handle?.includes("s")
        ? drag.originBottom + deltaY
        : drag.originBottom;

      const widthPx = Math.max(12, nextRight - nextLeft);
      const heightPx = Math.max(10, nextBottom - nextTop);
      const scaleX = widthPx / Math.max(drag.originRect.width, 1);
      const scaleY = heightPx / Math.max(drag.originRect.height, 1);
      const scale = Math.max(0.1, (scaleX + scaleY) / 2);

      const x = snapUp((nextLeft / bounds.width) * 100);
      const y = snapUp((nextTop / bounds.height) * 100);
      const width = snapUp((widthPx / bounds.width) * 100);
      const height = snapUp((heightPx / bounds.height) * 100);

      setLayers((current) =>
        current.map((layer) =>
          layer.id === drag.id
            ? layer.kind === "rectangle"
              ? { ...layer, x, y, width, height }
              : {
                  ...layer,
                  x,
                  y,
                  width,
                  size: snapUp(Math.max(6, drag.originSize * scale)),
                }
            : layer,
        ),
      );
      setSaved(false);
      return;
    }

    const x = snapUp(((drag.originLeft + deltaX) / bounds.width) * 100);
    const y = snapUp(((drag.originTop + deltaY) / bounds.height) * 100);

    setLayers((current) =>
      current.map((layer) => (layer.id === drag.id ? { ...layer, x, y } : layer)),
    );
    setSaved(false);
  };

  const handleCanvasPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (canvasDrag.current?.pointerId === event.pointerId) {
      canvasDrag.current = null;
    }
  };

  const handleStageMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 1) return;
    event.preventDefault();
    setIsPanning(true);
    panStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleStageMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    setPan({
      x: panStartRef.current.panX + (event.clientX - panStartRef.current.x),
      y: panStartRef.current.panY + (event.clientY - panStartRef.current.y),
    });
  };

  const handleStageMouseUp = () => {
    setIsPanning(false);
  };

  const handleStageClick = () => {
    setSelectedId(0);
  };

  const getProjectFilename = () => {
    const cleanName = designName.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
    return cleanName || (designType === "sd" ? "standard-sd-design" : designType === "micro" ? "micro-sd-design" : "ram-design");
  };

  const saveProject = () => {
    const payload: SavedProject = {
      version: 1,
      designType,
      layersByType,
      selectedByType,
      colorsByType,
      designName,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    downloadBlob(blob, `${getProjectFilename()}.cardform.json`);
    setSaved(true);
  };

  const loadProject = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw) as Partial<SavedProject>;
      const validDesignType = parsed.designType === "sd" || parsed.designType === "micro" || parsed.designType === "ram"
        ? parsed.designType
        : "sd";

      const nextLayersByType: Record<DesignType, TextLayer[]> = {
        sd: Array.isArray(parsed.layersByType?.sd) ? parsed.layersByType.sd : initialLayers,
        micro: Array.isArray(parsed.layersByType?.micro) ? parsed.layersByType.micro : initialMicroLayers,
        ram: Array.isArray(parsed.layersByType?.ram) ? parsed.layersByType.ram : initialRamLayers,
      };

      const nextSelectedByType: Record<DesignType, number> = {
        sd: typeof parsed.selectedByType?.sd === "number" ? parsed.selectedByType.sd : nextLayersByType.sd[0]?.id ?? 0,
        micro: typeof parsed.selectedByType?.micro === "number" ? parsed.selectedByType.micro : nextLayersByType.micro[0]?.id ?? 0,
        ram: typeof parsed.selectedByType?.ram === "number" ? parsed.selectedByType.ram : nextLayersByType.ram[0]?.id ?? 0,
      };

      const nextColorsByType: Record<DesignType, string> = {
        sd: typeof parsed.colorsByType?.sd === "string" ? parsed.colorsByType.sd : cardColors[0].value,
        micro: typeof parsed.colorsByType?.micro === "string" ? parsed.colorsByType.micro : cardColors[0].value,
        ram: typeof parsed.colorsByType?.ram === "string" ? parsed.colorsByType.ram : ramColors[0].value,
      };

      setLayersByType(nextLayersByType);
      setSelectedByType(nextSelectedByType);
      setColorsByType(nextColorsByType);
      setDesignType(validDesignType);
      setDesignName(typeof parsed.designName === "string" ? parsed.designName : "Untitled design");
      setSaved(true);
    } catch (error) {
      console.error("Unable to load project:", error);
      window.alert("The selected file is not a valid Cardform project.");
    } finally {
      if (projectInputRef.current) {
        projectInputRef.current.value = "";
      }
    }
  };

  const exportFiles = async (kind: ExportKind) => {
    setExporting(true);
    const trimSvg = createDesignSvg(layers, cardColor, designType);
    const designExport = createBleedArtworkSvg(trimSvg, designType);
    const bleedExport = createBleedGuidesSvg(designType);
    const exportPayload = kind === "design" ? designExport : bleedExport;
    const filename = getProjectFilename();

    try {
      if (exportFormat === "svg") {
        downloadBlob(
          new Blob([exportPayload.svg], { type: "image/svg+xml;charset=utf-8" }),
          `${filename}-${kind}.svg`,
        );
      } else {
        const jpeg = await svgToJpeg(
          exportPayload.svg,
          exportPayload.width,
          exportPayload.height,
        );
        if (exportFormat === "jpeg") {
          downloadBlob(jpeg, `${filename}-${kind}.jpeg`);
        } else {
          const pdf = await jpegToPdf(
            jpeg,
            exportPayload.width,
            exportPayload.height,
            exportPayload.widthMm,
            exportPayload.heightMm,
          );
          downloadBlob(pdf, `${filename}-${kind}.pdf`);
        }
      }
      setSaved(true);
    } finally {
      setExporting(false);
    }
  };

  const renderRectangleLayer = (layer: TextLayer) => (
    <button
      key={layer.id}
      className={`canvas-shape ${selectedId === layer.id ? "selected" : ""}`}
      onClick={(event) => {
        event.stopPropagation();
        setSelectedId(layer.id);
      }}
      onPointerDown={(event) => handleCanvasPointerDown(event, layer)}
      onPointerMove={handleCanvasPointerMove}
      onPointerUp={handleCanvasPointerUp}
      onPointerCancel={handleCanvasPointerUp}
      style={{
        left: `${layer.x}%`,
        top: `${layer.y}%`,
        width: `${layer.width}%`,
        height: `${layer.height ?? 30}%`,
        borderRadius: `${layer.radius ?? 0}%`,
        backgroundColor: layer.fill ?? "#ffffff",
        opacity: (layer.fillOpacity ?? 100) / 100,
        zIndex: layers.indexOf(layer) + 2,
      }}
    >
      {selectedId === layer.id && (
        <>
          <i className="handle handle-nw" data-handle="nw" />
          <i className="handle handle-ne" data-handle="ne" />
          <i className="handle handle-sw" data-handle="sw" />
          <i className="handle handle-se" data-handle="se" />
        </>
      )}
    </button>
  );

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark"><span /></span>
          <span>Cardform</span>
        </div>
        <div className="document-title">
          <input
            aria-label="Design name"
            value={designName}
            onFocus={() => {
              if (!nameHistoryRecorded.current) {
                recordHistory();
                nameHistoryRecorded.current = true;
              }
            }}
            onChange={(event) => {
              renameDesign(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
            onBlur={(event) => {
              renameDesign(event.currentTarget.value);
              nameHistoryRecorded.current = false;
            }}
          />
          <span aria-live="polite">{saved ? "Saved" : "Unsaved changes"}</span>
        </div>
        <div className="top-actions">
          <div className="project-actions">
            <button className="project-file-button" type="button" onClick={saveProject}>Save</button>
            <button
              className="project-file-button"
              type="button"
              onClick={() => projectInputRef.current?.click()}
            >
              Load
            </button>
            <input
              ref={projectInputRef}
              type="file"
              accept=".cardform.json,application/json"
              onChange={loadProject}
              style={{ display: "none" }}
            />
          </div>
          <button className="icon-button" aria-label="Undo" onClick={undo}><Icon name="undo" /></button>
          <button className="icon-button" aria-label="Redo" onClick={redo}><Icon name="redo" /></button>
          <span className="divider" />
          <div className="export-switch" aria-label="Export format">
            {(["pdf", "jpeg", "svg"] as ExportFormat[]).map((format) => (
              <button
                key={format}
                className={exportFormat === format ? "active" : ""}
                onClick={() => setExportFormat(format)}
                aria-pressed={exportFormat === format}
              >
                {format === "jpeg" ? "JPG" : format.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="save-button split-export-button" onClick={() => exportFiles("design")} disabled={exporting}>
            <Icon name="download" size={17} />
            {exporting ? "Exporting…" : "Design"}
          </button>
          <div className="export-menu">
            <button
              className="export-menu-toggle"
              aria-label="More export options"
              aria-expanded={exportMenuOpen}
              onClick={() => setExportMenuOpen((open) => !open)}
              disabled={exporting}
            >
              <Icon name="chevron" size={15} />
            </button>
            {exportMenuOpen && (
              <div className="export-menu-popover" role="menu">
                <button
                  role="menuitem"
                  onClick={() => {
                    setExportMenuOpen(false);
                    void exportFiles("bleed");
                  }}
                >
                  <Icon name="download" size={15} />
                  Bleed guides
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="workspace">
        <aside className="left-panel">
          <section className="panel-section">
            <div className="section-heading">
              <span>LAYERS</span>
              <span className="layer-add-actions">
                <button
                  className="new-button"
                  onClick={() => {
                    setAddMenuOpen(false);
                    addLayer(newLayerType);
                  }}
                  aria-label="Add selected element"
                >
                  <Icon name="plus" size={15} />
                  <span>New</span>
                </button>
                <div className="layer-menu">
                  <button
                    className="layer-menu-toggle"
                    aria-label="Choose element type"
                    aria-expanded={addMenuOpen}
                    onClick={() => setAddMenuOpen((open) => !open)}
                  >
                    <Icon name="chevron" size={15} />
                  </button>
                  {addMenuOpen && (
                    <div className="layer-menu-popover" role="menu">
                      <button
                        role="menuitem"
                        onClick={() => {
                          setNewLayerType("text");
                          setAddMenuOpen(false);
                        }}
                      >
                        <Icon name="text" size={14} />
                        Text box
                      </button>
                      <button
                        role="menuitem"
                        onClick={() => {
                          setNewLayerType("rectangle");
                          setAddMenuOpen(false);
                        }}
                      >
                        <Icon name="rectangle" size={14} />
                        Rectangle
                      </button>
                    </div>
                  )}
                </div>
              </span>
            </div>
            <div className="layer-list">
              {[...layers].reverse().map((layer) => (
                <button
                  key={layer.id}
                  className={`layer-item ${selectedId === layer.id ? "selected" : ""}`}
                  onClick={() => setSelectedId(layer.id)}
                  draggable
                  onDragStart={() => setDraggedLayerId(layer.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggedLayerId !== null) reorderLayers(draggedLayerId, layer.id);
                    setDraggedLayerId(null);
                  }}
                  onDragEnd={() => setDraggedLayerId(null)}
                >
                  <span className="layer-icon"><Icon name={layer.kind === "rectangle" ? "rectangle" : "text"} size={15} /></span>
                  <span className="layer-copy">
                    <strong>{layer.name}</strong>
                    <small>{layer.text}</small>
                  </span>
                  <span className="drag-grip" aria-hidden="true">⠿</span>
                </button>
              ))}
              {layers.length === 0 && (
                <p className="empty-layers">Click + to add a new text box</p>
              )}
            </div>
          </section>

          <section className="panel-section card-settings">
            <div className="section-heading"><span>PRODUCT</span></div>
            <div className="product-switch" aria-label="Design type">
              <button
                className={designType === "sd" ? "active" : ""}
                onClick={() => switchDesignType("sd")}
                aria-pressed={designType === "sd"}
              >
                Standard SD
              </button>
              <button
                className={designType === "micro" ? "active" : ""}
                onClick={() => switchDesignType("micro")}
                aria-pressed={designType === "micro"}
              >
                microSD
              </button>
              <button
                className={designType === "ram" ? "active" : ""}
                onClick={() => switchDesignType("ram")}
                aria-pressed={designType === "ram"}
              >
                RAM
              </button>
            </div>
            <div className="color-label">{designType === "ram" ? "Module color" : "Card color"}</div>
            <div className="swatches">
              {availableColors.map((color) => (
                <button
                  key={color.value}
                  title={color.label}
                  aria-label={`${color.label} card`}
                  className={cardColor === color.value ? "active" : ""}
                  style={{ backgroundColor: color.value }}
                  onClick={() => {
                    setCardColor(color.value);
                    setSaved(false);
                  }}
                />
              ))}
            </div>
          </section>

          <section className="tip-card">
            <span className="tip-icon"><Icon name="layers" size={17} /></span>
            <p>
              <strong>{designType === "ram" ? "Full-size DIMM template" : "Print-ready by default"}</strong>
              {designType === "ram"
                ? "Designed at 133.35 × 31.25 mm with a centered key notch."
                : designType === "micro"
                  ? "Designed at 15 × 11 mm with the stepped upper-right key profile."
                  : "Designed at 24 × 32 mm with a clipped top corner."}
            </p>
          </section>
        </aside>

        <section className={`canvas-area ${showGrid ? "show-grid" : ""}`}>
          <div className="canvas-toolbar">
            <button onClick={() => setShowGrid((current) => !current)} className={showGrid ? "active" : ""}>
              <span className="grid-icon" /> Grid
            </button>
            <span className="toolbar-separator" />
            <button aria-label="Zoom out" onClick={() => updateZoom(zoom - 10)}>
              <Icon name="minus" size={15} />
            </button>
            <span className="zoom-value">{zoom}%</span>
            <button aria-label="Zoom in" onClick={() => updateZoom(zoom + 10)}>
              <Icon name="plus" size={15} />
            </button>
          </div>

          <div
            className="stage"
            onClick={handleStageClick}
            onMouseDown={handleStageMouseDown}
            onMouseMove={handleStageMouseMove}
            onMouseUp={handleStageMouseUp}
            onMouseLeave={handleStageMouseUp}
            onWheel={(event) => {
              event.preventDefault();
              const direction = event.deltaY < 0 ? 1 : -1;
              updateZoom(zoom + direction * 10);
            }}
          >
            {designType === "micro" ? (
              <div
                className="micro-card-wrap"
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})` }}
              >
                <div className="dimension dimension-top">
                  <span>15 mm</span>
                </div>
                <div className="dimension dimension-side">
                  <span>11 mm</span>
                </div>
                <div className="micro-card-shadow" />
                <div
                  className="micro-card"
                  ref={(element) => { canvasRefs.current.micro = element; }}
                  style={{ color: cardColor }}
                >
                  <svg
                    className="micro-card-base"
                    viewBox="0 0 1500 1100"
                    aria-hidden="true"
                  >
                    <path
                      d={microSdOutlinePath}
                      transform={microSdLandscapeTransform}
                      fill="currentColor"
                    />
                    <path
                      d={microSdOutlinePath}
                      transform={microSdLandscapeTransform}
                      fill="none"
                      stroke="rgb(255 255 255 / 8%)"
                      strokeWidth="4"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  <div className="card-grain" />
                  {layers.filter((layer) => layer.kind === "rectangle").map(renderRectangleLayer)}
                  {layers.filter((layer) => layer.kind !== "rectangle").map((layer) => (
                    <button
                      key={layer.id}
                      className={`canvas-text micro-text ${selectedId === layer.id ? "selected" : ""}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedId(layer.id);
                      }}
                      onPointerDown={(event) => handleCanvasPointerDown(event, layer)}
                      onPointerMove={handleCanvasPointerMove}
                      onPointerUp={handleCanvasPointerUp}
                      onPointerCancel={handleCanvasPointerUp}
                      style={{
                        left: `${layer.x}%`,
                        top: `${layer.y}%`,
                        width: `${layer.width}%`,
                        maxWidth: `${layer.width}%`,
                        color: layer.color,
                        backgroundColor: hexToRgba(layer.backgroundColor, layer.backgroundOpacity),
                        fontSize: `${layer.size}px`,
                        fontWeight: layer.weight,
                        fontFamily: layer.fontFamily,
                        textAlign: layer.align,
                        letterSpacing: `${layer.letterSpacing}px`,
                        zIndex: layers.indexOf(layer) + 2,
                      }}
                    >
                      {layer.text}
                      {selectedId === layer.id && (
                        <>
                          <i className="handle handle-nw" data-handle="nw" />
                          <i className="handle handle-ne" data-handle="ne" />
                          <i className="handle handle-sw" data-handle="sw" />
                          <i className="handle handle-se" data-handle="se" />
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : designType === "sd" ? (
              <div
                className="sd-card-wrap"
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})` }}
              >
                <div className="dimension dimension-top">
                  <span>24 mm</span>
                </div>
                <div className="dimension dimension-side">
                  <span>32 mm</span>
                </div>
                <div className="sd-card-shadow" />
                <div
                  className="sd-card"
                  ref={(element) => { canvasRefs.current.sd = element; }}
                  style={{ backgroundColor: cardColor }}
                >
                  <div className="card-grain" />
                  <div className="contact-ridges">
                    {Array.from({ length: 8 }).map((_, index) => <i key={index} />)}
                  </div>
                  {layers.filter((layer) => layer.kind === "rectangle").map(renderRectangleLayer)}
                  {layers.filter((layer) => layer.kind !== "rectangle").map((layer) => (
                    <button
                      key={layer.id}
                      className={`canvas-text ${selectedId === layer.id ? "selected" : ""}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedId(layer.id);
                      }}
                      onPointerDown={(event) => handleCanvasPointerDown(event, layer)}
                      onPointerMove={handleCanvasPointerMove}
                      onPointerUp={handleCanvasPointerUp}
                      onPointerCancel={handleCanvasPointerUp}
                      style={{
                        left: `${layer.x}%`,
                        top: `${layer.y}%`,
                        width: `${layer.width}%`,
                        maxWidth: `${layer.width}%`,
                        color: layer.color,
                        backgroundColor: hexToRgba(
                          layer.backgroundColor,
                          layer.backgroundOpacity,
                        ),
                        fontSize: `${layer.size}px`,
                        fontWeight: layer.weight,
                        fontFamily: layer.fontFamily,
                        textAlign: layer.align,
                        letterSpacing: `${layer.letterSpacing}px`,
                        zIndex: layers.indexOf(layer) + 2,
                      }}
                    >
                      {layer.text}
                      {selectedId === layer.id && (
                        <>
                          <i className="handle handle-nw" data-handle="nw" />
                          <i className="handle handle-ne" data-handle="ne" />
                          <i className="handle handle-sw" data-handle="sw" />
                          <i className="handle handle-se" data-handle="se" />
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="ram-card-wrap"
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})` }}
              >
                <div className="dimension dimension-top">
                  <span>133.35 mm</span>
                </div>
                <div className="dimension dimension-side">
                  <span>31.25 mm</span>
                </div>
                <div className="ram-module-shadow" />
                <div
                  className="ram-module"
                  ref={(element) => { canvasRefs.current.ram = element; }}
                  style={{ backgroundColor: cardColor }}
                >
                  <div className="card-grain" />
                  <div className="memory-chips">
                    {Array.from({ length: 8 }).map((_, index) => <i key={index} />)}
                  </div>
                  <div className="ram-contacts">
                    {Array.from({ length: 42 }).map((_, index) => <i key={index} />)}
                  </div>
                  {layers.filter((layer) => layer.kind === "rectangle").map(renderRectangleLayer)}
                  {layers.filter((layer) => layer.kind !== "rectangle").map((layer) => (
                    <button
                      key={layer.id}
                      className={`canvas-text ram-text ${selectedId === layer.id ? "selected" : ""}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedId(layer.id);
                      }}
                      onPointerDown={(event) => handleCanvasPointerDown(event, layer)}
                      onPointerMove={handleCanvasPointerMove}
                      onPointerUp={handleCanvasPointerUp}
                      onPointerCancel={handleCanvasPointerUp}
                      style={{
                        left: `${layer.x}%`,
                        top: `${layer.y}%`,
                        width: `${layer.width}%`,
                        maxWidth: `${layer.width}%`,
                        color: layer.color,
                        backgroundColor: hexToRgba(
                          layer.backgroundColor,
                          layer.backgroundOpacity,
                        ),
                        fontSize: `${layer.size}px`,
                        fontWeight: layer.weight,
                        fontFamily: layer.fontFamily,
                        textAlign: layer.align,
                        letterSpacing: `${layer.letterSpacing}px`,
                        zIndex: layers.indexOf(layer) + 2,
                      }}
                    >
                      {layer.text}
                      {selectedId === layer.id && (
                        <>
                          <i className="handle handle-nw" data-handle="nw" />
                          <i className="handle handle-ne" data-handle="ne" />
                          <i className="handle handle-sw" data-handle="sw" />
                          <i className="handle handle-se" data-handle="se" />
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="canvas-caption">
            {layers.length === 0
              ? "Click + to add a new text box"
              : `Click any text on the ${designType === "ram" ? "module" : "card"} to edit it`}
          </p>
        </section>

        <aside className="right-panel">
          <div className="properties-title">
            <div>
              <span>PROPERTIES</span>
              <strong>{selected?.name ?? "Text"}</strong>
            </div>
            <div className="property-actions">
              <button onClick={duplicateText} aria-label="Duplicate text" disabled={!selected}><Icon name="copy" size={16} /></button>
              <button onClick={deleteText} aria-label="Delete text" disabled={!selected}><Icon name="trash" size={16} /></button>
            </div>
          </div>

          {selected && (
            <div className="property-content">
              {selected.kind === "rectangle" && (
                <section className="property-section">
                  <div className="control-label">Rectangle</div>
                  <div className="color-control">
                    <label className="color-preview" style={{ backgroundColor: selected.fill ?? "#ffffff" }}>
                      <input
                        type="color"
                        value={selected.fill ?? "#ffffff"}
                        onChange={(event) => updateSelected({ fill: event.target.value })}
                      />
                    </label>
                    <input
                      className="hex-input"
                      aria-label="Rectangle fill color"
                      value={(selected.fill ?? "#ffffff").toUpperCase()}
                      onChange={(event) => {
                        if (/^#[0-9A-Fa-f]{6}$/.test(event.target.value)) {
                          updateSelected({ fill: event.target.value });
                        }
                      }}
                    />
                  </div>
                  <label className="opacity-control">
                    <span>Opacity</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selected.fillOpacity ?? 100}
                      onChange={(event) => updateSelected({ fillOpacity: Number(event.target.value) })}
                    />
                    <output>{selected.fillOpacity ?? 100}%</output>
                  </label>
                </section>
              )}

              <section className={`property-section ${selected.kind === "rectangle" ? "text-only-section" : ""}`}>
                <label className="field-label">
                  <span>Text</span>
                  <textarea
                    rows={2}
                    value={selected.text}
                    onChange={(event) => updateSelected({ text: event.target.value })}
                  />
                </label>
              </section>

              <section className={`property-section ${selected.kind === "rectangle" ? "text-only-section" : ""}`}>
                <div className="control-label">Typography</div>
                <label className="select-wrap full">
                  <select
                    value={selected.fontFamily}
                    onChange={(event) =>
                      updateSelected({ fontFamily: event.target.value as FontFamily })
                    }
                  >
                    <option value="inter">Inter</option>
                    <option value="arial">Arial</option>
                    <option value="georgia">Georgia</option>
                  </select>
                  <Icon name="chevron" size={16} />
                </label>
                <div className="control-row">
                  <label className="select-wrap grow">
                    <select
                      value={selected.weight}
                      onChange={(event) => updateSelected({ weight: Number(event.target.value) })}
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                      <option value="700">Bold</option>
                      <option value="800">Extra bold</option>
                    </select>
                    <Icon name="chevron" size={16} />
                  </label>
                  <span className="compact-field">
                    <input
                      aria-label="Font size"
                      type="number"
                      min="6"
                      max="72"
                      value={selected.size}
                      onChange={(event) => updateSelected({ size: Number(event.target.value) })}
                    />
                    <small>px</small>
                  </span>
                </div>
                <div className="alignment-control">
                  {(["left", "center", "right"] as const).map((alignment) => (
                    <button
                      key={alignment}
                      className={selected.align === alignment ? "active" : ""}
                      onClick={() => updateSelected({ align: alignment })}
                      aria-label={`Align ${alignment}`}
                    >
                      <span className={`align-lines ${alignment}`}><i /><i /><i /></span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="property-section">
                <div className="control-label">Position & size</div>
                <div className="number-grid">
                  <NumberControl label="X" value={selected.x} min={0} max={90} unit="%" onChange={(x) => updateSelected({ x })} />
                  <NumberControl label="Y" value={selected.y} min={0} max={94} unit="%" onChange={(y) => updateSelected({ y })} />
                  <NumberControl label="W" value={selected.width} min={10} max={90} unit="%" onChange={(width) => updateSelected({ width })} />
                  {selected.kind === "rectangle" ? (
                    <NumberControl label="H" value={selected.height ?? 30} min={5} max={90} unit="%" onChange={(height) => updateSelected({ height })} />
                  ) : (
                    <NumberControl label="Tracking" value={selected.letterSpacing} min={-3} max={8} onChange={(letterSpacing) => updateSelected({ letterSpacing })} />
                  )}
                </div>
                {selected.kind === "rectangle" && (
                  <NumberControl label="Radius" value={selected.radius ?? 0} min={0} max={25} unit="%" onChange={(radius) => updateSelected({ radius })} />
                )}
              </section>

              <section className={`property-section ${selected.kind === "rectangle" ? "text-only-section" : ""}`}>
                <div className="control-label">Text color</div>
                <div className="color-control">
                  <label className="color-preview" style={{ backgroundColor: selected.color }}>
                    <input
                      type="color"
                      value={selected.color}
                      onChange={(event) => updateSelected({ color: event.target.value })}
                    />
                  </label>
                  <input
                    className="hex-input"
                    value={selected.color.toUpperCase()}
                    onChange={(event) => {
                      if (/^#[0-9A-Fa-f]{6}$/.test(event.target.value)) {
                        updateSelected({ color: event.target.value });
                      }
                    }}
                  />
                </div>
              </section>

              <section className={`property-section ${selected.kind === "rectangle" ? "text-only-section" : ""}`}>
                <div className="control-label">Text background</div>
                <div className="color-control">
                  <label
                    className="color-preview transparency-grid"
                    style={{
                      backgroundColor: hexToRgba(
                        selected.backgroundColor,
                        selected.backgroundOpacity,
                      ),
                    }}
                  >
                    <input
                      type="color"
                      value={selected.backgroundColor ?? "#000000"}
                      onChange={(event) =>
                        updateSelected({ backgroundColor: event.target.value })
                      }
                    />
                  </label>
                  <input
                    className="hex-input"
                    aria-label="Text background color"
                    value={(selected.backgroundColor ?? "#000000").toUpperCase()}
                    onChange={(event) => {
                      if (/^#[0-9A-Fa-f]{6}$/.test(event.target.value)) {
                        updateSelected({ backgroundColor: event.target.value });
                      }
                    }}
                  />
                </div>
                <div className="background-size-control">
                  <button
                    className={(selected.backgroundMode ?? "fit") === "fit" ? "active" : ""}
                    onClick={() => updateSelected({ backgroundMode: "fit" })}
                    aria-pressed={(selected.backgroundMode ?? "fit") === "fit"}
                  >
                    Fit to text
                  </button>
                  <button
                    className={selected.backgroundMode === "full" ? "active" : ""}
                    onClick={() => updateSelected({ backgroundMode: "full" })}
                    aria-pressed={selected.backgroundMode === "full"}
                  >
                    Full width
                  </button>
                </div>
                <label className="opacity-control">
                  <span>Opacity</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selected.backgroundOpacity ?? 0}
                    onChange={(event) =>
                      updateSelected({ backgroundOpacity: Number(event.target.value) })
                    }
                  />
                  <output>{selected.backgroundOpacity ?? 0}%</output>
                </label>
              </section>
            </div>
          )}

          <button className="add-text-button" onClick={addText}>
            <Icon name="plus" size={17} />
            Add text box
          </button>
        </aside>
      </div>
    </main>
  );
}
