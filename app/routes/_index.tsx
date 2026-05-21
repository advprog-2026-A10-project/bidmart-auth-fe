import { loadAuthIndexRoute } from "~/modules/auth/infrastructure/public-auth-route-loader";

export async function loader(args: Parameters<typeof loadAuthIndexRoute>[0]) {
  return loadAuthIndexRoute(args);
}

export default function Index() {
  return null;
}
