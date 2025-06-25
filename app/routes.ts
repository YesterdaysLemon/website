import { type RouteConfig, index, route } from "@react-router/dev/routes";


const routes = [
  index("routes/home.tsx"),
  route("contact", "routes/contact.tsx" ),
];

export default routes satisfies RouteConfig;
