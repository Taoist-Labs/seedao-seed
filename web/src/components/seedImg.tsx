import styled from "@emotion/styled";
import { css } from "@emotion/react";
import Fade from "@mui/material/Fade";

import EmptyIcon from "assets/images/user/empty.svg";
import { useEffect, useState } from "react";

interface IProps {
  src: string;
  name?: string;
  children?: React.ReactNode;
  isStatic?: boolean;
}

export default function SeedImg({ src, name, children, isStatic }: IProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <Fade in={show}>
      <SeedImgStyle
        className={imgLoaded ? "" : "loading"}
        isDynamic={!isStatic}
      >
        <img src={EmptyIcon} alt="" />
        <img
          src={src}
          title={name}
          alt=""
          onLoad={() => setImgLoaded(true)}
          className="nft-img"
          style={{ visibility: imgLoaded ? "visible" : "hidden" }}
        />
        {children}
      </SeedImgStyle>
    </Fade>
  );
}

const DynamicStyle = css`
  img.nft-img {
    cursor: pointer;
    &:hover {
      animation: scaleanim 0.2s ease-in-out forwards;
    }
    @keyframes scaleanim {
      from {
        transform: scale(1);
      }
      to {
        transform: scale(1.01);
      }
    }
  }
`;

const SeedImgStyle = styled.div<{ isDynamic: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  img {
    width: 100%;
  }
  img.nft-img {
    position: absolute;
    left: 0;
    top: 0;
  }
  ${(props) => props.isDynamic && DynamicStyle}
`;
