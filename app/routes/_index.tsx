import type { Route } from "./+types/_index";
import { loadAuthIndexRoute } from "~/modules/auth/infrastructure/public-auth-route-loader";

export const meta: Route.MetaFunction = () => [
  { title: "BidMart | Secure Bidding Platform" },
  { name: "description", content: "BidMart authentication portal for secure account access and settings management." },
];

export async function loader(args: Parameters<typeof loadAuthIndexRoute>[0]) {
  return loadAuthIndexRoute(args);
}

export default function Index() {
  return null;
}
