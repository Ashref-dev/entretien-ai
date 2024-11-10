"use client";

import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

export default function BackgroundShader() {
  return (
    <ShaderGradientCanvas
      style={{
        position: "absolute",
        top: 0,
        height: "100svh",
        width: "100svw",
      }}
    >
      <ShaderGradient
        control="query"
        urlString="https://shadergradient-web.vercel.app/customize?animate=on&axesHelper=off&bgColor1=%23af38ff&bgColor2=%23910aff&brightness=1.5&cAzimuthAngle=180&cDistance=3.7&cPolarAngle=100&cameraZoom=12.5&color1=%23809bd6&color2=%23910aff&color3=%23af38ff&destination=onCanvas&embedMode=off&envPreset=lobby&format=gif&fov=40&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=0.9&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.5&rotationX=0&rotationY=0&rotationZ=180&shader=defaults&type=plane&uAmplitude=7&uDensity=1.1&uFrequency=5.5&uSpeed=0.3&uStrength=1.5&uTime=0&wireframe=false"
      />
    </ShaderGradientCanvas>
  );
}
