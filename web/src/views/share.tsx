import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import LoaderIcon from "assets/images/loader.svg";

export default function SharePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const imgCode = searchParams.get("img");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!imgCode) {
      console.log("imgCode is null");
      navigate("/");
    }
  }, [imgCode]);
  return (
    <SharePageStyled>
      <div className="content">
        <img
          src={`https://image-share.fn-labs.workers.dev/${imgCode}.png`}
          alt=""
          className="img"
          onLoad={() => setLoaded(true)}
          style={{ visibility: loaded ? "visible" : "hidden" }}
        />
        {!loaded && <img src={LoaderIcon} alt="" className="icon" />}
      </div>
    </SharePageStyled>
  );
}

const SharePageStyled = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .content {
    width: 375px;
    border: 8px solid #fff;
    background: #f9d9fb;
    .img {
      width: 100%;
      display: block;
    }
  }
  .icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    animation: spin 2.5s linear infinite;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
