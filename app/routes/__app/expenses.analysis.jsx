import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import Chart from "~/components/expenses/Chart";
import ExpenseStatistics from "~/components/expenses/ExpensesStatistics";
import { getExpenses } from "~/data/expenses.server";
import Error from "~/components/util/Error";
import { requireUserSession } from "~/data/auth.server";

export default function ExpensesAnalysisPage() {
  const expenses = useLoaderData();
  return (
    <main>
      <Chart expenses={expenses} />
      <ExpenseStatistics expenses={expenses} />
    </main>
  );
}

export async function loader({ request }) {
  const userId = await requireUserSession(request);
  const expenses = await getExpenses(userId);
  if (!expenses || expenses.length === 0) {
    throw json(
      { message: "Could not load" },
      { status: 404, statusText: "Expense not found" }
    );
  }
  return expenses;
}

export function CatchBoundary() {
  const caughtResponse = useCatch();
  return (
    <main>
      <Error title={caughtResponse.statusText}>
        <p>
          {caughtResponse.data?.message ||
            "Something went wrong - could not load expenses."}
        </p>
      </Error>
    </main>
  );
}
