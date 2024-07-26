import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={`/`}>
      <Image width={130} height={130} src="/logo.svg" alt="logo" />
    </Link>
  );
};

export default Logo;
