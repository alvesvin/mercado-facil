// Mock Worklets so Reanimated doesn't try to init native in Jest
jest.mock("react-native-worklets", () => require("react-native-worklets/src/mock"));

require("react-native-reanimated").setUpTests();
