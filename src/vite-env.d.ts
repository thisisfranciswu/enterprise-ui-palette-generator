/// <reference types="vite/client" />

// declare namespace JSX {
//   interface IntrinsicElements {
//     "ui-chart": any;
//     "ui-chart-ledgend": JSX.IntrinsicElements &
//       IntrinsicElements & {
//         label: string;
//         value: number;
//         color: string;
//       };
//   }
// }

declare namespace JSX {
  interface IntrinsicElements {
    "ui-chart": UiChartProps;
    "ui-chart-ledgend": UiChartLedgendTextProps;
  }
}

interface UiChartLedgendTextProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  label?: string;
  value?: number;
  color?: string;
  wrap?: boolean;
}

interface UiChartProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  size: number?;
  ["no-legend"]?: boolean;
  ["no-ledgend"]?: boolean;
  ["base-color"]?: string;
  radix?: number;
  type?: string;
}
