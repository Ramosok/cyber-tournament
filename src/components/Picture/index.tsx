import type { CSSProperties, FC } from "react";

import styles from "./picture.module.css";

export type PictureSource = {
  readonly srcSet: string;
  readonly media?: string;
  readonly type?: string;
  readonly sizes?: string;
};

export type PictureProps = {
  readonly src: string;
  readonly alt?: string;
  readonly sources?: readonly PictureSource[];
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly loading?: "lazy" | "eager";
  readonly fetchPriority?: "high" | "low" | "auto";
};

export const Picture: FC<PictureProps> = ({
  src,
  alt = "",
  sources = [],
  className,
  style,
  loading = "lazy",
  fetchPriority = "auto",
}) => {
  return (
    <picture className={className} style={style}>
      {sources.map((source) => (
        <source
          key={source.srcSet}
          srcSet={source.srcSet}
          media={source.media}
          type={source.type}
          sizes={source.sizes}
        />
      ))}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={styles.img}
      />
    </picture>
  );
};
