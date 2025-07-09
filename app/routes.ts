import { type RouteConfig, index, route } from "@react-router/dev/routes";

const routes = [
  index("routes/home.tsx"),
  route("projects", "routes/projects.tsx"),
  route("resume", "routes/resume.tsx"),
];

export default routes satisfies RouteConfig;
