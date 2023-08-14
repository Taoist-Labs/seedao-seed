import styled from "@emotion/styled";
import GreyStarIcon from "assets/images/user/grey_star.svg";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import LevelStar from "components/svg/levelStar";

interface IProps {
  points: number;
  data: {
    level: number;
    minPoints: number;
    maxPointes: number;
    color: string;
  };
}

export default function LevelItem({ data, points }: IProps) {
  const { t } = useTranslation();
  const isCurrent = useMemo(() => {
    if (data.maxPointes === -1 && points >= data.minPoints) {
      return true;
    }
    return points >= data.minPoints && points <= data.maxPointes;
  }, [points, data]);

  const { leftPoints, percent } = useMemo(() => {
    if (isCurrent) {
      return {
        leftPoints: data.maxPointes - points + 1,
        percent: Math.floor(
          ((points - data.minPoints) * 100) /
            (data.maxPointes - data.minPoints),
        ),
      };
    } else {
      return {
        leftPoints: 0,
        percent: 0,
      };
    }
  }, [isCurrent, points, data]);

  return isCurrent ? (
    <ActiveLevelStyle>
      <LeftPart>
        <span>L{data.level}</span>
        <LevelStar color={data.color} />
      </LeftPart>
      {isCurrent && data.maxPointes !== -1 && (
        <RightPart>
          <div className="top">
            <span className="num">
              {t("user.levelProgress", {
                points: leftPoints,
                level: `L${data.level + 1}`,
              })}
            </span>
            <span className="percent">{percent}%</span>
          </div>
          <ProcessBar color={data.color} percent={percent}>
            <div className="inner" />
          </ProcessBar>
        </RightPart>
      )}
    </ActiveLevelStyle>
  ) : (
    <LevelItemStyle>
      <LevelStyle>
        <span>L{data.level}</span>
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
  font-family: "Inter-Bold";
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
    font-size: 16px;
  }
  .percent {
    font-family: "Inter-Bold";
  }
`;
interface IProcessProps {
  color: string;
  percent: number;
}
const ProcessBar = styled.div<IProcessProps>`
  width: 293px;
  height: 30px;
  border-radius: 36px;
  background: #d9d9d9;
  overflow: hidden;
  .inner {
    height: 100%;
    background-color: ${(props) => props.color};
    width: ${(props) => props.percent + "%"};
  }
`;
const LevelStyle = styled.div`
  font-size: 20px;
  font-family: "Inter-Bold";
  display: flex;
  align-items: center;
  gap: 2px;
  span {
    opacity: 0.2;
  }
`;
