import styled from "@emotion/styled";
import GreyStarIcon from "assets/images/user/grey_star.svg";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import LevelStar from "components/svg/levelStar";
import LevelStrokeStar from "components/svg/levelStrokeStar";

import { formatNumber } from "utils/index";

interface IProps {
  points: number;
  data: {
    level: number;
    minPoints: number;
    maxPoints: number;
    color: string;
  };
}

export default function LevelItem({ data, points }: IProps) {
  const { t } = useTranslation();
  const isCurrent = useMemo(() => {
    if (data.maxPoints === -1 && points >= data.minPoints) {
      return true;
    }
    return points >= data.minPoints && points <= data.maxPoints;
  }, [points, data]);

  const { leftPoints, percent } = useMemo(() => {
    if (isCurrent) {
      return {
        leftPoints: data.maxPoints - points + 1,
        percent: Math.floor(
          ((points - data.minPoints) * 100) /
            (data.maxPoints - data.minPoints + 1),
        ),
      };
    } else {
      return {
        leftPoints: 0,
        percent: 0,
      };
    }
  }, [isCurrent, points, data]);

  const isCurrentAndLast = useMemo(() => {
    return isCurrent && data.maxPoints === -1;
  }, [isCurrent, data.maxPoints]);

  if (isCurrentAndLast) {
    return (
      <ActiveLevelStyle>
        <RightPart style={{ marginLeft: 0, marginRight: "20px" }}>
          <div className="top">
            <span className="num">
              {t("home.points", {
                num: formatNumber(points),
              })}
            </span>
            <span className="percent">100%</span>
          </div>
          <ProcessBar color={data.color} percent={percent}>
            <div className="inner" />
          </ProcessBar>
        </RightPart>
        <LeftPart>
          <span>L{data.level}</span>
          {data.color === "#FFFFFF" ? (
            <LevelStrokeStar />
          ) : (
            <LevelStar color={data.color} />
          )}
        </LeftPart>
        <RightPart style={{ marginLeft: "15px" }}>
          <span className="max">Max</span>
        </RightPart>
      </ActiveLevelStyle>
    );
  }

  return isCurrent ? (
    <ActiveLevelStyle>
      <LeftPart>
        <span>L{data.level}</span>
        {data.color === "#FFFFFF" ? (
          <LevelStrokeStar />
        ) : (
          <LevelStar color={data.color} />
        )}
      </LeftPart>
      <RightPart>
        <div className="top">
          <span className="num">
            {t("user.levelProgress", {
              points: formatNumber(leftPoints),
              level: `L${data.level + 1}`,
            })}
          </span>
          <span className="percent">{percent}%</span>
        </div>
        <ProcessBar color={data.color} percent={percent}>
          <div className="inner" />
        </ProcessBar>
      </RightPart>
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
  align-items: center;
`;

const ActiveLevelStyle = styled.div`
  display: flex;
  align-items: center;
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
  position: relative;
  .top {
    position: absolute;
    top: -26px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 13px;
    font-size: 16px;
  }
  .percent {
    font-family: "Inter-Bold";
  }
  .max {
    font-size: 16px;
    font-weight: 700;
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
  box-sizing: border-box;
  border-radius: 36px;
  border: 1px solid #4b4b4b;
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
