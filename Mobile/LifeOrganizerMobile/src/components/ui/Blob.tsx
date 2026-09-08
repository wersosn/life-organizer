import Svg, { Path } from "react-native-svg";
import { StyleProp, ViewStyle } from "react-native";

type BlobVariant = "top" | "top1" | "top2" | "top3" | "top4" | "top5" | "drip" | "drip1" | "drip2" | "drip3" | "drip4";

interface BlobProps {
    variant?: BlobVariant;
    color: string;
    width?: number;
    height?: number;
    style?: StyleProp<ViewStyle>;
}

const ALIASES: Partial<Record<BlobVariant, BlobVariant>> = {
    top: "top1",
    drip: "drip1",
};

const PATHS: Partial<Record<BlobVariant, { viewBox: string; d: string }>> = {
    top1: {
        viewBox: "0 0 375 220",
        d: "M0,0 H375 V95 C330,150 300,70 245,95 C190,120 200,190 130,185 C75,180 70,120 30,130 C10,135 5,110 0,115 Z",
    },
    top2: {
        viewBox: "0 0 375 160",
        d: "M0,0 H375 V68 C330,108 300,50 245,68 C190,86 200,137 130,133 C75,130 70,86 30,94 C10,97 5,79 0,83 Z",
    },
    top3: {
        viewBox: "0 0 375 110",
        d: "M0,0 H375 V50 C330,80 290,40 230,55 C170,70 175,95 110,90 C60,86 55,60 20,65 C8,67 5,55 0,58 Z",
    },
    top4: {
        viewBox: "0 0 375 130",
        d: "M0,0 H375 V60 C340,100 310,55 260,75 C210,95 220,120 150,110 C100,103 95,70 50,78 C25,82 15,65 0,70 Z",
    },
    top5: {
        viewBox: "0 0 375 120",
        d: "M0,0 H375 V70 C360,105 300,100 260,80 C210,55 190,90 140,85 C90,80 80,50 40,60 C15,66 5,50 0,55 Z",
    },
    drip1: {
        viewBox: "0 0 375 170",
        d: "M0,55 C55,15 90,90 145,50 C195,15 215,85 265,60 C305,40 335,90 375,65 V170 H0 Z",
    },
    drip2: {
        viewBox: "0 0 375 100",
        d: "M0,35 C50,10 80,55 125,30 C170,5 190,50 235,35 C270,23 300,55 340,40 C355,34 365,45 375,40 V100 H0 Z",
    },
    drip3: {
        viewBox: "0 0 375 130",
        d: "M0,45 C45,15 70,70 115,40 C155,15 175,75 215,50 C245,32 260,90 300,55 C325,35 350,60 375,45 V130 H0 Z",
    },
    drip4: {
        viewBox: "0 0 375 90",
        d: "M0,30 C60,10 100,45 150,25 C200,5 230,40 280,25 C310,15 340,35 375,25 V90 H0 Z",
    },
};

export function Blob({ variant = "top1", color, width = 375, height, style }: BlobProps) {
    const resolvedVariant = ALIASES[variant] ?? variant;
    const { viewBox, d } = PATHS[resolvedVariant]!;
    const [, , vbW, vbH] = viewBox.split(" ").map(Number);
    const resolvedHeight = height ?? (width * vbH) / vbW;

    return (
        <Svg width={width} height={resolvedHeight} viewBox={viewBox} style={style}>
            <Path d={d} fill={color} />
        </Svg>
    );
}