"use session";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  NavbarMenu,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { LogOut, UserCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, SearchIcon, Logo } from "@/components/icons";

type NavBarProps = {
  user: {
    name: string;
    email: string;
    id: string;
  };
};

export const Navbar = ({ user }: NavBarProps) => {
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["shift"]}>
          k
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );
  const router = useRouter();

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink
            className="flex justify-start items-center gap-1"
            href={user ? "/dash" : "/"}
          >
            <Logo />
            <p className="font-bold text-inherit">Team Planner</p>
          </NextLink>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {(!user ? siteConfig.navItems : siteConfig.authNavItems).map(
            (item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ),
          )}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.github} title="GitHub">
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        {/* <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem> */}
        <NavbarItem className="hidden md:flex">
          {!user ? (
            <Button
              as={Link}
              className="text-sm font-normal text-default-600 bg-default-100"
              href="/login"
              startContent={<UserCircle className="text-primary" />}
              variant="flat"
            >
              Login
            </Button>
          ) : (
            <Button
              // as={Link}
              startContent={<LogOut className="text-primary" />}
              variant="flat"
              className="text-sm font-normal text-default-600 bg-default-100"
              // href="/login"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {/* {searchInput} */}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {(!user ? siteConfig.navItems : siteConfig.authNavItems).map(
            (item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link color="foreground" href={item.href} size="lg">
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ),
          )}
        </div>
        <NavbarItem>
          {!user ? (
            <Button
              as={Link}
              className="text-sm font-normal text-default-600 bg-default-100"
              href="/login"
              startContent={<UserCircle className="text-primary" />}
              variant="flat"
            >
              Login
            </Button>
          ) : (
            <Button
              className="text-sm font-normal text-default-600 bg-default-100"
              startContent={<LogOut className="text-primary" />}
              variant="flat"
              onClick={() => {
                signOut({
                  redirect: false,
                });
                router.push("/");
              }}
            >
              Logout
            </Button>
          )}
        </NavbarItem>
      </NavbarMenu>
    </NextUINavbar>
  );
};
