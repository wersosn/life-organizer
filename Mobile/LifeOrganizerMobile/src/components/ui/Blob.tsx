import Svg, { Path } from "react-native-svg";
import { StyleProp, ViewStyle } from "react-native";

type BlobVariant = "top" | "drip";

interface BlobProps {
    variant?: BlobVariant;
    color: string;
    width?: number;
    style?: StyleProp<ViewStyle>;
}

const PATHS: Record<BlobVariant, { viewBox: string; d: string }> = {
    /*top: {
        viewBox: "0 0 375 220",
        d: "M0,0 H375 V95 C330,150 300,70 245,95 C190,120 200,190 130,185 C75,180 70,120 30,130 C10,135 5,110 0,115 Z",
    },*/
    /* smaller blob: */
    top: {
        viewBox: "0 0 375 160",
        d: "M0,0 H375 V68 C330,108 300,50 245,68 C190,86 200,137 130,133 C75,130 70,86 30,94 C10,97 5,79 0,83 Z",
    },
    drip: {
        viewBox: "0 0 375 170",
        d: "M0,55 C55,15 90,90 145,50 C195,15 215,85 265,60 C305,40 335,90 375,65 V170 H0 Z",
    },
};

export function Blob({ variant = "top", color, width = 375, style }: BlobProps) {
    const { viewBox, d } = PATHS[variant];
    const [, , vbW, vbH] = viewBox.split(" ").map(Number);
    const height = (width * vbH) / vbW;

    return (
        <Svg width={width} height={height} viewBox={viewBox} style={style}>
            <Path d={d} fill={color} />
        </Svg>
    );
}