import { apiClient } from "@/api/apiClient";
import { getAutomationSettings, updateAutomationSettings } from "@/api/automationApi";

jest.mock("@/api/apiClient", () => ({
    apiClient: {
        get: jest.fn(),
        put: jest.fn(),
    },
}));

describe("automationApi", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("getAutomationSettings calls the correct endpoint and returns data", async () => {
        const mockData = { habitAutomationEnabled: true, choreAutomationEnabled: false };
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await getAutomationSettings();

        expect(apiClient.get).toHaveBeenCalledWith("/settings/automation");
        expect(result).toEqual(mockData);
    });

    it("updateAutomationSettings sends both flags in the payload", async () => {
        (apiClient.put as jest.Mock).mockResolvedValue({ data: undefined });

        await updateAutomationSettings({ habitAutomationEnabled: false, choreAutomationEnabled: true });

        expect(apiClient.put).toHaveBeenCalledWith("/settings/automation", {
            habitAutomationEnabled: false,
            choreAutomationEnabled: true,
        });
    });

    it("updateAutomationSettings correctly sends both flags disabled", async () => {
        (apiClient.put as jest.Mock).mockResolvedValue({ data: undefined });

        await updateAutomationSettings({ habitAutomationEnabled: false, choreAutomationEnabled: false });

        expect(apiClient.put).toHaveBeenCalledWith("/settings/automation", {
            habitAutomationEnabled: false,
            choreAutomationEnabled: false,
        });
    });
});