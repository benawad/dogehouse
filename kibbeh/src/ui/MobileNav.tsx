import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export interface MobileNavContainerProps {
  className?: string;
}

export const MobileNavContainer: React.FC<MobileNavContainerProps> = ({
  className,
  children,
}) => {
  return (
    <div
      className={`fixed md:hidden  inset-x-0 flex justify-around items-center bottom-0 w-full h-7 bg-primary-900 border-t border-primary-700 ${className}`}
    >
      {children}
    </div>
  );
};

export interface MobileNavItemProps {
  targetPath: string;
}

export const MobileNavItem: React.FC<MobileNavItemProps> = ({
  children,
  targetPath,
}) => {
  const router = useRouter();
  console.log(router);
  const isActive = router.pathname.includes(targetPath);

  return (
    <Link href={targetPath}>
      <div className="cursor-pointer">
        {children &&
          React.Children.map(children, (child) => {
            return React.cloneElement(child as React.ReactElement, {
              fill: isActive
                ? "var(--color-accent)"
                : "var(--color-primary-100)",
            });
          })}
      </div>
    </Link>
  );
};

export interface NavItem {
  targetPath: string;
  icon: JSX.Element;
}

export interface MobileNavProps {
  items: NavItem[];
}

export const MobileNav: React.FC<MobileNavProps> = ({ items }) => {
  return (
    <MobileNavContainer>
      {items.map((item) => {
        return (
          <MobileNavItem targetPath={item.targetPath}>
            {item.icon}
          </MobileNavItem>
        );
      })}
    </MobileNavContainer>
  );
};
