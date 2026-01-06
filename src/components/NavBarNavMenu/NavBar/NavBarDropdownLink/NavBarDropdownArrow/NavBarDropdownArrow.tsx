export type NavBarDropdownArrowProps = {
  className?: string;
  isHovered?: boolean;
};

const NavBarDropdownArrow: React.FC<NavBarDropdownArrowProps> = ({
  className,
  isHovered,
}) => {
  return (
    <figure
      className={`relative w-3 h-3 transition-transform duration-200 ${
        isHovered ? "rotate-180" : ""
      } ${className}`}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </figure>
  );
};

export default NavBarDropdownArrow;
