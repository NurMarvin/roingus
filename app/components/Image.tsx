/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
export type ImageProps = {
  src: string;
  size?: number;
  alt?: string;
  nsfw?: boolean;
  className?: string;
};

export default function Image({
  src,
  size = 256,
  alt = "",
  nsfw = false,
  className,
}: ImageProps) {
  return (
    <picture>
      <source srcSet={src} />
      <img src={src} alt={alt} loading="lazy" className={className} />
    </picture>
  );
}
