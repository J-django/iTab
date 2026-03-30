import { useEffect, useId, useRef, useState } from "react";
import { clsx } from "clsx";
import "../styles/index.less";

import type { CSSProperties } from "react";
import type { GlassSurfaceProps } from "../types";

function generateDisplacementMap(options: {
  width: number;
  height: number;
  borderRadius: number;
  borderWidth: number;
  brightness: number;
  opacity: number;
  blur: number;
  mixBlendMode: CSSProperties["mixBlendMode"];
  redGradientId: string;
  blueGradientId: string;
}) {
  const {
    width,
    height,
    borderRadius,
    borderWidth,
    brightness,
    opacity,
    blur,
    mixBlendMode,
    redGradientId,
    blueGradientId,
  } = options;
  const edgeSize = Math.min(width, height) * (borderWidth * 0.5);

  const svgContent = `
    <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${redGradientId}" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="red"/>
        </linearGradient>
        <linearGradient id="${blueGradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="blue"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="black"></rect>
      <rect x="0" y="0" width="${width}" height="${height}" rx="${borderRadius}" fill="url(#${redGradientId})" />
      <rect x="0" y="0" width="${width}" height="${height}" rx="${borderRadius}" fill="url(#${blueGradientId})" style="mix-blend-mode: ${mixBlendMode}" />
      <rect x="${edgeSize}" y="${edgeSize}" width="${width - edgeSize * 2}" height="${height - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
}

function supportsSvgFilters(filterId: string) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  const isWebkit =
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const isFirefox = /Firefox/.test(navigator.userAgent);

  if (isWebkit || isFirefox) {
    return false;
  }

  const div = document.createElement("div");
  div.style.backdropFilter = `url(#${filterId})`;

  return div.style.backdropFilter !== "";
}

let cachedSvgFilterSupport: boolean | null = null;

function getSvgFilterSupport(filterId: string) {
  if (cachedSvgFilterSupport !== null) {
    return cachedSvgFilterSupport;
  }

  cachedSvgFilterSupport = supportsSvgFilters(filterId);

  return cachedSvgFilterSupport;
}

export const GlassSurface = ({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0,
  saturation = 1,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = "R",
  yChannel = "G",
  mixBlendMode = "difference",
  className = "",
  contentClassName = "",
  style = {},
}: GlassSurfaceProps) => {
  const id = useId();
  const filterId = `glass-filter-${id}`;
  const redGradientId = `red-grad-${id}`;
  const blueGradientId = `blue-grad-${id}`;

  const [svgSupported] = useState(() => getSvgFilterSupport(filterId));

  const containerRef = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null);

  useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    const actualWidth = rect?.width || 400;
    const actualHeight = rect?.height || 200;

    feImageRef.current?.setAttribute(
      "href",
      generateDisplacementMap({
        width: actualWidth,
        height: actualHeight,
        borderRadius,
        borderWidth,
        brightness,
        opacity,
        blur,
        mixBlendMode,
        redGradientId,
        blueGradientId,
      }),
    );

    [
      { ref: redChannelRef, offset: redOffset },
      { ref: greenChannelRef, offset: greenOffset },
      { ref: blueChannelRef, offset: blueOffset },
    ].forEach(({ ref, offset }) => {
      if (!ref.current) {
        return;
      }

      ref.current.setAttribute("scale", (distortionScale + offset).toString());
      ref.current.setAttribute("xChannelSelector", xChannel);
      ref.current.setAttribute("yChannelSelector", yChannel);
    });

    gaussianBlurRef.current?.setAttribute("stdDeviation", displace.toString());
  }, [
    blur,
    blueGradientId,
    borderRadius,
    borderWidth,
    brightness,
    displace,
    distortionScale,
    greenOffset,
    mixBlendMode,
    opacity,
    redGradientId,
    redOffset,
    xChannel,
    yChannel,
    blueOffset,
  ]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      const actualWidth = rect?.width || 400;
      const actualHeight = rect?.height || 200;

      setTimeout(() => {
        feImageRef.current?.setAttribute(
          "href",
          generateDisplacementMap({
            width: actualWidth,
            height: actualHeight,
            borderRadius,
            borderWidth,
            brightness,
            opacity,
            blur,
            mixBlendMode,
            redGradientId,
            blueGradientId,
          }),
        );
      }, 0);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [
    blur,
    blueGradientId,
    borderRadius,
    borderWidth,
    brightness,
    mixBlendMode,
    opacity,
    redGradientId,
  ]);

  const containerStyle: CSSProperties = {
    ...style,
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    "--glass-frost": backgroundOpacity,
    "--glass-saturation": saturation,
    "--filter-id": `url(#${filterId})`,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      className={clsx(
        "glass-surface",
        svgSupported ? "glass-surface--svg" : "glass-surface--fallback",
        className,
      )}
      style={containerStyle}
    >
      <svg className="glass-surface__filter" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feImage
              ref={feImageRef}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="map"
            />

            <feDisplacementMap
              ref={redChannelRef}
              in="SourceGraphic"
              in2="map"
              id="redchannel"
              result="dispRed"
            />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />

            <feDisplacementMap
              ref={greenChannelRef}
              in="SourceGraphic"
              in2="map"
              id="greenchannel"
              result="dispGreen"
            />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="green"
            />

            <feDisplacementMap
              ref={blueChannelRef}
              in="SourceGraphic"
              in2="map"
              id="bluechannel"
              result="dispBlue"
            />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blue"
            />

            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur
              ref={gaussianBlurRef}
              in="output"
              stdDeviation="0.7"
            />
          </filter>
        </defs>
      </svg>

      <div className={clsx("glass-surface__content", contentClassName)}>
        {children}
      </div>
    </div>
  );
};

export default GlassSurface;
