import Image from "next/image";

interface Props {
  size?: number;
  className?: string;
}

export function LogoBadge({ size = 36, className = "" }: Props) {
  return (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
      <Image
        src="/logo-icon.png"
        alt="ICHAB logo"
        width={size}
        height={size}
        className="object-contain w-full h-full"
        priority
      />
    </div>
  );
}
