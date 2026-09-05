import * as Calendar from "expo-calendar";
import { Platform } from "react-native";
import { addChoreToCalendar, requestCalendarPermissions } from "@/utils/calendar";

jest.mock("expo-calendar", () => ({
    requestCalendarPermissionsAsync: jest.fn(),
    getDefaultCalendarAsync: jest.fn(),
    getCalendarsAsync: jest.fn(),
    createEventAsync: jest.fn(),
    EntityTypes: { EVENT: "event" },
}));

describe("utils/calendar", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("requestCalendarPermissions", () => {
        it("returns true when permission is granted", async () => {
            (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });

            const result = await requestCalendarPermissions();

            expect(result).toBe(true);
        });

        it("returns false when permission is denied", async () => {
            (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: "denied" });

            const result = await requestCalendarPermissions();

            expect(result).toBe(false);
        });
    });

    describe("addChoreToCalendar", () => {
        const date = new Date("2026-08-01T10:00:00Z");

        it("throws when permission is denied and never attempts to create an event", async () => {
            (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: "denied" });

            await expect(addChoreToCalendar("Take out trash", undefined, date))
                .rejects.toThrow("Calendar permission denied");

            expect(Calendar.createEventAsync).not.toHaveBeenCalled();
        });

        it("throws when no writable calendar is found on Android", async () => {
            (Platform as any).OS = "android";
            (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
            (Calendar.getCalendarsAsync as jest.Mock).mockResolvedValue([
                { id: "cal-1", allowsModifications: false },
            ]);

            await expect(addChoreToCalendar("Take out trash", undefined, date))
                .rejects.toThrow("No writable calendar found on this device");
        });

        it("creates an event using the default calendar on iOS", async () => {
            (Platform as any).OS = "ios";
            (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
            (Calendar.getDefaultCalendarAsync as jest.Mock).mockResolvedValue({ id: "ios-default-cal" });
            (Calendar.createEventAsync as jest.Mock).mockResolvedValue("event-123");

            const eventId = await addChoreToCalendar("Take out trash", "Don't forget the recycling", date);

            expect(Calendar.createEventAsync).toHaveBeenCalledWith("ios-default-cal", expect.objectContaining({
                title: "Take out trash",
                notes: "Don't forget the recycling",
                startDate: date,
            }));
            expect(eventId).toBe("event-123");
        });

        it("creates an event using the first writable calendar on Android", async () => {
            (Platform as any).OS = "android";
            (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
            (Calendar.getCalendarsAsync as jest.Mock).mockResolvedValue([
                { id: "cal-readonly", allowsModifications: false },
                { id: "cal-writable", allowsModifications: true },
            ]);
            (Calendar.createEventAsync as jest.Mock).mockResolvedValue("event-456");

            const eventId = await addChoreToCalendar("Take out trash", undefined, date);

            expect(Calendar.createEventAsync).toHaveBeenCalledWith("cal-writable", expect.objectContaining({
                title: "Take out trash",
            }));
            expect(eventId).toBe("event-456");
        });

        it("sets endDate 30 minutes after startDate and a reminder alarm 30 minutes before", async () => {
            (Platform as any).OS = "ios";
            (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
            (Calendar.getDefaultCalendarAsync as jest.Mock).mockResolvedValue({ id: "ios-default-cal" });
            (Calendar.createEventAsync as jest.Mock).mockResolvedValue("event-789");

            await addChoreToCalendar("Take out trash", undefined, date);

            const callArgs = (Calendar.createEventAsync as jest.Mock).mock.calls[0][1];
            expect(callArgs.endDate.getTime() - callArgs.startDate.getTime()).toBe(30 * 60 * 1000);
            expect(callArgs.alarms).toEqual([{ relativeOffset: -30 }]);
        });
    });
});