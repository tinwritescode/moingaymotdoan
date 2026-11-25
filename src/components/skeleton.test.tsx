import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Bone, Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("báo cho trình đọc màn hình một trạng thái đang tải, còn các khối xám thì im lặng", () => {
    render(() => (
      <Skeleton label="Đang tải lịch sử đọc…">
        <Bone class="h-4 w-1/2" />
      </Skeleton>
    ));

    const status = screen.getByRole("status");
    expect(status.getAttribute("aria-busy")).toBe("true");
    expect(status.textContent).toBe("Đang tải lịch sử đọc…");
  });
});
