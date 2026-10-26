import { redirect } from "next/navigation";

// Statistics is staff-only now; old links land on the login-protected page.
export default function StatisticsRedirect({ params: { locale } }: { params: { locale: string } }) {
  redirect(`/${locale}/internal/statistics`);
}
