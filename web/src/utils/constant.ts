import BackgroundIcon from "assets/images/attrs/background.svg";
import BodyIcon from "assets/images/attrs/body.svg";
import ClothIcon from "assets/images/attrs/cloth.svg";
import EarIcon from "assets/images/attrs/ear.svg";
import PolarisIcon from "assets/images/attrs/polarist.svg";
import HairIcon from "assets/images/attrs/hair.svg";
import FaceIcon from "assets/images/attrs/face.svg";
import SpecialIcon from "assets/images/attrs/special.svg";

export const SELECT_WALLET = "SEEDAO_WALLET";

export const ATTR_ICON_MAP: { [k: string]: string } = {
  Background: BackgroundIcon,
  Body: BodyIcon,
  "Tai Chi Star": PolarisIcon,
  Head: HairIcon,
  Ear: EarIcon,
  Eyes: FaceIcon,
  Ring: EarIcon,
  Special: SpecialIcon,
  Style: ClothIcon,
};

// export const USE_NETWORK: "ETHEREUM" | "POLYGON" = "ETHEREUM";
export const USE_NETWORK: "ETHEREUM" | "POLYGON" | "SEPOLIA" = "ETHEREUM";
