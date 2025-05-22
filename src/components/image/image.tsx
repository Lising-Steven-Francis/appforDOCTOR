'use client';

import type { UseInViewOptions } from 'framer-motion';
import type { Theme, SxProps } from '@mui/material/styles';

import NextImage from 'next/image';
import { useInView } from 'framer-motion';
import Skeleton from '@mui/material/Skeleton';
import { mergeRefs, mergeClasses } from 'minimal-shared/utils';
import { useRef, useState, useCallback, startTransition } from 'react';

import { imageClasses } from './classes';
import { ImageRoot, ImageOverlay } from './styles';

import type { EffectsType, ImagePlaceholder } from './styles';

type AspectRatioType =
  | '2/3' | '3/2' | '4/3' | '3/4' | '6/4' | '4/6'
  | '16/9' | '9/16' | '21/9' | '9/21' | '1/1'
  | string;

export type ImageProps = React.ComponentProps<typeof ImageRoot> & {
  src?: string;
  alt?: string;
  delayTime?: number;
  onLoad?: () => void;
  effect?: EffectsType;
  visibleByDefault?: boolean;
  disablePlaceholder?: boolean;
  viewportOptions?: UseInViewOptions;
  ratio?: AspectRatioType | Partial<Record<string, AspectRatioType>>;
  slotProps?: {
    img?: Omit<React.ComponentProps<'img'>, 'src' | 'alt' | 'width' | 'height'> & {
      width?: number;
      height?: number;
    };
    overlay?: React.ComponentProps<typeof ImageOverlay>;
    placeholder?: React.ComponentProps<typeof ImagePlaceholder>;
  };
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  skeletonHeight?: number | string;
  sx?: SxProps<Theme>;
};

const DEFAULT_DELAY = 0;
const DEFAULT_EFFECT: EffectsType = {
  style: 'blur',
  duration: 300,
  disabled: false,
};

export function Image({
  sx,
  src,
  alt = '',
  ratio,
  ref,
  onLoad,
  effect,
  fill,
  sizes,
  priority,
  delayTime = DEFAULT_DELAY,
  className,
  visibleByDefault = false,
  disablePlaceholder = false,
  viewportOptions,
  slotProps,
  ...other
}: ImageProps) {
  const localRef = useRef<HTMLSpanElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const isInView = useInView(localRef, {
    once: true,
    ...viewportOptions,
  });

  const handleImageLoad = useCallback(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setIsLoaded(true);
        onLoad?.();
      });
    }, delayTime);

    return () => clearTimeout(timer);
  }, [delayTime, onLoad]);

  const finalEffect = { ...DEFAULT_EFFECT, ...effect };
  const shouldRenderImage = visibleByDefault || isInView;
  const showSkeleton = !visibleByDefault && !isLoaded && !disablePlaceholder;

  const resolvedSx = Array.isArray(sx) ? Object.assign({}, ...sx) : sx || {};
  const fixedHeight = resolvedSx?.height === 1 ? '100%' : resolvedSx?.height;

  const cleanedSx = Array.isArray(sx)
    ? sx.map((style) =>
        typeof style === 'object' && style?.height === 1
          ? { ...style, height: '100%' }
          : style
      )
    : typeof resolvedSx === 'object' && resolvedSx?.height === 1
    ? [{ ...resolvedSx, height: '100%' }]
    : [resolvedSx];

  const isUsingFill = !!fill || !!ratio;

  const fallbackWidth = (slotProps?.img?.width as number) ?? 800;
  const fallbackHeight = (slotProps?.img?.height as number) ?? 600;

  return (
    <ImageRoot
      ref={mergeRefs([localRef, ref])}
      effect={visibleByDefault || finalEffect.disabled ? undefined : finalEffect}
      className={mergeClasses([imageClasses.root, className], {
        [imageClasses.state.loaded]: !visibleByDefault && isLoaded,
      })}
      sx={[
        {
          ...(isUsingFill && { position: 'relative' }),
          '--aspect-ratio': ratio,
          ...(!!ratio && { width: 1 }),
        },
        ...cleanedSx,
      ]}
      {...other}
    >
      {slotProps?.overlay && (
        <ImageOverlay className={imageClasses.overlay} {...slotProps.overlay} />
      )}

      {showSkeleton && (
        <Skeleton
          animation="wave"
          variant="rectangular"
          width="100%"
          height={fixedHeight ?? '100%'}
          className={imageClasses.placeholder}
          {...slotProps?.placeholder}
        />
      )}

      {shouldRenderImage && src && (
        <NextImage
          src={src}
          alt={alt}
          priority={priority}
          sizes={sizes ?? '100vw'}
          fill={isUsingFill}
          width={!isUsingFill ? fallbackWidth : undefined}
          height={!isUsingFill ? fallbackHeight : undefined}
          onLoad={handleImageLoad}
          className={imageClasses.img}
          style={{
            ...(isUsingFill
              ? { objectFit: 'cover' }
              : {
                  width: '100%',
                  height: fixedHeight ?? 'auto',
                  objectFit: 'cover',
                  display: 'block',
                }),
            ...(slotProps?.img?.style || {}),
          }}
          {...slotProps?.img}
        />
      )}
    </ImageRoot>
  );
}
