import { useState } from "react";
import styled from "@emotion/styled";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const GoodItem = () => {
  return (
    <GoodStyle xs={6} sm={3}>
      <img
        src="https://i.seadn.io/gcs/files/2cc49c2fefc90c12d21aaffd97de48df.png?auto=format&dpr=1&w=750"
        alt=""
      />
      <Intro>
        <Typography gutterBottom variant="h6" component="div">
          T-shirt
        </Typography>
        <Button variant="contained">Buy</Button>
      </Intro>
    </GoodStyle>
  );
};

export default function ShopPage() {
  const [list] = useState(new Array(10).fill(0));
  return (
    <ShopPageStyle>
      <ItemsList container spacing={4}>
        {list.map((_, idx) => (
          <GoodItem key={idx} />
        ))}
      </ItemsList>
    </ShopPageStyle>
  );
}

const ShopPageStyle = styled.div`
  width: 100%;
  height: 100%;
  padding: 40px 60px;
  box-sizing: border-box;
`;

const ItemsList = styled(Grid)``;

const GoodStyle = styled(Grid)`
  img {
    width: 100%;
  }
`;

const Intro = styled.div`
  text-align: center;
`;
