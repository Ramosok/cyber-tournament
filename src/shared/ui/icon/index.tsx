import type { FC } from "react";

import spriteUrl from "./icon-sprites.svg";

type IconName =
  | "21"
  | "youtube"
  | "vk"
  | "instagram"
  | "tg"
  | "appStore"
  | "androidStore"
  | "ML"
  | "fast-forward"
  | "union"
  | "cross"
  | "success";

export type IconProps = {
  icon: IconName;
  width?: `${number}`;
  height?: `${number}`;
  className?: string;
};

export const Icon: FC<IconProps> = ({
  icon,
  width = "24",
  height = "24",
  className,
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <use href={`${spriteUrl}#${icon}`} />
    </svg>
  );
};
