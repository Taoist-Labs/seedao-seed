import styled from "@emotion/styled";
import GreyStarIcon from "assets/images/user/grey_star.svg";
import RedStarIcon from "assets/images/user/red_star.svg";

interface IProps {
  isCurrent: boolean;
  level: number;
}

export default function LevelItem({ isCurrent, level }: IProps) {
  return isCurrent ? (
    <ActiveLevelStyle>
      <LeftPart>
        <span>L{level}</span>
        <img src={RedStarIcon} alt="" />
      </LeftPart>
      <RightPart>
        <div className="top">
          <span className="num">
            链上积分 <strong>0,000</strong> / 50,000
          </span>
          <span className="percent">50%</span>
        </div>
        <ProcessBar>
          <div className="inner" style={{ width: "50%" }} />
        </ProcessBar>
      </RightPart>
    </ActiveLevelStyle>
  ) : (
    <LevelItemStyle>
      <LevelStyle>
        <span>L{level}</span>
        <img src={GreyStarIcon} alt="" />
      </LevelStyle>
    </LevelItemStyle>
  );
}

const LevelItemStyle = styled.div`
  display: flex;
  align-items: end;
`;

const ActiveLevelStyle = styled.div`
  display: flex;
  align-items: end;
`;
const LeftPart = styled.div`
  font-size: 48px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 7px;
`;
const RightPart = styled.div`
  margin-left: 20px;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 13px;
    font-family: DM Sans;
    font-size: 16px;
  }
`;
const ProcessBar = styled.div`
  width: 293px;
  height: 30px;
  border-radius: 36px;
  background: #d9d9d9;
  overflow: hidden;
  .inner {
    height: 100%;
    background-color: #f82427;
  }
`;
const LevelStyle = styled.div`
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 2px;
  span {
    opacity: 0.2;
  }
`;
