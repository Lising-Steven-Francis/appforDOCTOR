'use client';

import type { LinkProps } from '@mui/material/Link';

import { useId } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import { mergeClasses } from 'minimal-shared/utils';

import { logoClasses } from './classes';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export function Logo({
  sx,
  disabled,
  className,
  href = '/',
  isSingle = true,
  ...other
}: LogoProps) {
  useId(); // Keep for potential future use
  
  // Theme colors are kept in the component for potential future use
  // const theme = useTheme();
  // const TEXT_PRIMARY = theme.vars.palette.text.primary;
  // const PRIMARY_LIGHT = theme.vars.palette.primary.light;
  // const PRIMARY_MAIN = theme.vars.palette.primary.main;
  // const PRIMARY_DARKER = theme.vars.palette.primary.dark;

  // Using local logo file from public directory
  const singleLogo = (
    <Box
      component="img"
      alt="Single logo"
      src="/logo22.png"
      sx={{
        height: '100%',
        width: 'auto',
        maxWidth: '100%',
        objectFit: 'contain',
      }}
    />
  );

  const fullLogo = (
    <Box
      component="img"
      alt="Full logo"
      src="/logo22.png"
      sx={{
        height: '100%',
        width: 'auto',
        maxWidth: '100%',
        objectFit: 'contain',
      }}
    />
  );

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: 65,  // Increased from 50
          height: 65, // Increased from 50
          ...(!isSingle && { width: 160, height: 56 }), // Increased from 128x45
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {isSingle ? singleLogo : fullLogo}
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
