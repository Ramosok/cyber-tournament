import type { CSSProperties, FC } from "react";

import styles from "./picture.module.css";

type PictureProps = {
  src: string;
  alt?: string;
  sources?: {
    srcSet: string;
    media?: string;
    type?: string;
    sizes?: string;
  }[];
  className?: string;
  style?: CSSProperties;
  loading?: "lazy" | "eager";
};

export const Picture: FC<PictureProps> = ({
  src,
  alt = "",
  sources = [],
  className,
  style,
  loading = "lazy",
}) => {
  return (
    <picture className={className} style={style}>
      {sources.map((source) => (
        <source
          key={Math.random()}
          srcSet={source.srcSet}
          media={source.media}
          type={source.type}
          sizes={source.sizes}
        />
      ))}
      <img src={src} alt={alt} loading={loading} className={styles.img} />
    </picture>
  );
};
