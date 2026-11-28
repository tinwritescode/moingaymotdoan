import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { createSignal, flush } from "solid-js";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { SheetDialog } from "./sheet-dialog";

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

afterEach(() => {
  cleanup();
});

describe("<SheetDialog />", () => {
  test("closes when clicking the backdrop, but stays open when clicking inside or dragging out", () => {
    const onClose = vi.fn();
    const [open, setOpen] = createSignal(true);
    const view = render(() => (
      <SheetDialog
        open={open()}
        onClose={() => {
          onClose();
          setOpen(false);
        }}
        ariaLabel="Test modal"
      >
        {() => <p>Inside content</p>}
      </SheetDialog>
    ));
    flush();

    const dialog = view.getByRole("dialog", { name: "Test modal" });
    const innerText = view.getByText("Inside content");

    // Clicking inside content keeps the modal open.
    fireEvent.pointerDown(innerText);
    fireEvent.click(innerText);
    flush();
    expect(onClose).not.toHaveBeenCalled();
    expect(dialog.hasAttribute("open")).toBe(true);

    // Clicking the inner padding wrapper keeps the modal open.
    const innerWrapper = innerText.parentElement!;
    fireEvent.pointerDown(innerWrapper);
    fireEvent.click(innerWrapper);
    flush();
    expect(onClose).not.toHaveBeenCalled();
    expect(dialog.hasAttribute("open")).toBe(true);

    // Dragging from inside and releasing on the backdrop does NOT close the modal.
    fireEvent.pointerDown(innerText);
    fireEvent.click(dialog);
    flush();
    expect(onClose).not.toHaveBeenCalled();
    expect(dialog.hasAttribute("open")).toBe(true);

    // Clicking directly on the backdrop closes the modal.
    fireEvent.pointerDown(dialog);
    fireEvent.click(dialog);
    flush();
    expect(onClose).toHaveBeenCalledOnce();
    expect(dialog.hasAttribute("open")).toBe(false);
  });

  test("clicking a nested modal's backdrop closes only the inner modal", () => {
    const [outerOpen, setOuterOpen] = createSignal(true);
    const [innerOpen, setInnerOpen] = createSignal(true);

    const view = render(() => (
      <SheetDialog open={outerOpen()} onClose={() => setOuterOpen(false)} ariaLabel="Outer modal">
        {() => (
          <>
            <p>Outer</p>
            <SheetDialog open={innerOpen()} onClose={() => setInnerOpen(false)} ariaLabel="Inner modal">
              {() => <p>Inner</p>}
            </SheetDialog>
          </>
        )}
      </SheetDialog>
    ));
    flush();

    const outer = view.getByRole("dialog", { name: "Outer modal" });
    const inner = view.getByRole("dialog", { name: "Inner modal" });

    fireEvent.pointerDown(inner);
    fireEvent.click(inner);
    flush();

    expect(inner.hasAttribute("open")).toBe(false);
    expect(outer.hasAttribute("open")).toBe(true);
  });
});
