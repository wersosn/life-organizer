import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

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