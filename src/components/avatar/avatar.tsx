'use client';

import type { AvatarProps as MUIAvatarProps } from '@mui/material/Avatar';

import Image from 'next/image';
import MUIAvatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import { useMemo, useState, useEffect } from 'react';

export type AvatarProps = MUIAvatarProps & {
  priority?: boolean;
  size?: number;
};

export function Avatar({
  src,
  alt = '',
  children,
  size = 40,
  priority = false,
  sx,
  ...rest
}: AvatarProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  const fallback = useMemo(() => {
    if (children) return children;
    return alt?.charAt(0)?.toUpperCase() || '?';
  }, [alt, children]);

  const resolvedSx = Array.isArray(sx) ? Object.assign({}, ...sx) : sx || {};
  const fixedWidth = resolvedSx?.width === 1 ? '100%' : resolvedSx?.width ?? size;
  const fixedHeight = resolvedSx?.height === 1 ? '100%' : resolvedSx?.height ?? size;

  const displayImage = !!src && typeof src === 'string' && src !== '';

  return (
    <MUIAvatar
      src={undefined}
      alt={alt}
      sx={{
        width: fixedWidth,
        height: fixedHeight,
        fontSize: Number(fixedHeight) * 0.5 || 16,
        position: 'relative',
        overflow: 'hidden',
        p: 0,
        // bgcolor: displayImage && !loaded ? 'transparent' : undefined,
        bgcolor: displayImage ? 'transparent' : undefined, // 🛠 FIXED

        ...sx,
      }}
      {...rest}
    >
      {displayImage && (
        <>
          {!loaded && (
            <Skeleton
              variant="circular"
              width="100%"
              height="100%"
              animation={false}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
                bgcolor: (theme) => theme.palette.grey[300],
              }}
            />
          )}

          <Image
            src={src}
            alt={alt}
            width={Number(fixedWidth) || size}
            height={Number(fixedHeight) || size}
            priority={priority}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              display: 'block',
            }}
          />
        </>
      )}

      {/* ✅ This line is the fix */}
      {!displayImage && !loaded && fallback}
    </MUIAvatar>
  );
}
