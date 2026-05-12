import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./src/messages/en.json",
  },
});
const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default withNextIntl(nextConfig);
