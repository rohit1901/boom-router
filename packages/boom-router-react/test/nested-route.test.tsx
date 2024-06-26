import { it, expect, describe } from "vitest";
import { act, render, renderHook } from "@testing-library/react";

import { Route, Router, Switch, useRouter } from "boom-router";
import { memoryLocation } from "boom-router/memory-location";

describe("when `nest` prop is given", () => {
  it("renders by default", () => {
    const { container } = render(<Route nest>matched!</Route>);
    expect(container.innerHTML).toBe("matched!");
  });

  it("matches the pattern loosely", () => {
    const { hook, navigate } = memoryLocation();

    const { container } = render(
      <Router hook={hook}>
        <Route path="/posts/:slug" nest>
          matched!
        </Route>
      </Router>
    );

    expect(container.innerHTML).toBe("");

    act(() => navigate("/posts/all")); // full match
    expect(container.innerHTML).toBe("matched!");

    act(() => navigate("/users"));
    expect(container.innerHTML).toBe("");

    act(() => navigate("/posts/10-react-tricks/table-of-contents"));
    expect(container.innerHTML).toBe("matched!");
  });

  it("can be used inside a Switch", () => {
    const { container } = render(
      <Router
        hook={
          memoryLocation({ path: "/posts/13/2012/sort", static: true }).hook
        }
      >
        <Switch>
          <Route path="/about">about</Route>
          <Route path="/posts/:slug" nest>
            nested
          </Route>
          <Route>default</Route>
        </Switch>
      </Router>
    );

    expect(container.innerHTML).toBe("nested");
  });

  it("sets the base to the matched segment", () => {
    const { result } = renderHook(() => useRouter().base, {
      wrapper: (props) => (
        <Router
          hook={memoryLocation({ path: "/2012/04/posts", static: true }).hook}
        >
          <Route path="/:year/:month" nest>
            <Route path="/posts">{props.children}</Route>
          </Route>
        </Router>
      ),
    });

    expect(result.current).toBe("/2012/04");
  });

  it("can be nested in another nested `Route` or `Router`", () => {
    const { container } = render(
      <Router
        base="/app"
        hook={
          memoryLocation({
            path: "/app/users/rohitey/settings/all",
            static: true,
          }).hook
        }
      >
        <Route path="/users/:name" nest>
          <Route path="/settings">should not be rendered</Route>

          <Route path="/settings" nest>
            <Route path="/all">All settings</Route>
          </Route>
        </Route>
      </Router>
    );

    expect(container.innerHTML).toBe("All settings");
  });

  it("reacts to `nest` updates", () => {
    const { hook } = memoryLocation({
      path: "/app/apple/products",
      static: true,
    });

    const App = ({ nested }: { nested: boolean }) => {
      return (
        <Router hook={hook}>
          <Route path="/app/:company" nest={nested}>
            matched!
          </Route>
        </Router>
      );
    };

    const { container, rerender } = render(<App nested={true} />);
    expect(container.innerHTML).toBe("matched!");

    rerender(<App nested={false} />);
    expect(container.innerHTML).toBe("");
  });

  it("works with one optional segment", () => {
    const { hook, navigate } = memoryLocation({
      path: "/",
    });

    const App = () => {
      return (
        <Router hook={hook}>
          <Route path="/:version?" nest>
            {({ version }) => version ?? "default"}
          </Route>
        </Router>
      );
    };

    const { container } = render(<App />);
    expect(container.innerHTML).toBe("default");

    act(() => navigate("/v1"));
    expect(container.innerHTML).toBe("v1");

    act(() => navigate("/v2/dashboard"));
    expect(container.innerHTML).toBe("v2");
  });
});
