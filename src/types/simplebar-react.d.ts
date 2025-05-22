declare module 'simplebar-react' {
  import type { ComponentProps } from 'react';
  
  export interface Props extends ComponentProps<'div'> {
    scrollableNodeProps?: ComponentProps<'div'>;
    clickOnTrack?: boolean;
    fillContent?: boolean;
  }

  const SimpleBar: React.FC<Props>;
  export default SimpleBar;
} 