import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import Navigation from "./common/components/navigation";
import { Settings } from "luxon";
import { makeSSRClient } from "./supa-client";
import { getUserById } from "./features/users/queries";
import { countNotifications } from "./features/users/queries";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  Settings.defaultLocale = "ko";
  Settings.defaultZone = "Asia/Seoul";
  return (
    <html lang="en" className="">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main className="px-20">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  if (user && user.id) {
    const profile = await getUserById(client, { id: user.id });
    const count = await countNotifications(client, { userId: user.id });
    return { user, profile, notificationsCount: count };
  }
  return { user: null, profile: null, notificationsCount: 0 };
};

export default function App({ loaderData }: Route.ComponentProps) {
  const { pathname } = useLocation();
  const isLoggedIn = loaderData.user !== null;
  return (
    <div className={pathname.includes("/auth/") ? "" : "py-28 px-5 md:px-20"}>
      {pathname.includes("/auth") ? null : (
        <Navigation
          isLoggedIn={isLoggedIn}
          username={loaderData.profile?.username}
          name={loaderData.profile?.name}
          avatar={loaderData.profile?.avatar}
          hasNotifications={loaderData.notificationsCount > 0}
          hasMessages={false}
        />
      )}
      <Outlet
        context={{
          isLoggedIn,
          name: loaderData.profile?.name,
          username: loaderData.profile?.username,
          avatar: loaderData.profile?.avatar,
        }}
      />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
