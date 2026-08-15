import { Platform } from "react-native";
import * as FileSystemLegacy from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { saveFileToDevice } from "@/utils/exportFile";

jest.mock("expo-file-system/legacy", () => ({
    StorageAccessFramework: {
        requestDirectoryPermissionsAsync: jest.fn(),
        createFileAsync: jest.fn(),
    },
    writeAsStringAsync: jest.fn(),
    cacheDirectory: "file:///cache/",
    EncodingType: { UTF8: "utf8" },
}));

jest.mock("expo-sharing", () => ({
    isAvailableAsync: jest.fn(),
    shareAsync: jest.fn(),
}));

describe("saveFileToDevice", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("on Android", () => {
        beforeEach(() => {
            Platform.OS = "android";
        });

        it("saves directly to the selected directory when permission is granted", async () => {
            (FileSystemLegacy.StorageAccessFramework.requestDirectoryPermissionsAsync as jest.Mock).mockResolvedValue({
                granted: true,
                directoryUri: "content://tree/downloads",
            });
            (FileSystemLegacy.StorageAccessFramework.createFileAsync as jest.Mock).mockResolvedValue("content://tree/downloads/file.json");

            const result = await saveFileToDevice("{}", "export.json", "application/json");

            expect(FileSystemLegacy.StorageAccessFramework.createFileAsync).toHaveBeenCalledWith(
                "content://tree/downloads",
                "export.json",
                "application/json"
            );
            expect(FileSystemLegacy.writeAsStringAsync).toHaveBeenCalledWith(
                "content://tree/downloads/file.json",
                "{}",
                { encoding: "utf8" }
            );
            expect(result).toEqual({ success: true, savedToDownloads: true });
        });

        it("falls back to sharing when directory permission is denied", async () => {
            (FileSystemLegacy.StorageAccessFramework.requestDirectoryPermissionsAsync as jest.Mock).mockResolvedValue({
                granted: false,
            });
            (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);

            const result = await saveFileToDevice("{}", "export.json", "application/json");

            expect(Sharing.shareAsync).toHaveBeenCalled();
            expect(result).toEqual({ success: true, savedToDownloads: false });
        });

        it("returns success: false when an error occurs", async () => {
            (FileSystemLegacy.StorageAccessFramework.requestDirectoryPermissionsAsync as jest.Mock).mockRejectedValue(
                new Error("SAF error")
            );

            const result = await saveFileToDevice("{}", "export.json", "application/json");

            expect(result).toEqual({ success: false, savedToDownloads: false });
        });
    });

    describe("on iOS", () => {
        beforeEach(() => {
            Platform.OS = "ios";
        });

        it("always uses the share sheet, never savedToDownloads", async () => {
            (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);

            const result = await saveFileToDevice("{}", "export.json", "application/json");

            expect(Sharing.shareAsync).toHaveBeenCalled();
            expect(result).toEqual({ success: true, savedToDownloads: false });
        });

        it("throws when sharing is not available", async () => {
            (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(false);

            await expect(saveFileToDevice("{}", "export.json", "application/json")).rejects.toThrow(
                "Sharing is not available on this device"
            );
        });
    });
});