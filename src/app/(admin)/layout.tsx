export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: no auth check here. This layout wraps BOTH /login and the
  // (protected) group, so redirecting to /login here would infinite-loop
  // on the login page itself. The real guard lives in
  // (admin)/(protected)/layout.tsx, which only wraps authenticated routes.
  return children;
}