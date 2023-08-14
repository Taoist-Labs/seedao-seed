import * as React from "react";
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={48}
    height={48}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M0 25c13.254 0 23.999-10.745 23.999-24h.002c0 13.255 10.745 24 23.999 24-13.254 0-23.999 10.745-23.999 24h-.002c0-13.255-10.745-24-23.999-24Z"
      clipRule="evenodd"
    />
    <path
      fill="#7A7A7A"
      d="M23.999 1V.5h-.5V1h.5ZM0 25v-.5 1-.5ZM24 1l.001-.5H24V1Zm.001 0h.5V.501L24.002.5l-.001.5ZM48 25v.5-1 .5ZM24.001 49v.5h.5V49h-.5Zm-.002 0h-.5v.5h.5V49Zm-.5-48c0 12.978-10.52 23.5-23.499 23.5v1c13.53 0 24.499-10.97 24.499-24.5h-1Zm.5.5H24v-1h-.001v1Zm0 0 .003-1-.003 1ZM23.5 1c0 13.53 10.968 24.5 24.499 24.5v-1C35.022 24.5 24.501 13.978 24.501 1h-1ZM48 24.5c-13.53 0-24.499 10.97-24.499 24.5h1c0-12.978 10.52-23.5 23.499-23.5v-1Zm-23.999 24H24v1h.001v-1Zm-.001 0h-.001v1H24v-1Zm.499.5c0-13.53-10.968-24.5-24.499-24.5v1c12.978 0 23.499 10.522 23.499 23.5h1Z"
    />
  </svg>
);
export default SvgComponent;
