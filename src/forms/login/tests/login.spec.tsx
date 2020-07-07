import React from "react";
import renderer from "react-test-renderer";

import { Login } from "..";

test("render correct", () => {
  const component = renderer.create(<Login />);
  let tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});
