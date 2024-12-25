export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Team Planner",
  description: "Gerencie as reuniões do seu time.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Sobre",
      href: "/about",
    },
  ],
  authNavItems: [
    {
      label: "Dashboard",
      href: "/dash",
    },
    {
      label: "Usuários",
      href: "/users",
      isAdmin: true,
    },
    {
      label: "Reuniões",
      href: "/meets",
    },
  ],
  links: {
    github: "https://github.com/the-murer",
  },
};
