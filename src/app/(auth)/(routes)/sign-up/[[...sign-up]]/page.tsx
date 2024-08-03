import { SignUp } from "@clerk/nextjs";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign-up",
  description:
    ".Create an account to start enjoying our services and access exclusive features. Fill in your details, including your name, email address, and password, to set up your profile. Once registered, you'll be able to manage your preferences, track your activities, and receive personalized updates. Join us today to get started!  أنشئ حسابًا لبدء الاستفادة من خدماتنا والوصول إلى الميزات الحصرية. املأ بياناتك، بما في ذلك اسمك، عنوان بريدك الإلكتروني، وكلمة المرور، لإعداد ملفك الشخصي. بمجرد التسجيل، ستتمكن من إدارة تفضيلاتك، تتبع نشاطاتك، والحصول على تحديثات مخصصة. انضم إلينا اليوم للبدء!",
};

export default function Page() {
  return <SignUp />;
}
