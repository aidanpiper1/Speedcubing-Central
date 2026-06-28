import 'react';

// Permissive JSX typing for the cubing.js <twisty-player> custom element.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'twisty-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<HTMLElement>;
        background?: string;
        'control-panel'?: string;
        'hint-facelets'?: string;
        visualization?: string;
        puzzle?: string;
      };
    }
  }
}

export {};
