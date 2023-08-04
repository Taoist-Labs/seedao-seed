import styled from "@emotion/styled";

export default function FQA({ color }: { color: string }) {
  return (
    <FQAStyle color={color}>
      <Title>FQA</Title>
    </FQAStyle>
  );
}

const FQAStyle = styled.section`
  padding: 80px 120px;
  background: ${(props) => props.color};
  @media (max-width: 960px) {
    padding: 60px 40px;
  }
`;

const Title = styled.div`
  text-align: center;
  font-family: Inter;
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 50px;
`;
