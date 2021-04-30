import * as React from "react";

interface SolidContributorProps extends React.SVGProps<SVGSVGElement> {}

function SolidContributor(props: SolidContributorProps): JSX.Element {
  return (
    <svg
      width="16"
      height="8"
      viewBox="0 0 16 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.96864 7.89354H0.995933V0.106464H3.93846C4.7332 0.106464 5.41979 0.262358 5.99823 0.574145C6.57919 0.883397 7.02686 1.32953 7.34123 1.91255C7.65812 2.49303 7.81656 3.18885 7.81656 4C7.81656 4.81115 7.65938 5.50824 7.345 6.09125C7.03063 6.67174 6.58548 7.11787 6.00955 7.42966C5.43362 7.73891 4.75332 7.89354 3.96864 7.89354ZM3.09343 6.09886H3.89319C4.27547 6.09886 4.60116 6.03675 4.87026 5.91255C5.14188 5.78834 5.34811 5.57414 5.48895 5.26996C5.6323 4.96578 5.70398 4.54246 5.70398 4C5.70398 3.45754 5.63104 3.03422 5.48518 2.73004C5.34182 2.42586 5.13056 2.21166 4.8514 2.08745C4.57475 1.96324 4.23523 1.90114 3.83283 1.90114H3.09343V6.09886ZM0 4.28897V3.1635H4.05918V4.28897H0Z"
        fill="#5D7290"
      />
      <path
        d="M16 3.02662H13.8723C13.8572 2.84918 13.817 2.68821 13.7516 2.54373C13.6887 2.39924 13.6007 2.27503 13.4875 2.1711C13.3769 2.06464 13.2423 1.98352 13.0839 1.92776C12.9254 1.86945 12.7456 1.8403 12.5444 1.8403C12.1923 1.8403 11.8943 1.92649 11.6503 2.09886C11.4089 2.27123 11.2253 2.51838 11.0996 2.8403C10.9763 3.16223 10.9147 3.5488 10.9147 4C10.9147 4.47655 10.9776 4.87579 11.1033 5.19772C11.2316 5.51711 11.4164 5.75792 11.6579 5.92015C11.8993 6.07985 12.1898 6.1597 12.5293 6.1597C12.723 6.1597 12.8965 6.13561 13.0499 6.08745C13.2033 6.03676 13.3366 5.96451 13.4498 5.87072C13.563 5.77693 13.6548 5.66413 13.7252 5.53232C13.7981 5.39797 13.8472 5.24715 13.8723 5.07985L16 5.09506C15.9749 5.42459 15.8831 5.76046 15.7246 6.10266C15.5662 6.44233 15.3411 6.75665 15.0493 7.04563C14.7601 7.33207 14.4017 7.56274 13.9742 7.73764C13.5466 7.91255 13.0499 8 12.4841 8C11.7748 8 11.1385 7.84664 10.5752 7.53992C10.0143 7.23321 9.57045 6.782 9.2435 6.18631C8.91907 5.59062 8.75685 4.86185 8.75685 4C8.75685 3.13308 8.92284 2.40304 9.25482 1.80989C9.5868 1.2142 10.0345 0.764259 10.5978 0.460077C11.1612 0.153359 11.7899 0 12.4841 0C12.972 0 13.4209 0.0671736 13.8308 0.201521C14.2408 0.335868 14.6004 0.53232 14.9098 0.790875C15.2191 1.0469 15.4681 1.36248 15.6567 1.73764C15.8453 2.1128 15.9598 2.54246 16 3.02662Z"
        fill="#5D7290"
      />
    </svg>
  );
}

export default SolidContributor;
