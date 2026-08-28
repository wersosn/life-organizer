import { apiClient } from "@/api/apiClient";
import MockAdapter from "axios-mock-adapter";

describe("apiClient retry behavior", () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(apiClient);
    });

    afterEach(() => {
        mock.restore();
    });

    it("retries on a 500 error and eventually succeeds", async () => {
        mock
            .onGet("/test")
            .replyOnce(500)
            .onGet("/test")
            .replyOnce(500)
            .onGet("/test")
            .reply(200, { data: "ok" });

        const response = await apiClient.get("/test");

        expect(response.status).toBe(200);
        expect(mock.history.get).toHaveLength(3);
    }, 15000);

    it("does not retry on a 400 error", async () => {
        mock.onGet("/test").reply(400, { message: "Bad request" });

        await expect(apiClient.get("/test")).rejects.toThrow();
        expect(mock.history.get).toHaveLength(1);
    });

    it("does not retry on a 401 error", async () => {
        mock.onGet("/test").reply(401);

        await expect(apiClient.get("/test")).rejects.toThrow();
        expect(mock.history.get).toHaveLength(1);
    });

    it("gives up after exhausting retries on persistent 500 errors", async () => {
        mock.onGet("/test").reply(500);

        await expect(apiClient.get("/test")).rejects.toThrow();
        expect(mock.history.get).toHaveLength(4);
    }, 15000);
});