import styled from "@emotion/styled";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
export default function SharePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const imgCode = searchParams.get("img");

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
        />
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
    img {
      width: 100%;
      display: block;
    }
  }
`;
