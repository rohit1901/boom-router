<div align="center">
  <img src="assets/boom-router.logo.svg" width="80" alt="Boom Router — a minimalistic React router" />
</div>

<br />
<div align="center">
  <a href="https://npmjs.org/package/boom-router"><img alt="npm" src="https://img.shields.io/npm/v/boom-router.svg?color=purple&labelColor=ffded5" /></a>
</div>
<div align="center">
  <b>boom-router</b> is a tiny router for modern React apps that relies on Hooks. <br />
</div>

## Features

- Only essential dependencies, just **2.1 KB** gzipped vs 18.7KB
  [React Router](https://github.com/ReactTraining/react-router).
- Unpacked Size is **280 KB** vs **810 KB** [React Router](hhttps://github.com/ReactTraining/react-router).
- **Fully optional** top-level `<Router />` component.
- Familiar components: **[`Route`](#route-pathpattern-)**, **[`Link`](#link-hrefpath-)**,
  **[`Switch`](#switch-)** and **[`Redirect`](#redirect-topath-)**.
- Hook-based API:
  **[`useLocation`](#uselocation-working-with-the-history)**,
  **[`useRoute`](#useroute-route-matching-and-parameters)** and
  **[`useRouter`](#userouter-accessing-the-router-object)**.

## Installation

```bash
npm i boom-router
```

Check out this [simple demo app](https://github.com/rohit1901/react-boilerplate). It uses boom-router and has a minimalistic setup.

```js
import { Link, Route, Switch } from "boom-router";

const App = () => (
        <>
          <Link href="/users/1">User Profile</Link>
          <Route path="/about">About</Route>
          <Switch>
            <Route path="/mail" component={InboxPage} />
            <Route path="/users/:name">{(params) => <>Ssup, {params.name}?</>}</Route>
            <Route>404: Page not found!</Route>
          </Switch>
        </>
);

```

### Browser Support

Supports **ES2020+**. For older browsers, transpile node_modules. Minimum TypeScript version: 4.1.

## Boom Router API

`boom-router` provides three APIs: **standalone location hooks**, **routing and pattern matching hooks**, and a **component-based API** similar to 
React Router.

Choose the one that fits your needs:

- For a compact application without pattern matching, use location hooks.
- To create custom routing components, use routing hooks.
- For traditional applications with pages and navigation, use the component-based API.

Check out the [FAQ and Code Recipes](#faq-and-code-recipes) for advanced topics like active links, default routes, and server-side rendering.

### Available Methods

**Location Hooks**

Location hooks work independently of the main module, similar to `useState`, but do not support nesting, base paths, or route matching.

- `useBrowserLocation`: Manipulates the browser's address bar location. Import with `import { useBrowserLocation } from "boom-router/use-browser-location"`.
- `useHashLocation`: Retrieves the location from the hash part of the address. Import with `import { useHashLocation } from "boom-router/use-hash-location"`.
- `memoryLocation`: An in-memory location hook for history, external navigation, and testing in immutable mode. Import with `import { memoryLocation } from "boom-router/memory-location"`.

**Routing Hooks**

Routing hooks are available from the `boom-router` module.

- `useRoute`: Indicates if the current page matches a given pattern.
- `useLocation`: Manipulates the current router's location, subscribing to the browser location by default.
- `useParams`: Returns an object with parameters from the closest route.
- `useSearch`: Returns the search string after the `?`.
- `useRouter`: Returns a global router object for custom routing.

**Components**

Components are also available from the `boom-router` module.

- `Route`: Conditionally renders a component based on a pattern.
- `Link`: Wraps an `<a>` tag for navigation.
- `Switch`: Provides exclusive routing, rendering only the first matched route.
- `Redirect`: Performs immediate navigation when rendered.
- `Router`: An optional top-level component for advanced routing configuration.

## Hooks API

**`useRoute`: Route Matching and Parameters**

The `useRoute` hook checks if the current location matches a provided pattern and returns parameters using the [`regexparam`](https://github.com/lukeed/regexparam) library's pattern syntax.

Use `useRoute` for manual routing or to implement custom logic, such as route transitions.

```js
import { useRoute } from "boom-router";

const Users = () => {
  const [match, params] = useRoute("/users/:name");

  return match ? <>Hello, {params.name}!</> : null;
};
```

Examples to build your segment types:

```js
useRoute("/app/:page");
useRoute("/app/:page/:section");
useRoute("/:locale?/home");
useRoute("/movies/:title.(mp4|mov)");
useRoute("/app*");
useRoute("/orders/*?");
useRoute(/^[/]([a-z]+):([0-9]+)[/]?$/);
useRoute(/^[/](?<word>[a-z]+):(?<num>[0-9]+)[/]?$/);
```

The `params` object contains parameters or null if there was no match. For wildcard segments, the parameter name is `"*"`:

```js
const [match, params] = useRoute("/app*");

if (match) {
  const page = params["*"];
}
```

**`useLocation`: Managing History**

The `useLocation` hook returns the current path and a setter function for navigation. Components re-render when the location changes.

```js
import { useLocation } from "boom-router";

const CurrentLocation = () => {
  const [location, setLocation] = useLocation();

  return (
    <div>
      Current page: {location}
      <a onClick={() => setLocation("/somewhere")}>Update</a>
    </div>
  );
};
```

All components internally use the `useLocation` hook.

**Additional Navigation Parameters**

The setter method of `useLocation` can accept an optional object with parameters to control navigation updates.

```jsx
const [location, navigate] = useLocation();

navigate("/jobs");
navigate("/home", { replace: true });
navigate("/home", { state: { modal: "promo" } });
```

**Customizing the Location Hook**

To customize the location hook, wrap your app in a `Router` component:

```js
import { Router, Route } from "boom-router";
import { useHashLocation } from "boom-router/use-hash-location";

const App = () => (
  <Router hook={useHashLocation}>
    <Route path="/about" component={About} />
  </Router>
);
```

**`useParams`: Extracting Matched Parameters**

The `useParams` hook allows access to parameters exposed through matching dynamic segments.

```js
import { Route, useParams } from "boom-router";

const User = () => {
  const params = useParams();

  return <>Hello, {params.id || params[0]}!</>;
};

<Route path="/user/:id" component={User} />
<Route path={/^[/]user[/](?<id>[0-9]+)[/]?$/} component={User} />
```

**`useSearch`: Query Strings**

The `useSearch` hook returns the current search string value.

```jsx
import { useSearch } from "boom-router";

const searchString = useSearch();
```

**`useRouter`: Accessing the Router Object**

The `useRouter` hook allows access to the global router object.

```js
import { useRouter } from "boom-router";

const Custom = () => {
  const router = useRouter();

  return <>Base: {router.base}</>;
};

const App = () => (
        <Router base="/app">
          <Custom />
        </Router>
);
```

## Component API

### `<Route path={pattern} />`

The `Route` component renders a part of the app conditionally based on the provided pattern in the `path` prop. The pattern syntax mirrors what you pass to [`useRoute`](#useroute-route-matching-and-parameters).

There are multiple ways to declare a route's body:

```js
import { Route } from "boom-router";

// Simple form
<Route path="/home"><Home /></Route>

// Render-prop style
<Route path="/users/:id">
  {params => <UserPage id={params.id} />}
</Route>

// The `params` prop will be passed down to <Orders />
<Route path="/orders/:status" component={Orders} />
```

A route with no path is considered to always match, equivalent to `<Route path="*" />`. During app development, use this technique to peek at the route's content without navigating.

```diff
-<Route path="/some/page">
+<Route>
  {/* Strip out the `path` to make this visible */}
</Route>
```

#### Route Nesting

Nesting is a core feature of boom-router and can be enabled on a route via the `nest` prop. When this prop is present, the route matches everything that starts with a given pattern, creating a nested routing context. All child routes will receive a location relative to that pattern.

Consider this example:

```js
<Route path="/app" nest>
  <Route path="/users/:id" nest>
    <Route path="/orders" />
  </Route>
</Route>
```

1. The first route is active for all paths that start with `/app`, equivalent to having a base path in your app.

2. The second one uses a dynamic pattern to match paths like `/app/user/1`, `/app/user/1/anything`, and so on.

3. The inner-most route will only work for paths like `/app/users/1/orders`. The match is strict, as that route does not have a `nest` prop and works as usual.

If you call `useLocation()` inside the last route, it will return `/orders`, not `/app/users/1/orders`. This creates isolation, making it easier to make changes to the parent route without affecting the rest of the app. To navigate to a top-level page, use a `~` prefix to refer to an absolute path:

```js
<Route path="/payments" nest>
  <Route path="/all">
    <Link to="~/home">Back to Home</Link>
  </Route>
</Route>
```

**Note:** The `nest` prop does not alter the regex passed into regex paths. Instead, it determines if nested routes will match against the rest of the path or the same path. To make a strict path regex, use a regex pattern like `/^[/](your pattern)[/]?$/` (this matches an optional end slash and the end of the string). To make a nestable regex, use a regex pattern like `/^[/](your pattern)(?=$|[/])/` (this matches either the end of the string or a slash for future segments).

### `<Link href={path} />`

The `Link` component renders an `<a />` element that, when clicked, navigates to the specified path.

```js
import { Link } from "boom-router";

<Link href="/">Home</Link>

// `to` is an alias for `href`
<Link to="/">Home</Link>

// All standard `a` props are proxied
<Link href="/" className="link" aria-label="Go to homepage">Home</Link>

// All location hook options are supported
<Link href="/" replace state={{ animate: true }} />
```

The `Link` always wraps its children in an `<a />` tag, unless the `asChild` prop is provided. Use this when you need a custom component that renders an `<a />` under the hood.

```jsx
// Use this instead
<Link to="/" asChild>
  <UIKitLink />
</Link>

// Remember, `UIKitLink` must implement an `onClick` handler
// for navigation to work!
```

When you pass a function as the `className` prop, it will be called with a boolean value indicating whether the link is active for the current route. Use this to style active links, such as links in the navigation menu:

```jsx
<Link className={(active) => (active ? "active" : "")}>Nav</Link>
```

Read more about [active links here](#how-do-i-make-a-link-active-for-the-current-route).

### `<Switch />`

In some cases, you may want exclusive routing to ensure that only one route is rendered at a time, even if the routes have overlapping patterns. This is where `Switch` comes in: it only renders **the first matching route**.

```js
import { Route, Switch } from "boom-router";

<Switch>
  <Route path="/orders/all" component={AllOrders} />
  <Route path="/orders/:status" component={Orders} />

  {/* 
     In boom-router, any Route with an empty path is considered always active. 
     This can be used to achieve "default" route behavior within Switch. 
     Note: the order matters! See examples below.
  */}
  <Route>This is rendered when nothing above has matched</Route>
</Switch>;
```

When no route in the switch matches, the last empty `Route` will be used as a fallback. See [**FAQ and Code Recipes** section](#how-do-i-make-a-default-route) for default route information.

### `<Redirect to={path} />`

When mounted, `Redirect` performs a redirect to the provided `path`. It uses the `useLocation` hook internally to trigger navigation within a `useEffect` block.

`Redirect` can also accept props for [customizing how navigation will be performed](#additional-navigation-parameters), such as setting history state when navigating. These options are specific to the currently used location hook.

```jsx
<Redirect to="/" />

// Arbitrary state object
<Redirect to="/" state={{ modal: true }} />

// Use `replaceState`
<Redirect to="/" replace />
```

If you need more advanced logic for navigation, such as triggering the redirect inside an event handler, consider using [`useLocation` hook instead](#uselocation-working-with-the-history):

```js
import { useLocation } from "boom-router";

const [location, setLocation] = useLocation();

fetchOrders().then((orders) => {
  setOrders(orders);
  setLocation("/app/orders");
});
```

### `<Router hook={hook} parser={fn} base={basepath} hrefs={fn} />`

Unlike _React Router_, routes in boom-router **don't have to be wrapped in a top-level component**. An internal router object will be constructed on demand, allowing you to start writing your app without a cascade of top-level providers. However, there are cases when the routing behavior needs to be customized.

These cases include hash-based routing, basepath support, custom matcher function, etc.

```jsx
import { useHashLocation } from "boom-router/use-hash-location";

<Router hook={useHashLocation} base="/app">
  {/* Your app goes here */}
</Router>;
```

A router is a simple object that holds the routing configuration options. You can always obtain this object using the [`useRouter` hook](#userouter-accessing-the-router-object). The list of currently available options:

- **`hook: () => [location: string, setLocation: fn]`** — a React Hook function that subscribes to location changes. It returns a pair of current `location` string, e.g., `/app/users`, and a `setLocation` function for navigation. You can use this hook from any component of your app by calling [`useLocation()` hook](#uselocation-working-with-the-history). See [Customizing the location hook](#customizing-the-location-hook).

- **`searchHook: () => [search: string, setSearch: fn]`** — similar to `hook`, but for obtaining the [current search string](#usesearch-query-strings).

- **`base: string`** — an optional setting that allows you to specify a base path, such as `/app`. All application routes will be relative to that path. To navigate to an absolute path, prefix your path with a `~`. [See the FAQ](#are-relative-routes-and-links-supported).

- **`parser: (path: string, loose?: boolean) => { pattern, keys }`** — a pattern parsing function. It produces a RegExp for matching the current location against user-defined patterns like `/app/users/:id`. It has the same interface as the [`parse`](https://github.com/lukeed/regexparam?tab=readme-ov-file#regexparamparseinput-regexp) function from `regexparam`. See [this example](#are-strict-routes-supported) that demonstrates the custom parser feature.

- **`ssrPath: string`** and **`ssrSearch: string`** — use these when [rendering your app on the server](#server-side-rendering-support-ssr).

- `hrefs: (href: boolean) => string` — a function for transforming the `href` attribute of an `<a />` element rendered by `Link`. It is used to support hash-based routing. By default, the `href` attribute is the same as the `href` or `to` prop of a `Link`. A location hook can also define a `hook.hrefs` property; in this case, the `href` will be inferred.
## Tips and Tricks

### Setting a Base Path

You can specify a base path for your app by wrapping it with the `<Router base="/app" />` component:

```js
import { Router, Route, Link } from "boom-router";

const App = () => (
  <Router base="/app">
    {/* The link's href attribute will be "/app/users" */}
    <Link href="/users">Users</Link>

    <Route path="/users">The current path is /app/users!</Route>
  </Router>
);
```

When using a base path, `useLocation()` within a route returns a path scoped to the base. For example, with a base of `"/app"`, the returned string for `"/app/users"` is `"/users"`. Navigation with `navigate` will automatically append the base to the path argument for you.

### Default Route

Create a default route that will be shown as a fallback, in case no other route matches, by combining the `<Switch />` component and a default route:

```js
import { Switch, Route } from "boom-router";

<Switch>
  <Route path="/about">...</Route>
  <Route>404, Not Found!</Route>
</Switch>;
```

**Note:** The order of switch children matters; the default route should always come last.

For accessing the matched segment of the path, use wildcard parameters:

```js
<Switch>
  <Route path="/users">...</Route>

  {/* Will match anything that starts with /users/, e.g. /users/foo, /users/1/edit etc. */}
  <Route path="/users/*">...</Route>

  {/* Will match everything else */}
  <Route path="*">
    {(params) => `404, Sorry the page ${params["*"]} does not exist!`}
  </Route>
</Switch>
```

### Active Links

Make a link active for the current route by providing a function to the `className` prop:

```jsx
<Link className={(active) => (active ? "active" : "")}>Nav link</Link>
```

For controlling other props, such as `aria-current` or `style`, write a custom `<Link />` wrapper and detect if the path is active by using the `useRoute` hook.

### Strict Routes

If a trailing slash is important for your app's routing, specify a custom parser. Here's a custom parser based on the popular `path-to-regexp` package that supports strict routes:

```js
import { pathToRegexp } from "path-to-regexp";

/**
 * Custom parser based on `pathToRegexp` with strict route option
 */
const strictParser = (path, loose) => {
  const keys = [];
  const pattern = pathToRegexp(path, keys, { strict: true, end: !loose });

  return {
    pattern,
    // `pathToRegexp` returns some metadata about the keys,
    // we want to strip it to just an array of keys
    keys: keys.map((k) => k.name),
  };
};

const App = () => (
  <Router parser={strictParser}>
    <Route path="/foo">...</Route>
    <Route path="/foo/">...</Route>
  </Router>
);
```

### Relative Routes and Links

Yes! Any route with the `nest` prop creates a nesting context. Keep in mind that the location inside a nested route will be scoped:

```js
const App = () => (
  <Router base="/app">
    <Route path="/dashboard" nest>
      {/* The href is "/app/dashboard/users" */}
      <Link to="/users" />

      <Route path="/users">
        {/* Here `useLocation()` returns "/users"! */}
      </Route>
    </Route>
  </Router>
);
```

### Navigation from Outside a Component

The `navigate` function is exposed from the `"boom-router/use-browser-location"` module:

```js
import { navigate } from "boom-router/use-browser-location";

navigate("/", { replace: true });
```

It's the same function that is used internally.

### Using boom-router in TypeScript

Yes! Although the project isn't written in TypeScript, the type definition files are bundled with the package.

### Animated Route Transitions

To animate route transitions with `framer-motion`, match the route manually with `useRoute`. Unfortunately, `AnimatePresence` only animates its **direct children**:

```jsx
export const MyComponent = ({ isVisible }) => {
  const [isMatch] = useRoute("/");

  return (
    <AnimatePresence>
      {isMatch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </AnimatePresence>
  );
};
```

### Server-side Rendering Support (SSR)

For server-side rendering, wrap your app with a top-level `Router` and specify `ssrPath` prop:

```js
import { renderToString } from "react-dom/server";
import { Router } from "boom-router";

const handleRequest = (req, res) => {
  // Top-level Router is mandatory in SSR mode
  const prerendered = renderToString(
    <Router ssrPath={req.path} ssrSearch={req.search}>
      <App />
    </Router>
  );

  // Respond with prerendered HTML
};
```

### Rendering a Specific Route in Tests

For testing, provide a fixture for the current location to render a specific route by swapping the normal location hook with `memoryLocation`:

```jsx
import { render } from "@testing-library/react";
import { memoryLocation } from "boom-router/memory-location";

it("renders a user page", () => {
  // `static` mode is used to prevent the hook from updating the location
  const { hook } = memoryLocation({ path: "/user/2", static: true });

  const { container } = render(
    <Router hook={hook}>
      <Route path="/user/:id">{(params) => <>User ID: {params.id}</>}</Route>
    </Router>
  );

  expect(container.innerHTML).toBe("User ID: 2");
});
```

### Reducing Bundle Size

For those who are looking for the smallest possible bundle size, use the standalone location hooks available in the package. For example, `useBrowserLocation` hook is only **~650 bytes gzipped**:

```js
import { useBrowserLocation } from "boom-router/use-browser-location";

const UsersRoute = () => {
  const [location] = useBrowserLocation();

  if (location !== "/users") return null;

  // Render the route
};
```

## Coming Soon
- Preact support

### Concluding Note

I'd like to extend my gratitude to the authors and contributors of the libraries that have inspired and guided the development of **boom-router**. Your work has been invaluable.

I've put a lot of effort into crafting this library and its documentation. Thank you for considering **boom-router**! I hope you find it helpful in building your applications.

If you have any feedback, suggestions, or issues, please don't hesitate to reach out. Happy coding!