import React from 'react';

export const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M5 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM5 15a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zM10 7a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zM15 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM15 15a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zM2 5a1 1 0 011-1h1a1 1 0 010 2H3a1 1 0 01-1-1zM2 10a1 1 0 011-1h1a1 1 0 010 2H3a1 1 0 01-1-1zM7 10a1 1 0 011-1h1a1 1 0 010 2H8a1 1 0 01-1-1zM12 10a1 1 0 011-1h1a1 1 0 010 2h-1a1 1 0 01-1-1zM17 5a1 1 0 011-1h1a1 1 0 010 2h-1a1 1 0 01-1-1z"/>
      <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4.08 5.49a6 6 0 119.84 0 6.002 6.002 0 01-9.84 0z" clipRule="evenodd"/>
    </svg>
);

export const LoaderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v3m0 12v3m9-9h-3m-12 0H3m16.5-6.5L19 8m-14 8l-1.5 1.5M19 16l-1.5-1.5M5 8l1.5-1.5" />
    </svg>
);

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const LayersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0h0M5 11h0" />
    </svg>
);

export const DiamondIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16" {...props}>
        <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05c-.58-.58-.58-1.519 0-2.098L6.95.435z" />
    </svg>
);

export const GridIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16" {...props}>
        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
    </svg>
);

export const CheckerboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16" {...props}>
        <path d="M0 0h8v8H0V0zm8 8h8v8H8V8z"/>
    </svg>
);

export const MagicWandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.475 2.118A2.25 2.25 0 0 1 .879 16.5a2.25 2.25 0 0 1 2.25-2.25 3 3 0 0 0 5.78-1.128c.15-.668.036-1.35.036-2.008 0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8c-1.583 0-3.044-.464-4.25-1.257l-.3-.187a3 3 0 0 0-2.662-1.158z" />
    </svg>
);

export const RefreshIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.18-3.185m-3.181-4.992l-3.182-3.182a8.25 8.25 0 00-11.664 0l-3.18 3.185" />
    </svg>
);

export const CrestIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
       <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5l-3.375-3.375M16.5 7.5V3.75m0 3.75H12.75m3.75 0L12 12m3.75-4.5V3.75m0 3.75h-3.75M12 12l-3.375 3.375M12 12v3.75m0-3.75H8.25m3.75 0L15.75 15m-3.75-3.75V8.25m0 3.75H8.25m3.75 3.75L8.25 15m3.75-3.75h3.75m-3.75 0l3.375 3.375M4.5 3.75l-1.5 1.5M4.5 3.75V2.25m0 1.5H6m-1.5 0L6 6M4.5 3.75v1.5m0-1.5H3m1.5 1.5L3 6m1.5-1.5h1.5m-1.5 0L6 2.25m-1.5 1.5v1.5m-1.5-1.5L2.25 6m1.5 13.5l1.5-1.5m-1.5 1.5v1.5m0-1.5H3m1.5 0L3 18m1.5 1.5v-1.5m0 1.5H6m-1.5-1.5L6 18m-1.5 1.5h1.5m-1.5 0L6 21.75m-1.5-1.5v-1.5m1.5 1.5L6 18m13.5-1.5l1.5 1.5m-1.5-1.5v1.5m0-1.5h1.5m-1.5 0l1.5 3m-1.5-1.5v-1.5m0 1.5H18m1.5-1.5l-1.5-1.5m1.5 1.5h-1.5m1.5 0l1.5-3m-1.5 1.5v-1.5m-1.5 1.5l-1.5-1.5m1.5-13.5l-1.5 1.5m1.5-1.5V2.25m0 1.5h-1.5m1.5 0l-3 1.5m1.5-1.5V2.25m0 1.5h-1.5m1.5-1.5l-1.5-1.5m-1.5 1.5H18m-1.5-1.5l-1.5 1.5" />
    </svg>
);

export const DotGridIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" {...props}>
        <circle cx="2" cy="2" r="2"/><circle cx="8" cy="2" r="2"/><circle cx="14" cy="2" r="2"/>
        <circle cx="2" cy="8" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="14" cy="8" r="2"/>
        <circle cx="2" cy="14" r="2"/><circle cx="8" cy="14" r="2"/><circle cx="14" cy="14" r="2"/>
    </svg>
);

export const StripeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" {...props}>
        <path d="M-2 1.5l10-10l3 3l-10 10l-3-3z"/>
        <path d="M4 11.5l10-10l3 3l-10 10l-3-3z"/>
        <path d="M10 17.5l10-10l3 3l-10 10l-3-3z"/>
    </svg>
);

export const PlaidIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" {...props}>
        <path d="M0 5h16v3H0z" opacity=".5"/>
        <path d="M5 0h3v16H5z" opacity=".5"/>
    </svg>
);

export const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
);

export const UnlinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244m-4.5-4.5l4.5-4.5" />
  </svg>
);

export const TextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
);

export const PatternIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
);

export const PODIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
);

export const FloralIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9C21 10.1 20.1 11 19 11C17.9 11 17 10.1 17 9C17 7.9 17.9 7 19 7C20.1 7 21 7.9 21 9ZM7 9C7 10.1 6.1 11 5 11C3.9 11 3 10.1 3 9C3 7.9 3.9 7 5 7C6.1 7 7 7.9 7 9ZM12 10C11.2 10 10.5 10.7 10.5 11.5C10.5 12.3 11.2 13 12 13C12.8 13 13.5 12.3 13.5 11.5C13.5 10.7 12.8 10 12 10ZM12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18ZM21 15C21 16.1 20.1 17 19 17C17.9 17 17 16.1 17 15C17 13.9 17.9 13 19 13C20.1 13 21 13.9 21 15ZM7 15C7 16.1 6.1 17 5 17C3.9 17 3 16.1 3 15C3 13.9 3.9 13 5 13C6.1 13 7 13.9 7 15Z"/>
    </svg>
);

export const PolkaDotsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <circle cx="6" cy="6" r="2"/>
        <circle cx="18" cy="6" r="2"/>
        <circle cx="12" cy="12" r="2"/>
        <circle cx="6" cy="18" r="2"/>
        <circle cx="18" cy="18" r="2"/>
    </svg>
);

export const FractalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M9 2L12 8L15 2L21 5L15 12L21 19L15 22L12 16L9 22L3 19L9 12L3 5L9 2Z"/>
    </svg>
);

export const MondrianIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M2 2V22H22V2H2ZM8 8H6V6H8V8ZM8 14H6V12H8V14ZM8 20H6V18H8V20ZM14 8H12V6H14V8ZM14 14H12V12H14V14ZM14 20H12V18H14V20ZM20 8H18V6H20V8ZM20 14H18V12H20V14ZM20 20H18V18H20V20Z"/>
    </svg>
);
