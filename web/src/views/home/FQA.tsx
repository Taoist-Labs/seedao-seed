import styled from "@emotion/styled";
import { CenterBox } from "style";
import { FQA_LIST_ZH, FQA_LIST_EN, SGN_FQA_LIST } from "data/fqa";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import Fade from "@mui/material/Fade";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useTranslation } from "react-i18next";
import DiscordIcon from "assets/images/home/discord.svg";
import TwitterIcon from "assets/images/home/twitter.svg";
import OpenseaIcon from "assets/images/home/opensea.svg";

interface IProps {
  idx: number;
  data: { name: string; answer: any };
  onHandle: (idx: number, v: boolean) => void;
  expandIdx?: number;
}

const QuestionItem = ({ idx, data, onHandle, expandIdx }: IProps) => {
  const [content, setContent] = useState("");
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(!show);
    onHandle(idx, !show);
  };

  useEffect(() => {
    const readMd = (_path: string) => {
      fetch(_path)
        .then((res) => res.text())
        .then((text) => setContent(text));
    };
    readMd(data.answer);
  }, [data]);

  useEffect(() => {
    setShow(idx === expandIdx);
  }, [expandIdx]);

  return (
    <QuestionItemStyle>
      <div className="q" onClick={handleClick}>
        <span className="name">{data.name}</span>
        {show ? <RemoveIcon className="btn" /> : <AddIcon className="btn" />}
      </div>
      {show && (
        <Fade in={true}>
          <div className="answer">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </Fade>
      )}
    </QuestionItemStyle>
  );
};

export default function FQA({ color }: { color: string }) {
  const { t, i18n } = useTranslation();
  const [expandIdx, setExpandIdx] = useState<number>();
  const [sgnExpandIdx, setSgnExpandIdx] = useState<number>();

  return (
    <FQAStyle color={color}>
      <CenterBox>
        <Title>FAQ</Title>
        <div className="question-box">
          {(i18n.language === "zh" ? FQA_LIST_ZH : FQA_LIST_EN).map((q, i) => (
            <QuestionItem
              key={i}
              data={q}
              idx={i}
              onHandle={(idx, v) => setExpandIdx(v ? idx : undefined)}
              expandIdx={expandIdx}
            />
          ))}
        </div>
        {i18n.language === "zh" && (
          <>
            <div className="subject">{t("home.sgnRelated")}</div>
            <div className="question-box">
              {SGN_FQA_LIST.map((q, i) => (
                <QuestionItem
                  key={i}
                  data={q}
                  idx={i}
                  onHandle={(idx, v) => setSgnExpandIdx(v ? idx : undefined)}
                  expandIdx={sgnExpandIdx}
                />
              ))}
            </div>
          </>
        )}

        <a
          className="more"
          href="https://seedao.notion.site/Seed-FQA-282e394974db4c87a6031ebe85203a8e"
          target="_blank"
          rel="noreferrer"
        >
          {t("home.moreQuestions")}
        </a>
        <SocialBox>
          <a
            href="https://discord.gg/seedao"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={DiscordIcon} alt="" />
          </a>
          <a
            href="https://twitter.com/see_dao"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={TwitterIcon} alt="" />
          </a>
          <a
            href="https://opensea.io/collection/seedao-seed"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={OpenseaIcon} alt="" />
          </a>
        </SocialBox>
      </CenterBox>
    </FQAStyle>
  );
}

const FQAStyle = styled.section`
  padding: 80px 120px;
  background: ${(props) => props.color};
  color: #444936;
  @media (max-width: 960px) {
    padding: 60px 40px;
  }
  @media (max-width: 750px) {
    padding: 60px 30px;
  }
  .question-box {
    display: flex;
    flex-direction: column;
    gap: 17px;
  }
  .subject {
    font-size: 18px;
    font-family: "Inter-Bold";
    margin-block: 38px;
    text-align: center;
    color: #000;
  }
  .more {
    font-size: 20px;
    font-family: "Inter-Bold";
    color: #000;
    margin-top: 43px;
    display: block;
    text-align: center;
  }
  @media (max-width: 414px) {
    padding: 40px 15px;
    .subject {
      font-size: 12px;
      margin-top: 32px;
      margin-bottom: 12px;
    }
    .more {
      display: none;
    }
  }
`;

const Title = styled.div`
  text-align: center;
  font-family: Inter;
  font-size: 48px;
  font-style: normal;
  font-family: "Inter-Bold";
  line-height: 50px;
  margin-bottom: 17px;
  color: #000;
  @media (max-width: 414px) {
    font-size: 24px;
  }
`;

const QuestionItemStyle = styled.li`
  list-style: none;
  font-size: 18px;

  .q {
    cursor: pointer;
    height: 50px;
    line-height: 50px;
    padding-inline: 10px;
    border-bottom: 1px solid #000;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .name {
      font-size: 18px;
      line-height: 30px;
    }
    .btn {
      color: #000;
    }
  }
  .answer {
    margin-top: 17px;
    padding: 10px;
    line-height: 30px;
    p {
      margin-bottom: 10px;
      &:last-of-type {
        margin-bottom: 0;
      }
    }
    ul li {
      list-style: disc;
    }
    a {
      text-decoration: underline;
      color: unset;
    }
  }
  @media (max-width: 750px) {
    .q {
      height: unset;
      line-height: 30px;
    }
  }
  @media (max-width: 414px) {
    .q {
      .name {
        font-size: 12px;
      }
      .btn {
        font-size: 16px;
      }
    }
    .answer {
      font-size: 12px;
      line-height: 22px;
      margin-top: 0;
    }
  }
`;

const SocialBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  margin-top: 17px;
  height: 240px;
  @media (max-width: 750px) {
    margin-top: 64px;
    height: unset;
  }
  @media (max-width: 414px) {
    gap: 33px;
    img {
      width: 25px;
    }
    margin-top: 32px;
  }
`;
