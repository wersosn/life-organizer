import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import { getTransactions, getMonthlySummary, deleteTransaction } from "@/api/transactionsApi";
import { router } from "expo-router";
import { TransactionType } from "@/types/transaction";
import { TransactionsView } from "@/components/TransactionView";

jest.mock("@/api/transactionsApi", () => ({
    getTransactions: jest.fn(),
    getMonthlySummary: jest.fn(),
    deleteTransaction: jest.fn(),
}));

jest.mock("expo-router", () => ({
    router: { push: jest.fn() },
    useFocusEffect: (callback: () => void) => callback(),
}));

const mockTransactions = [
    {
        id: "1",
        categoryId: "cat-1",
        categoryName: "Food",
        amount: 49.99,
        type: TransactionType.Expense,
        description: undefined,
        date: "2026-07-25",
    },
];

const mockSummary = {
    year: 2026,
    month: 7,
    totalIncome: 3000,
    totalExpense: 1200,
    balance: 1800,
    expensesByCategory: [],
};

describe("TransactionsView", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("shows an empty state when there are no transactions", async () => {
        (getTransactions as jest.Mock).mockResolvedValue([]);
        (getMonthlySummary as jest.Mock).mockResolvedValue(mockSummary);

        render(<TransactionsView />);

        await waitFor(() => {
            expect(screen.getByText("No transactions yet. Tap + to add one.")).toBeTruthy();
        });
    });

    it("renders a list of transactions fetched from the API", async () => {
        (getTransactions as jest.Mock).mockResolvedValue(mockTransactions);
        (getMonthlySummary as jest.Mock).mockResolvedValue(mockSummary);

        render(<TransactionsView />);

        await waitFor(() => {
            expect(screen.getByText("Food")).toBeTruthy();
        });
    });

    it("renders the monthly summary totals", async () => {
        (getTransactions as jest.Mock).mockResolvedValue([]);
        (getMonthlySummary as jest.Mock).mockResolvedValue(mockSummary);

        render(<TransactionsView />);

        await waitFor(() => {
            expect(screen.getByText("+3000.00 zł")).toBeTruthy();
            expect(screen.getByText("-1200.00 zł")).toBeTruthy();
            expect(screen.getByText("1800.00 zł")).toBeTruthy();
        });
    });

    it("does not render the summary card while summary is null", async () => {
        (getTransactions as jest.Mock).mockResolvedValue([]);
        // symulacja trwającego ładowania — Promise się jeszcze nie rozwiązał
        (getMonthlySummary as jest.Mock).mockReturnValue(new Promise(() => {}));

        render(<TransactionsView />);

        expect(screen.queryByText("Income")).toBeNull();
    });

    it("calls getTransactions and getMonthlySummary with the current year and month on mount", async () => {
        (getTransactions as jest.Mock).mockResolvedValue([]);
        (getMonthlySummary as jest.Mock).mockResolvedValue(mockSummary);

        render(<TransactionsView />);

        const now = new Date();

        await waitFor(() => {
            expect(getMonthlySummary).toHaveBeenCalledWith(now.getFullYear(), now.getMonth() + 1);
        });
    });

    it("navigates to updateTransaction with the correct params when editing", async () => {
        (getTransactions as jest.Mock).mockResolvedValue(mockTransactions);
        (getMonthlySummary as jest.Mock).mockResolvedValue(mockSummary);

        render(<TransactionsView />);

        await waitFor(() => expect(screen.getByText("Food")).toBeTruthy());

        fireEvent.press(screen.getByTestId("edit-button"));

        expect(router.push).toHaveBeenCalledWith({
            pathname: "../(finances)/updateTransaction",
            params: {
                id: "1",
                categoryId: "cat-1",
                amount: "49.99",
                type: String(TransactionType.Expense),
                description: "",
                date: "2026-07-25",
            },
        });
    });

    it("shows a confirmation alert before deleting, and removes the transaction on confirm", async () => {
        (getTransactions as jest.Mock).mockResolvedValue(mockTransactions);
        (getMonthlySummary as jest.Mock).mockResolvedValue(mockSummary);
        (deleteTransaction as jest.Mock).mockResolvedValue(undefined);

        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation((title, message, buttons) => {
            buttons?.find(b => b.text === "Delete")?.onPress?.();
        });

        render(<TransactionsView />);

        await waitFor(() => expect(screen.getByText("Food")).toBeTruthy());

        fireEvent.press(screen.getByTestId("delete-button"));

        expect(alertSpy).toHaveBeenCalled();
        await waitFor(() => expect(deleteTransaction).toHaveBeenCalledWith("1"));

        alertSpy.mockRestore();
    });

    it("does not call deleteTransaction when the alert is dismissed", async () => {
        (getTransactions as jest.Mock).mockResolvedValue(mockTransactions);
        (getMonthlySummary as jest.Mock).mockResolvedValue(mockSummary);

        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

        render(<TransactionsView />);

        await waitFor(() => expect(screen.getByText("Food")).toBeTruthy());

        fireEvent.press(screen.getByTestId("delete-button"));

        expect(deleteTransaction).not.toHaveBeenCalled();

        alertSpy.mockRestore();
    });

    it("rolls back the transaction list when deleteTransaction fails", async () => {
        (getTransactions as jest.Mock).mockResolvedValue(mockTransactions);
        (getMonthlySummary as jest.Mock).mockResolvedValue(mockSummary);
        (deleteTransaction as jest.Mock).mockRejectedValue(new Error("network error"));

        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation((title, message, buttons) => {
            buttons?.find(b => b.text === "Delete")?.onPress?.();
        });

        render(<TransactionsView />);

        await waitFor(() => expect(screen.getByText("Food")).toBeTruthy());

        fireEvent.press(screen.getByTestId("delete-button"));

        await waitFor(() => expect(deleteTransaction).toHaveBeenCalled());

        expect(screen.getByText("Food")).toBeTruthy();

        alertSpy.mockRestore();
    });
});