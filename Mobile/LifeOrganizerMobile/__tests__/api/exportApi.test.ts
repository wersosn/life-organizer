import { apiClient } from "@/api/apiClient";
import { exportFullData } from "@/api/exportApi";

jest.mock("@/api/apiClient", () => ({
    apiClient: { get: jest.fn() },
}));

describe("exportApi", () => {
    afterEach(() => jest.clearAllMocks());

    it("exportFullData calls the correct endpoint with text responseType", async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: '{"user":{}}' });

        const result = await exportFullData();

        expect(apiClient.get).toHaveBeenCalledWith("/settings/fullexport", { responseType: "text" });
        expect(result).toBe('{"user":{}}');
    });
});