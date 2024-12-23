/// <reference types="@testing-library/jest-dom" />
import "@testing-library/jest-dom";

// jest.setup.ts
Object.defineProperty(global, "ResizeObserver", {
  writable: true,
  value: class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});
