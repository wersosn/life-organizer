import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import { BudgetsView } from "@/components/BudgetsView";
import { getBudgetsWithUsage, deleteBudget } from "@/api/budgetsApi";
import { router } from "expo-router";

jest.mock("@/api/budgetsApi", () => ({
    getBudgetsWithUsage: jest.fn(),
    deleteBudget: jest.fn(),
}));

jest.mock("expo-router", () => ({
    router: { push: jest.fn() },
    useFocusEffect: (callback: () => void) => callback(),
}));

const mockBudgets = [
    {
        id: "1",
        categoryId: "cat-1",
        categoryName: "Food",
        monthlyLimit: 500,
        spent: 150,
        remaining: 350,
        percentageUsed: 30,
        isExceeded: false,
    },
];

describe("BudgetsView", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("shows an empty state when there are no budgets", async () => {
        (getBudgetsWithUsage as jest.Mock).mockResolvedValue([]);

        render(<BudgetsView />);

        await waitFor(() => {
            expect(screen.getByText("No budgets yet. Tap + to set one up.")).toBeTruthy();
        });
    });

    it("renders a list of budgets fetched from the API", async () => {
        (getBudgetsWithUsage as jest.Mock).mockResolvedValue(mockBudgets);

        render(<BudgetsView />);

        await waitFor(() => {
            expect(screen.getByText("Food")).toBeTruthy();
        });
    });

    it("calls getBudgetsWithUsage with the current year and month", async () => {
        (getBudgetsWithUsage as jest.Mock).mockResolvedValue([]);

        render(<BudgetsView />);

        const now = new Date();

        await waitFor(() => {
            expect(getBudgetsWithUsage).toHaveBeenCalledWith(now.getFullYear(), now.getMonth() + 1);
        });
    });

    it("navigates to updateBudget with the correct params when editing", async () => {
        (getBudgetsWithUsage as jest.Mock).mockResolvedValue(mockBudgets);

        render(<BudgetsView />);

        await waitFor(() => expect(screen.getByText("Food")).toBeTruthy());

        fireEvent.press(screen.getByTestId("edit-button"));

        expect(router.push).toHaveBeenCalledWith({
            pathname: "../(finances)/updateBudget",
            params: {
                id: "1",
                categoryName: "Food",
                monthlyLimit: "500",
            },
        });
    });

    it("shows a confirmation alert before deleting, and removes the budget on confirm", async () => {
        (getBudgetsWithUsage as jest.Mock).mockResolvedValue(mockBudgets);
        (deleteBudget as jest.Mock).mockResolvedValue(undefined);

        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation((title, message, buttons) => {
            const deleteButton = buttons?.find(b => b.text === "Delete");
            deleteButton?.onPress?.();
        });

        render(<BudgetsView />);

        await waitFor(() => expect(screen.getByText("Food")).toBeTruthy());

        fireEvent.press(screen.getByTestId("delete-button"));

        expect(alertSpy).toHaveBeenCalled();
        await waitFor(() => expect(deleteBudget).toHaveBeenCalledWith("1"));

        alertSpy.mockRestore();
    });

    it("does not call deleteBudget when the alert is dismissed with Cancel", async () => {
        (getBudgetsWithUsage as jest.Mock).mockResolvedValue(mockBudgets);

        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {
            // "Cancel" is the first button, so we do nothing to simulate dismissal
        });

        render(<BudgetsView />);

        await waitFor(() => expect(screen.getByText("Food")).toBeTruthy());

        fireEvent.press(screen.getByTestId("delete-button"));

        expect(deleteBudget).not.toHaveBeenCalled();

        alertSpy.mockRestore();
    });

    it("rolls back the budget list when deleteBudget fails", async () => {
        (getBudgetsWithUsage as jest.Mock).mockResolvedValue(mockBudgets);
        (deleteBudget as jest.Mock).mockRejectedValue(new Error("network error"));

        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation((title, message, buttons) => {
            buttons?.find(b => b.text === "Delete")?.onPress?.();
        });

        render(<BudgetsView />);
        await waitFor(() => expect(screen.getByText("Food")).toBeTruthy());

        fireEvent.press(screen.getByTestId("delete-button"));

        await waitFor(() => expect(deleteBudget).toHaveBeenCalled());

        expect(screen.getByText("Food")).toBeTruthy();

        alertSpy.mockRestore();
    });
});