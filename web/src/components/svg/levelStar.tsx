import { SVGProps } from "react";

interface IProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

const SvgComponent = (props: IProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={48}
    height={48}
    fill="none"
    {...props}
  >
    <path
      fill={props.color || "#000"}
      fillRule="evenodd"
      d="M0 24c13.254 0 23.999-10.745 23.999-24h.002c0 13.255 10.745 24 23.999 24-13.254 0-23.999 10.745-23.999 24h-.002c0-13.255-10.745-24-23.999-24Z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgComponent;
