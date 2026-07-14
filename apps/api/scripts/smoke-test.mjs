const API_URL = process.env.API_URL ?? 'http://localhost:3333';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`${options.method ?? 'GET'} ${path} -> ${response.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function main() {
  const email = `test-${Date.now()}@email.com`;

  const auth = await request('/auth/register', {
    method: 'POST',
    body: { name: 'Test User', email, password: 'senha123' },
  });

  const trip = await request('/trips', {
    method: 'POST',
    token: auth.accessToken,
    body: {
      name: 'Viagem teste',
      initials: 'VT',
      startDate: '2026-06-10',
      endDate: '2026-06-15',
      baseCurrency: 'BRL',
      totalBudget: '1000.00',
    },
  });

  const member = await request(`/trips/${trip.id}/members`, {
    method: 'POST',
    token: auth.accessToken,
    body: { name: 'Ana', initials: 'AN' },
  });

  const expense = await request(`/trips/${trip.id}/expenses`, {
    method: 'POST',
    token: auth.accessToken,
    body: {
      description: 'Almoço',
      amount: '100.00',
      currency: 'BRL',
      date: '2026-06-11',
      category: 'comida',
      payerId: member.id,
      splits: [{ memberId: member.id, share: '100.00' }],
    },
  });

  const expenses = await request(`/trips/${trip.id}/expenses?page=1&limit=10`, {
    token: auth.accessToken,
  });

  if (!Array.isArray(expenses.data) || expenses.data.length !== 1) {
    throw new Error(`Expected 1 expense in paginated data, got ${expenses.data?.length}`);
  }

  if (expenses.meta?.total !== 1 || expenses.meta?.page !== 1 || expenses.meta?.limit !== 10) {
    throw new Error(`Unexpected pagination meta: ${JSON.stringify(expenses.meta)}`);
  }

  const summary = await request(`/trips/${trip.id}/summary`, {
    token: auth.accessToken,
  });

  const balances = await request(`/trips/${trip.id}/balances`, {
    token: auth.accessToken,
  });

  console.log('Smoke test OK');
  console.log({ user: auth.user.email, tripId: trip.id, expenseId: expense.id, totalSpent: summary.totalSpent, balances });
}

main().catch((error) => {
  console.error('Smoke test failed:', error.message);
  process.exit(1);
});
