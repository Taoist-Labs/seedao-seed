import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={30}
    fill="none"
    style={{ cursor: "pointer" }}
    {...props}
  >
    <path
      fill="#000"
      d="M27.809 1.036a1.838 1.838 0 0 0-.661-.758A1.728 1.728 0 0 0 26.204 0H1.794c-.333 0-.66.097-.943.28a1.847 1.847 0 0 0-.662.756A1.947 1.947 0 0 0 .36 3l9.333 13v13.25c0 .123.028.243.083.352a.74.74 0 0 0 .232.269.7.7 0 0 0 .67.075l7.178-3a.724.724 0 0 0 .328-.276.773.773 0 0 0 .124-.42V16l9.332-13a1.937 1.937 0 0 0 .17-1.964Z"
    />
  </svg>
);
export default SvgComponent;
