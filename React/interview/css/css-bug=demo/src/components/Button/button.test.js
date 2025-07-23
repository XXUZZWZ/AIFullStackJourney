// button.test.js
import React from "react";
import { render } from "@testing-library/react";
import Button from "./Button";

/* global describe, it, expect */
describe("Button Component", () => {
  it("should render primary button correctly", () => {
    const { asFragment } = render(<Button type="primary">Submit</Button>);
    expect(asFragment()).toMatchSnapshot();
  });
});
