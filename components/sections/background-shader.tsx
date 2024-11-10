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
        urlString="https://shadergradient-web.vercel.app/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=1&color1=%23ff5005&color2=%23dbba95&color3=%23d0bce1&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=-1.4&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=plane&uDensity=1.3&uFrequency=5.5&uSpeed=0.4&uStrength=4&uTime=0&wireframe=false"
      />
    </ShaderGradientCanvas>
  );
}
