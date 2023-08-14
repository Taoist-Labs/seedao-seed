import styled from "@emotion/styled";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Fade from "@mui/material/Fade";
import EmptyIcon from "assets/images/user/empty.svg";
import { useEffect, useState } from "react";

interface IProps {
  data: INFT;
  onClick?: (data: INFT) => void;
}

export default function NFTCard({ data, onClick }: IProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <NFTStyle xs={6} sm={3} onClick={() => onClick && onClick(data)}>
      <Fade in={show}>
        <div className={imgLoaded ? "" : "loading"}>
          <img src={EmptyIcon} alt="" />
          <img
            src={data.thumb}
            title={data.name}
            alt=""
            onLoad={() => setImgLoaded(true)}
            className="nft-img"
            style={{ visibility: imgLoaded ? "visible" : "hidden" }}
          />
          <Intro>{data.tokenId ? data.tokenIdFormat : data.name}</Intro>
        </div>
      </Fade>
    </NFTStyle>
  );
}

const NFTStyle = styled(Grid)`
  > div {
    position: relative;
    width: 100%;
  }
  img {
    width: 100%;
  }
  img.nft-img {
    position: absolute;
    left: 0;
    top: 0;
  }
`;

const Intro = styled.div`
  text-align: center;
  margin-top: 10px;
  color: #686666;
  font-size: 16px;
  font-family: "Inter-Medium";
  @media (max-width: 412px) {
    font-size: 12px;
  }
  margin-top: 5px;
  margin-bottom: 5px;
`;
