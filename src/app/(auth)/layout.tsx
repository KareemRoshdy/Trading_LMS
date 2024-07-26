import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication",
};

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center">{children}</div>
  );
};

export default AuthLayout;
