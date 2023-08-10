import styled from "@emotion/styled";
import { CenterBox } from "style";
import { FQA_LIST } from "data/fqa";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useTranslation } from "react-i18next";

const QuestionItem = ({ data }: { data: { name: string; answer: any } }) => {
  const [content, setContent] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const readMd = (_path: string) => {
      fetch(_path)
        .then((res) => res.text())
        .then((text) => setContent(text));
    };
    readMd(data.answer);
  }, []);

  return (
    <QuestionItemStyle>
      <div className="q" onClick={() => setShow(!show)}>
        <span className="name">{data.name}</span>
        {show ? <RemoveIcon /> : <AddIcon />}
      </div>
      {show && (
        <div className="answer">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </QuestionItemStyle>
  );
};

export default function FQA({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <FQAStyle color={color}>
      <CenterBox>
        <Title>FQA</Title>
        <div className="question-box">
          {FQA_LIST.map((q, i) => (
            <QuestionItem key={i} data={q} />
          ))}
        </div>
        <div className="subject">{t("home.sgnRelated")}</div>
        <div className="question-box">
          {FQA_LIST.map((q, i) => (
            <QuestionItem key={i} data={q} />
          ))}
        </div>
        <a
          className="more"
          href="https://www.notion.so/seedao/Seed-FQA-282e394974db4c87a6031ebe85203a8e?pvs=4"
          target="_blank"
          rel="noreferrer"
        >
          {t("home.moreQuestions")}
        </a>
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
  .question-box {
    display: flex;
    flex-direction: column;
    gap: 17px;
  }
  .subject {
    font-size: 18px;
    font-weight: 700;
    margin-top: 17px;
    margin-bottom: 38px;
    text-align: center;
    color: #000;
  }
  .more {
    font-size: 20px;
    font-weight: 700;
    color: #000;
    margin-top: 43px;
    display: block;
    text-align: center;
  }
`;

const Title = styled.div`
  text-align: center;
  font-family: Inter;
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 50px;
  margin-bottom: 17px;
`;

const QuestionItemStyle = styled.li`
  list-style: none;
  font-size: 18px;

  .q {
    cursor: pointer;
    line-height: 50px;
    height: 50px;
    padding-inline: 10px;
    border-bottom: 1px solid #000;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .name {
      font-size: 18px;
      line-height: 30px;
    }
  }
  .answer {
    margin-top: 17px;
    padding: 10px;
    line-height: 30px;
  }
`;
