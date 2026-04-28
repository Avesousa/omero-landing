/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
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
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://static.hotjar.com https://script.hotjar.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://www.google-analytics.com https://www.facebook.com https://www.hotjar.com",
              "font-src 'self'",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.facebook.com https://vars.hotjar.com https://in.hotjar.com",
              "frame-src https://vars.hotjar.com",
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
