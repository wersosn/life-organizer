import { render, screen, fireEvent } from "@testing-library/react-native";
import { SettingsButton } from "@/components/SettingsButton";
import { router } from "expo-router";

jest.mock("expo-router", () => ({
    router: { push: jest.fn() },
}));

describe("SettingsButton", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders without crashing", () => {
        render(<SettingsButton />);

        expect(screen.getByTestId("settings-button")).toBeTruthy();
    });

    it("navigates to the settings screen when pressed", () => {
        render(<SettingsButton />);

        fireEvent.press(screen.getByTestId("settings-button"));

        expect(router.push).toHaveBeenCalledWith("/(settings)/settings");
    });
});