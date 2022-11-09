import { createIcon } from "@chakra-ui/icons";
import { chakra, forwardRef, ImageProps, usePrefersReducedMotion } from "@chakra-ui/react";
import ada from "./ada.svg";
import algo from "./algo.svg";
import ar from "./ar.svg";
import atom from "./atom.svg";
import btc from "./btc.svg";
import ckb from "./ckb.svg";
import doge from "./doge.svg";
import dot from "./dot.svg";
import eth from "./eth.svg";
import icp from "./icp.svg";
import idena from "./idena.svg";
import ltc from "./icp.svg";
import near from "./near.svg";
import rvn from "./rvn.svg";
import sol from "./sol.svg";
import trx from "./trx.svg";
import xtz from "./xtz.svg";

export const EmptyIcon = createIcon({
    displayName: "",
    viewBox: "0 0 128 128",
    path: (
        <path width={128} height={128}
            transform="" 
            d="" />
    ),
});

export const AdaIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={ada} width="1em" height="1em" ref={ref} {...props} />
});
export const AlgoIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={algo} width="1em" height="1em" ref={ref} {...props} />
});
export const ArIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={ar} width="1em" height="1em" ref={ref} {...props} />
});
export const AtomIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={atom} width="1em" height="1em" ref={ref} {...props} />
});
export const BtcIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={btc} width="1em" height="1em" ref={ref} {...props} />
});
export const CkbIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={ckb} width="1em" height="1em" ref={ref} {...props} />
});
export const DogeIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={doge} width="1em" height="1em" ref={ref} {...props} />
});
export const DotIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={dot} width="1em" height="1em" ref={ref} {...props} />
});
export const EthIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={eth} ref={ref} width="1em" height="1em" {...props} />
});
export const IcpIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={icp} ref={ref} width="1em" height="1em" {...props} />
});
export const IdenaIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={idena} ref={ref} width="1em" height="1em" {...props} />
});
export const LtcIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={ltc} ref={ref} width="1em" height="1em" {...props} />
});
export const NearIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={near} ref={ref} width="1em" height="1em" {...props} />
});
export const RvnIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={rvn} ref={ref} width="1em" height="1em" {...props} />
});
export const SolIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={sol} ref={ref} width="1em" height="1em" {...props} />
});
export const TrxIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={trx} ref={ref} width="1em" height="1em" {...props} />
});
export const XtzIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={xtz} ref={ref} width="1em" height="1em" {...props} />
});

