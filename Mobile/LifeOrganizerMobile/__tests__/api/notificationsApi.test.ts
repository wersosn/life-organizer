import { apiClient } from "@/api/apiClient";
import { getNotificationSettings, registerPushToken, updateNotificationSettings } from "@/api/notificationsApi";

jest.mock("@/api/apiClient", () => ({
    apiClient: {
        get: jest.fn(),
        put: jest.fn(),
        post: jest.fn(),
    },
}));

describe("notificationsApi", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("registerPushToken calls the correct endpoint with the token", async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: undefined });

        await registerPushToken("ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]");

        expect(apiClient.post).toHaveBeenCalledWith("/settings/pushtoken", {
            token: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
        });
    });

    it("getNotificationSettings calls the correct endpoint and returns data", async () => {
        const mockData = { pushNotificationsEnabled: true };
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await getNotificationSettings();

        expect(apiClient.get).toHaveBeenCalledWith("/settings/notifications");
        expect(result).toEqual(mockData);
    });

    it("updateNotificationSettings sends the enabled flag in the payload", async () => {
        (apiClient.put as jest.Mock).mockResolvedValue({ data: undefined });

        await updateNotificationSettings({ pushNotificationsEnabled: true });

        expect(apiClient.put).toHaveBeenCalledWith("/settings/notifications", {
            pushNotificationsEnabled: true,
        });
    });

    it("updateNotificationSettings correctly sends the flag disabled", async () => {
        (apiClient.put as jest.Mock).mockResolvedValue({ data: undefined });

        await updateNotificationSettings({ pushNotificationsEnabled: false });

        expect(apiClient.put).toHaveBeenCalledWith("/settings/notifications", {
            pushNotificationsEnabled: false,
        });
    });
});