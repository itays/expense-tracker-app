import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseSchema>;

const fakeExpenses: Expense[] = [
  {
    id: 1,
    title: "Groceries",
    amount: 100,
    date: new Date(),
  },
  {
    id: 2,
    title: "Rent",
    amount: 1000,
    date: new Date(),
  },
];

const createPostSchema = expenseSchema.omit({ id: true });

export const expensesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const expense = await c.req.valid("json");
    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 } as Expense);
    c.status(201);
    return c.json({ message: "Expense created!" });
  })
  .get("/total-spent", (c) => {
    const total = fakeExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    return c.json({ total });
  })
  .get("/:id{[0-9+]}", (c) => {
    const id = Number(c.req.param("id"));
    const expense = fakeExpenses.find((e) => e.id === id);
    if (!expense) {
      return c.notFound();
    }
    return c.json({ expense });
  })
  .delete("/:id{[0-9+]}", (c) => {
    const id = Number(c.req.param("id"));
    const index = fakeExpenses.findIndex((e) => e.id === id);
    if (index === -1) {
      return c.notFound();
    }
    const deleted = fakeExpenses.splice(index, 1)[0];
    return c.json({ expense: deleted });
  });