// export const ForkIcon = createIcon({
//     displayName: "ForkIcon",
//     viewBox: "0 0 128 128",
//     path: (
//         <path width={128} height={128}
//             transform="rotate(0,64,64) translate(8,9.27577640684495) scale(3.49999874830291,3.49999874830291)" 
//             d = "M27.571313,24.769906C27.353357,24.769906 27.134364,24.797906 26.918363,24.851899 26.281343,25.015904 25.748325,25.402911 25.420324,25.942919 25.091346,26.481929 25.006324,27.109938 25.179359,27.709952 25.353368,28.31096 25.765353,28.811959 26.338348,29.12097 26.91232,29.430972 27.580346,29.509968 28.218343,29.347979 28.855302,29.184966 29.388318,28.797967 29.716319,28.25795 30.04432,27.717948 30.130319,27.089932 29.95631,26.490924 29.783336,25.889918 29.371351,25.388911 28.798356,25.079907 28.418353,24.874901 27.996358,24.769906 27.571313,24.769906z M4.429477,13.083719C4.0384882,13.083719 3.6504901,13.172725 3.2924597,13.346723 2.7064645,13.632731 2.2725072,14.117739 2.0724957,14.710744 1.8724849,15.303755 1.9294915,15.934761 2.2344825,16.485772 2.5384968,17.038783 3.0534475,17.445786 3.685463,17.634793 4.9834902,18.018794 6.3784406,17.342787 6.7904256,16.118769 6.9904368,15.525758 6.93343,14.895752 6.6284392,14.342742 6.324425,13.790731 5.8094742,13.382727 5.1794727,13.194721 4.9334414,13.120722 4.6794756,13.083719 4.429477,13.083719z M27.477319,1.8395491C27.088344,1.8395491 26.698331,1.927548 26.342315,2.1015469 25.75632,2.3885536 25.322362,2.8725623 25.122352,3.4655735 24.922342,4.0585777 24.979347,4.6895916 25.284339,5.2416021 25.588353,5.793605 26.103364,6.2026159 26.733365,6.3906147 27.363305,6.5776216 28.031331,6.5246193 28.620319,6.2376124 29.206313,5.9516122 29.640331,5.4666044 29.840343,4.874592L29.840343,4.8735926C30.040292,4.2805812 29.983346,3.6495747 29.678294,3.0975644 29.374341,2.5455539 28.85933,2.1375503 28.229329,1.949544 27.983358,1.8765447 27.729331,1.8395491 27.477319,1.8395491z M27.536552,0.00036219875C27.968139,0.0057348481 28.400554,0.070891721 28.821306,0.1965183 29.949291,0.53352916 30.869329,1.2625367 31.413331,2.2515504 31.959289,3.2395648 32.0603,4.3685877 31.703307,5.4306008 31.346315,6.4916217 30.569343,7.3586318 29.5193,7.8706409 28.880327,8.1826417 28.185323,8.3406493 27.485315,8.3406493 27.036342,8.3406493 26.582366,8.2756459 26.141328,8.1436402 25.330358,7.9016396 24.655374,7.449629 24.137372,6.8826267L8.7144263,14.406738C8.8604214,14.95575,8.8834307,15.532755,8.7784512,16.114764L24.182355,24.419894C24.75834,23.773886 25.523351,23.30288 26.406341,23.077878 27.548364,22.784873 28.743303,22.929873 29.769298,23.482882 30.796331,24.036893 31.531312,24.932902 31.842284,26.006924 32.153318,27.081937 32.001279,28.205947 31.413331,29.171965 30.825322,30.138991 29.871349,30.830989 28.729326,31.123 28.344318,31.222001 27.951316,31.270997 27.561364,31.270997 26.800321,31.270997 26.046357,31.083998 25.366369,30.717995 24.339336,30.163985 23.605333,29.266968 23.29436,28.192946 23.088367,27.483937 23.104358,26.756936 23.295337,26.063924L8.0334609,17.834792C7.2044246,18.926812 5.8554332,19.583819 4.429477,19.583819 3.9864865,19.583819 3.538491,19.520823 3.0934866,19.387818 1.965502,19.050814 1.0435102,18.321799 0.49950709,17.332785 -0.046510372,16.344771 -0.14752298,15.215756 0.20946983,14.154735 0.94847908,11.9627 3.4384551,10.741687 5.7714493,11.441695 6.612448,11.692699 7.313433,12.164706 7.8364403,12.762715L23.215381,5.2605998C22.99834,4.5125872 22.992358,3.7015776 23.259387,2.9095654 23.61638,1.8485443 24.393352,0.98153418 25.443334,0.46852588 26.100221,0.14852011 26.817237,-0.0085924265 27.536552,0.00036219875z" />
//     ),
// });
// export const OpenFolderIcon = createIcon({
//     displayName: "OpenFolderIcon",
//     viewBox: "0 0 128 128",
//     path: (
//         <path transform="rotate(0,64,64) translate(8,21.387519651642) scale(3.49999833107074,3.49999833107074)  " 
//             d="M0.9370065,0L13.389938,0C13.620893,1.9479558E-07,13.843915,0.085998713,14.015911,0.2390138L16.510893,2.4770197C16.894861,2.8220209 16.927881,3.4129938 16.581875,3.7990109 16.235868,4.1870111 15.645906,4.2160028 15.259923,3.8699943L13.031908,1.8730159 1.872975,1.8730159 1.872975,22.477016 27.112821,22.477016 29.922802,8.3500046 8.2189473,8.3350204 6.65493,14.111996C6.524926,14.61401 6.0219382,14.916012 5.5139454,14.786007 5.0129717,14.656002 4.7129858,14.145016 4.8409756,13.644009L6.5849231,7.165007C6.6919783,6.7510055,7.0649622,6.4620041,7.4929379,6.4620041L31.063787,6.4770187C31.345829,6.4770187 31.610781,6.6029953 31.787783,6.8189987 31.96582,7.0370163 32.036802,7.3220199 31.981811,7.5960067L28.798847,23.597009C28.712849,24.03399,28.326803,24.35,27.880821,24.35L0.9370065,24.35C0.41900396,24.35,0,23.930993,0,23.413995L0,0.93600464C0,0.41900644,0.41900396,1.9479558E-07,0.9370065,0z" />
//     ),
// });
// export const SaveIcon = createIcon({
//     displayName: "SaveIcon",
//     viewBox: "0 0 128 128",
//     path: (
//         <path width={128} height={128}
//             transform="rotate(0,64,64) translate(8,8) scale(3.5,3.5) "
//             d="M7.9999733,21.999969L7.9999733,29.999969 10.999944,29.999969 10.999944,23.999994 12.999944,23.999994 12.999944,29.999969 19.999973,29.999969 19.999973,21.999969z M7.9999437,2.9999943L7.9999437,14.999994 23.999945,14.999994 23.999945,2.9999943z M2.5,2C2.224,2,1.9999998,2.2250004,2,2.5L2,27.434 5.9999733,29.833797 5.9999733,19.999969 21.999973,19.999969 21.999973,30 29.5,30C29.775,30,30,29.775,30,29.5L30,2.5C30,2.2250004,29.775,2,29.5,2L25.999945,2 25.999945,16.999994 5.9999442,16.999994 5.9999442,2z M2.5,0L29.5,0C30.879,0,32,1.1210003,32,2.5L32,29.5C32,30.879,30.879,32,29.5,32L5.7219996,32 0,28.566 0,2.5C0,1.1210003,1.1209998,0,2.5,0z" />
//     ),
// });


// export const EmptyIcon = () => {
//     return (
//         <SVGElement viewBox="0 0 128 128"
//             transform=""
//             path />
//     );
// };

// export const EthIcon = () => {
//     return (
//         <SVGElement viewBox="0 0 512 512">
//             {/* <SVGRectElement width="512" height="512" fill="#fff" /> */}
//             <SVGPathElement fill="#3C3C3B" d="M256 362l-21 45 21 62 131-185z" />
//             <SVGPathElement fill="#8C8C8C" d="M256 469V362l-132-78z" />
//             <SVGPathElement fill="#343434" d="M256 41L124 259l132 78 131-78z" />
//             <SVGPathElement fill="#8C8C8C" d="M256 41L124 259l132-60z" />
//             <SVGPathElement fill="#141414" d="M256 337l131-78-131-60z" />
//             <SVGPathElement fill="#393939" d="M124 259l132 78V199z" />
//         </SVGElement>
//     );
// };