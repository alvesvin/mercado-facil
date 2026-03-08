// Mock Worklets so Reanimated doesn't try to init native in Jest https://docs.swmansion.com/react-native-worklets/docs/guides/testing/
jest.mock("react-native-worklets", () => require("react-native-worklets/src/mock"));
// https://docs.swmansion.com/react-native-reanimated/docs/2.x/guide/testing/
require("react-native-reanimated").setUpTests();

// For react-hook-form https://react-hook-form.com/advanced-usage#TestingForm
global.window = {};
global.window = global;

// Official jest setup for FlashList doesn't work. We got this from Github
// https://github.com/Shopify/flash-list/issues/793#issuecomment-3669258915
jest.mock("@shopify/flash-list", () => {
  const mock_React = require("react");
  const { FlatList } = require("react-native");

  return {
    FlashList: mock_React.forwardRef((props, ref) => {
      return mock_React.createElement(FlatList, {
        ref: ref,
        ...props,
      });
    }),
  };
});
