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
      className={`flex fixed inset-x-0 justify-around items-center bottom-0 w-full h-7 bg-primary-900 border-t border-primary-700 ${className}`}
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
  const isActive = router ? router.asPath.includes(targetPath) : false;

  return (
    <Link href={targetPath}>
      <div className="flex cursor-pointer">
        {children &&
          React.Children.map(children, (child) => {
            return React.cloneElement(child as React.ReactElement, {
              className: isActive
                ? "text-accent h-4 w-4"
                : "text-primary-100 h-4 w-4",
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
  const { asPath } = useRouter();

  if (asPath.startsWith("/room")) {
    return null;
  }

  return (
    <MobileNavContainer>
      {items.map((item) => {
        return (
          <MobileNavItem key={item.targetPath} targetPath={item.targetPath}>
            {item.icon}
          </MobileNavItem>
        );
      })}
    </MobileNavContainer>
  );
};
