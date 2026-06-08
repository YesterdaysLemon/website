import { type RouteConfig, index, route } from "@react-router/dev/routes";

const routes = [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("projects", "routes/projects.tsx"),
  route("blog", "routes/blog.tsx"),
  route("blog/:slug", "routes/blog-post.tsx"),
  route("resume", "routes/resume.tsx"),
  route("healthz", "routes/healthz.ts"),
];

export default routes satisfies RouteConfig;
