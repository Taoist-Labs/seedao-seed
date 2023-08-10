import BackgroundIcon from "assets/images/attrs/background.svg";
import BodyIcon from "assets/images/attrs/body.svg";
import ClothIcon from "assets/images/attrs/cloth.svg";
import EarIcon from "assets/images/attrs/ear.svg";
import PolarisIcon from "assets/images/attrs/polarist.svg";
import HairIcon from "assets/images/attrs/hair.svg";
import SpecialIcon from "assets/images/attrs/special.svg";

interface IGalleryAttr {
  display: string;
  name: string;
  icon: string;
}
export const GALLERY_ATTRS: IGalleryAttr[] = [
  {
    display: "Cloth",
    name: "cloth",
    icon: ClothIcon,
  },
  {
    display: "Polaris",
    name: "polaris",
    icon: PolarisIcon,
  },
  {
    display: "Haire",
    name: "haire",
    icon: HairIcon,
  },
  {
    display: "Body",
    name: "body",
    icon: BodyIcon,
  },
  {
    display: "Ear",
    name: "ear",
    icon: EarIcon,
  },
  {
    display: "Background",
    name: "background",
    icon: BackgroundIcon,
  },
  {
    display: "Special",
    name: "special",
    icon: SpecialIcon,
  },
];
