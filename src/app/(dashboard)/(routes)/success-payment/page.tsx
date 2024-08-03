import SuccessPayment from "./_components/SuccessPayment";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Success Payment",
  description: `Explore a wide range of educational and training videos focused on trading. 
  We provide exclusive content that includes trading strategies, technical analysis, and investment opportunities. 
  Stay updated with the latest market trends and strategies through our regularly updated videos, 
  designed to help you achieve your financial goals effectively. 
  اكتشف مجموعة متنوعة من الفيديوهات التعليمية والتدريبية المتخصصة في التداول. 
  نقدم لك محتوى مميزاً يشمل استراتيجيات التداول، التحليل الفني، والفرص الاستثمارية. 
  تابع أحدث الاتجاهات واستراتيجيات السوق مع فيديوهاتنا المتجددة التي تساعدك على تحقيق أهدافك المالية بفعالية.`,
};

const SuccessPage = () => {
  return <SuccessPayment />;
};

export default SuccessPage;
