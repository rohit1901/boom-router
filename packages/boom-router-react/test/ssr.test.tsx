/**
 * @vitest-environment node
 */

import { it, expect, describe } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Route,
  Router,
  useRoute,
  Link,
  Redirect,
  useSearch,
  useLocation,
} from "boom-router";

describe("server-side rendering", () => {
  it("works via `ssrPath` prop", () => {
    const App = () => (
      <Router ssrPath="/users/baz">
        <Route path="/users/baz">foo</Route>
        <Route path="/users/:any*">bar</Route>
        <Route path="/users/:id">{(params) => params.id}</Route>
        <Route path="/about">should not be rendered</Route>
      </Router>
    );

    const rendered = renderToStaticMarkup(<App />);
    expect(rendered).toBe("foobarbaz");
  });

  it("supports hook-based routes", () => {
    const HookRoute = () => {
      const [match, params] = useRoute("/pages/:name");
      return <>{match ? `Welcome to ${params.name}!` : "Not Found!"}</>;
    };

    const App = () => (
      <Router ssrPath="/pages/intro">
        <HookRoute />
      </Router>
    );

    const rendered = renderToStaticMarkup(<App />);
    expect(rendered).toBe("Welcome to intro!");
  });

  it("renders valid and accessible link elements", () => {
    const App = () => (
      <Router ssrPath="/">
        <Link href="/users/1" title="Profile">
          Mark
        </Link>
      </Router>
    );

    const rendered = renderToStaticMarkup(<App />);
    expect(rendered).toBe(`<a title="Profile" href="/users/1">Mark</a>`);
  });

  it("renders redirects however they have effect only on a client-side", () => {
    const App = () => (
      <Router ssrPath="/">
        <Route path="/">
          <Redirect to="/foo" />
        </Route>

        <Route path="/foo">You won't see that in SSR page</Route>
      </Router>
    );

    const rendered = renderToStaticMarkup(<App />);
    expect(rendered).toBe("");
  });

  describe("rendering with given search string", () => {
    it("is empty when not specified", () => {
      const PrintSearch = () => <>{useSearch()}</>;

      const rendered = renderToStaticMarkup(
        <Router ssrPath="/">
          <PrintSearch />
        </Router>
      );

      expect(rendered).toBe("");
    });

    it("allows to override search string", () => {
      const App = () => {
        const search = useSearch();
        const [location] = useLocation();

        return (
          <>
            {location} filter by {search}
          </>
        );
      };

      const rendered = renderToStaticMarkup(
        <Router ssrPath="/catalog" ssrSearch="sort=created_at">
          <App />
        </Router>
      );

      expect(rendered).toBe("/catalog filter by sort=created_at");
    });
  });
});
