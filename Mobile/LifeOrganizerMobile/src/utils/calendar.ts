import * as Calendar from "expo-calendar";
import { Platform } from "react-native";

export async function requestCalendarPermissions(): Promise<boolean> {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === "granted";
}

async function getDefaultCalendarId(): Promise<string | null> {
    if (Platform.OS === "ios") {
        const defaultCalendar = await Calendar.getDefaultCalendarAsync();
        return defaultCalendar.id;
    }

    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const writable = calendars.find(cal => cal.allowsModifications);
    return writable?.id ?? null;
}

export async function addChoreToCalendar(choreName: string, notes: string | undefined, date: Date): Promise<string> {
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) {
        throw new Error("Calendar permission denied");
    }

    const calendarId = await getDefaultCalendarId();
    if (!calendarId) {
        throw new Error("No writable calendar found on this device");
    }

    return await Calendar.createEventAsync(calendarId, {
        title: choreName,
        notes,
        startDate: date,
        endDate: new Date(date.getTime() + 30 * 60 * 1000),
        alarms: [{ relativeOffset: -30 }],
    });
}