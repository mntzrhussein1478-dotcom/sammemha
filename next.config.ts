import type {NextConfig} from 'next';
const csp=[
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
].join('; ');
const headers=[
  {key:'Content-Security-Policy',value:csp},
  {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
  {key:'X-Content-Type-Options',value:'nosniff'},
  {key:'X-Frame-Options',value:'DENY'},
  {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=()'},
  {key:'Cross-Origin-Opener-Policy',value:'same-origin'},
  {key:'Cross-Origin-Resource-Policy',value:'same-origin'},
  {key:'Strict-Transport-Security',value:'max-age=31536000; includeSubDomains'}
];
const nextConfig:NextConfig={reactStrictMode:true,poweredByHeader:false,async headers(){return[{source:'/(.*)',headers}]}};
export default nextConfig;
