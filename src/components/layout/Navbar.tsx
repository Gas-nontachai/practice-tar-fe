import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  to: string;
};

type NavbarProps = {
  navLinks: NavLink[];
};

const Navbar = ({ navLinks }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap  bg-clip-text text-black">
            Example
          </span>
        </Link>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-controls="navbar-sticky"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
        <div
          className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;

              return (
                <li key={link.label}>
                  <Button
                    asChild
                    size="sm"
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start md:w-auto md:justify-center",
                      isActive && "font-semibold",
                    )}
                  >
                    <Link
                      to={link.to}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
