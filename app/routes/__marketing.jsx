import { Outlet } from "@remix-run/react";
import MainHeader from "~/components/navigation/MainHeader";
import marketingPageStyles from "~/styles/marketing.css";

export default function MarketingLayout() {
  return (
    <>
      <MainHeader />
      <Outlet />
    </>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: marketingPageStyles }];
}
