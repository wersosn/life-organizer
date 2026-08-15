import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as FileSystemLegacy from "expo-file-system/legacy";
import { Platform } from "react-native";

const { StorageAccessFramework } = FileSystemLegacy;

type SaveResult = { success: boolean; savedToDownloads: boolean };

export async function saveFileToDevice(content: string, fileName: string, mimeType: string): Promise<SaveResult> {
    if (Platform.OS === "android") {
        return saveToAndroidDownloads(content, fileName, mimeType);
    }
    return shareFile(content, fileName, mimeType);
}

async function saveToAndroidDownloads(content: string, fileName: string, mimeType: string): Promise<SaveResult> {
    try {
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (!permissions.granted) {
            await shareFile(content, fileName, mimeType);
            return { success: true, savedToDownloads: false };
        }

        const fileUri = await StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            fileName,
            mimeType
        );

        await FileSystemLegacy.writeAsStringAsync(fileUri, content, {
            encoding: "utf8",
        });

        return { success: true, savedToDownloads: true };
    } catch (e) {
        console.log(e);
        return { success: false, savedToDownloads: false };
    }
}

async function shareFile(content: string, fileName: string, mimeType: string): Promise<SaveResult> {
    const fileUri = FileSystemLegacy.cacheDirectory + fileName;

    await FileSystemLegacy.writeAsStringAsync(fileUri, content, {
        encoding: "utf8",
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
        throw new Error("Sharing is not available on this device");
    }

    await Sharing.shareAsync(fileUri, { mimeType, dialogTitle: "Export data" });
    return { success: true, savedToDownloads: false };
}

export async function saveAndShareCsv(csvContent: string, fileName: string) {
    const file = new File(Paths.document, fileName);
    file.write(csvContent);

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
        throw new Error("Sharing is not available on this device");
    }

    await Sharing.shareAsync(file.uri, {
        mimeType: "text/csv",
        dialogTitle: "Export transactions",
    });
}