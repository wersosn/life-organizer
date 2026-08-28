import MockAdapter from "axios-mock-adapter";
import { apiClient } from "@/api/apiClient";
import * as Crypto from "expo-crypto";

jest.mock("expo-crypto", () => ({
    randomUUID: jest.fn(() => "test-idempotency-key-uuid"),
}));

describe("apiClient idempotency key", () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(apiClient);
    });

    afterEach(() => {
        mock.restore();
    });

    it("adds an Idempotency-Key header to POST requests", async () => {
        mock.onPost("/test").reply(config => {
            expect(config.headers?.["Idempotency-Key"]).toBeTruthy();
            expect(config.headers?.["Idempotency-Key"]).toBe("test-idempotency-key-uuid");
            return [200, {}];
        });

        await apiClient.post("/test", {});
    });

    it("does not add an Idempotency-Key header to GET requests", async () => {
        mock.onGet("/test").reply(config => {
            expect(config.headers?.["Idempotency-Key"]).toBeUndefined();
            return [200, {}];
        });

        await apiClient.get("/test");
    });

    it("generates a different key for each separate POST call", async () => {
        (Crypto.randomUUID as jest.Mock)
            .mockReturnValueOnce("uuid-1")
            .mockReturnValueOnce("uuid-2");

        const receivedKeys: string[] = [];
        mock.onPost("/test").reply(config => {
            receivedKeys.push(config.headers?.["Idempotency-Key"]);
            return [200, {}];
        });

        await apiClient.post("/test", {});
        await apiClient.post("/test", {});

        expect(receivedKeys).toEqual(["uuid-1", "uuid-2"]);
    });

    it("does not overwrite an existing Idempotency-Key header", async () => {
        mock.onPost("/test").reply(config => {
            expect(config.headers?.["Idempotency-Key"]).toBe("manually-set-key");
            return [200, {}];
        });

        await apiClient.post("/test", {}, { headers: { "Idempotency-Key": "manually-set-key" } });
    });
});