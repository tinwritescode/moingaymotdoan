import { Loading } from "solid-js";
import { Router } from "./router";
import "./app.css";

/** The layout every page shares: the page itself, then the source line. */
export default function App() {
  return (
    <Router>
      {(props) => (
        <>
          <div class="flex flex-1 flex-col">
            <Loading fallback={<p class="px-6 py-10 font-sans text-sm text-muted">Đang tải…</p>}>{props.children}</Loading>
          </div>
          <footer class="border-t border-rule">
            <p class="px-6 py-4 font-sans text-sm text-muted">
              Lời Kinh Thánh: Bản Truyền Thống (public domain), nguồn{" "}
              <a href="https://ebible.org/find/details.php?id=vie1934" class="underline hover:text-accent">
                eBible.org
              </a>
              .
            </p>
          </footer>
        </>
      )}
    </Router>
  );
}
