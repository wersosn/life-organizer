import { apiClient } from "@/api/apiClient";
import { getRetentionSettings, updateRetentionSettings } from "@/api/retentionApi";

jest.mock("@/api/apiClient", () => ({
    apiClient: {
        get: jest.fn(),
        put: jest.fn(),
    },
}));

describe("retentionApi", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("getRetentionSettings calls the correct endpoint and returns data", async () => {
        const mockData = { taskHistoryRetentionDays: 30 };
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await getRetentionSettings();

        expect(apiClient.get).toHaveBeenCalledWith("/settings/retention");
        expect(result).toEqual(mockData);
    });

    it("updateRetentionSettings sends the correct payload", async () => {
        (apiClient.put as jest.Mock).mockResolvedValue({ data: undefined });

        await updateRetentionSettings(60);

        expect(apiClient.put).toHaveBeenCalledWith("/settings/retention", {
            taskHistoryRetentionDays: 60,
        });
    });
});