import { NavLink } from "@/components";

export type NavBarDropdownMenuProps = {
  className?: string;
  subLinks: { text: string; href: string; newTab: boolean }[];
};

const NavBarDropdownMenu: React.FC<NavBarDropdownMenuProps> = ({
  className,
  subLinks,
}) => {
  return (
    <div
      className={`
        z-30 absolute top-full left-1/2 flex flex-col
        w-min pl-3 pr-4 pt-1 pb-3 bg-gray -translate-x-1/2
        ${className}
      `}
    >
      {/* Sublinks */}
      {subLinks.map((subLink, index) => (
        <NavLink
          className="h-full text-[13px] z-40 py-2 text-nowrap"
          key={index}
          href={subLink.href}
          target={subLink.newTab ? "_blank" : "_self"}
        >
          {subLink.text}
        </NavLink>
      ))}
    </div>
  );
};

export default NavBarDropdownMenu;
