import { Dimensions, StyleSheet } from "react-native";
import Svg, { Defs, Mask, Rect } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function ScannerOverlay() {
  const holeWidth = width * 0.7;
  const holeHeight = width * 0.5;
  const holeX = (width - holeWidth) / 2;
  const holeY = (height - holeHeight) / 2;

  return (
    <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
      <Defs>
        <Mask id="mask">
          {/* Full screen white (visible area) */}
          <Rect width="100%" height="100%" fill="white" />

          {/* Transparent hole */}
          <Rect
            x={holeX}
            y={holeY}
            width={holeWidth}
            height={holeHeight}
            rx={20} // rounded corners optional
            fill="black"
          />
        </Mask>
      </Defs>

      {/* Dark overlay using the mask */}
      <Rect width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#mask)" />
    </Svg>
  );
}
