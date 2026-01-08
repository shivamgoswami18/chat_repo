import { routePath } from "@/components/constants/RoutePath";
import { redirect } from "next/navigation";

export default function Home() {
  redirect(routePath.home);
}
