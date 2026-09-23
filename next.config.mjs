/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,

  async headers() {
    // Next dev's HMR/react-refresh runtime relies on eval(); without
    // 'unsafe-eval' the CSP blocks it and every client component fails
    // to hydrate in `next dev`. Production builds don't need eval, so
    // this only loosens the policy locally, never in a deployed build.
    const isDev = process.env.NODE_ENV === "development";

    // Alta con Mercado Pago (/registro): API de omero-billing + SDK JS v2 / Card Payment Brick.
    const billingOrigin = (() => {
      try {
        return new URL(process.env.NEXT_PUBLIC_BILLING_API_URL || "http://localhost:8090").origin;
      } catch {
        return "";
      }
    })();
    const mpScript = "https://sdk.mercadopago.com https://http2.mlstatic.com";
    const mpConnect = "https://api.mercadopago.com https://*.mercadopago.com https://api.mercadolibre.com https://*.mercadolibre.com";
    const mpFrame = "https://*.mercadopago.com https://*.mercadolibre.com https://*.mercadolivre.com";
    const mpImg = "https://*.mlstatic.com https://*.mercadopago.com https://*.mercadolibre.com";
    const scriptSrc = [
      "'self'",
      "'unsafe-inline'",
      ...(isDev ? ["'unsafe-eval'"] : []),
      "https://www.googletagmanager.com",
      "https://connect.facebook.net",
      "https://static.hotjar.com",
      "https://script.hotjar.com",
      mpScript,
    ].join(" ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src ${scriptSrc}`,
              "style-src 'self' 'unsafe-inline'",
              `img-src 'self' data: https://www.google-analytics.com https://www.facebook.com https://www.hotjar.com ${mpImg}`,
              "font-src 'self'",
              `connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.facebook.com https://vars.hotjar.com https://in.hotjar.com ${billingOrigin} ${mpConnect}`,
              `frame-src https://vars.hotjar.com ${mpFrame}`,
            ].join("; "),
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // www → apex redirect (Vercel handles this via domain config but also useful as fallback)
      {
        source: "/(.*)",
        has: [{ type: "host", value: "www.omero.app" }],
        destination: "https://omero.app/:1",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
