import Path from "./path";

const routes = [
  {
    path: Path.HOME,
    async lazy() {
      let { default: Home } = await import("../pages/Home");
      return { Component: Home };
    },
  },
  {
    path: Path.REGISTER,
    async lazy() {
      let { default: Register } = await import("../pages/Register");
      return { Component: Register };
    },
  },
  {
    path: Path.DASHBOARD,
    async lazy() {
      let { default: Dashboard } = await import("../pages/Dashboard");
      return { Component: Dashboard };
    },
  },
  {
    path: Path.PROFILE,
    async lazy() {
      let { default: Profile } = await import("../pages/Profile");
      return { Component: Profile };
    },
  },
  {
    path: Path.PROFILE + "/:username",
    async lazy() {
      let { default: ProfileSearch } = await import(
        "../pages/Profile/ProfileSearch"
      );
      return { Component: ProfileSearch };
    },
  },
  {
    path: Path.PROFILE + "/:username/chart",
    async lazy() {
      let { default: ProfileChart} = await import(
        "../pages/Profile/ProfileChart"
      );
      return { Component: ProfileChart};
    },
  },
];

export default routes;
