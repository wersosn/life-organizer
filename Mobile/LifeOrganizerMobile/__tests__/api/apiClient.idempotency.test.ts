import MockAdapter from "axios-mock-adapter";
import { apiClient } from "@/api/apiClient";

describe("apiClient idempotency key", () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(apiClient);
    });

    afterEach(() => {
        mock.restore();
    });

    /*it("adds an Idempotency-Key header to POST requests", async () => {
        mock.onPost("/test").reply(config => {
            expect(config.headers?.["Idempotency-Key"]).toBeTruthy();
            return [200, {}];
        });

        await apiClient.post("/test", {});
    });*/

    it("does not add an Idempotency-Key header to GET requests", async () => {
        mock.onGet("/test").reply(config => {
            expect(config.headers?.["Idempotency-Key"]).toBeUndefined();
            return [200, {}];
        });

        await apiClient.get("/test");
    });
});