interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: 'income' | 'deduction' | 'expense' | 'not_useful';
  taxSection?: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-01-01', description: 'Salary Credit', amount: 70000, category: 'income' },
  { id: '2', date: '2024-01-05', description: 'Rent Payment', amount: -15000, category: 'expense' },
  { id: '3', date: '2024-01-10', description: 'LIC Premium', amount: -10000, category: 'deduction', taxSection: '80C' },
  { id: '4', date: '2024-01-15', description: 'Swiggy Orders', amount: -2000, category: 'not_useful' },
  { id: '5', date: '2024-01-20', description: 'Health Insurance', amount: -7000, category: 'deduction', taxSection: '80D' },
  { id: '6', date: '2024-01-25', description: 'Netflix Subscription', amount: -500, category: 'not_useful' },
  { id: '7', date: '2024-02-01', description: 'Salary Credit', amount: 70000, category: 'income' },
  { id: '8', date: '2024-02-03', description: 'Grocery Shopping', amount: -6000, category: 'expense' },
  { id: '9', date: '2024-02-10', description: 'ELSS Investment', amount: -15000, category: 'deduction', taxSection: '80C' },
  { id: '10', date: '2024-02-20', description: 'Phone Bill', amount: -1200, category: 'expense' },
  { id: '11', date: '2024-03-01', description: 'Salary Credit', amount: 70000, category: 'income' },
  { id: '12', date: '2024-03-01', description: 'Freelancing Income', amount: 20000, category: 'income' },
  { id: '13', date: '2024-03-05', description: 'Donation to NGO', amount: -4000, category: 'deduction', taxSection: '80G' },
  { id: '14', date: '2024-03-10', description: 'Home Loan Interest', amount: -12000, category: 'deduction', taxSection: '24' },
  { id: '15', date: '2024-03-15', description: 'Zomato Food', amount: -1800, category: 'not_useful' },
  { id: '16', date: '2024-04-01', description: 'Salary Credit', amount: 70000, category: 'income' },
  { id: '17', date: '2024-04-08', description: 'Life Insurance Premium', amount: -10000, category: 'deduction', taxSection: '80C' },
  { id: '18', date: '2024-04-20', description: 'Internet Bill', amount: -1000, category: 'expense' },
  { id: '19', date: '2024-05-01', description: 'Salary Credit', amount: 70000, category: 'income' },
  { id: '20', date: '2024-05-05', description: 'Mutual Fund SIP', amount: -5000, category: 'deduction', taxSection: '80C' },
  { id: '21', date: '2024-05-15', description: 'Petrol Expenses', amount: -4500, category: 'expense' },
  { id: '22', date: '2024-06-01', description: 'Salary Credit', amount: 70000, category: 'income' },
  { id: '23', date: '2024-06-01', description: 'Freelance Income', amount: 25000, category: 'income' },
  { id: '24', date: '2024-06-10', description: 'Gym Membership', amount: -3000, category: 'not_useful' },
  { id: '25', date: '2024-06-15', description: 'Restaurant Bill', amount: -3500, category: 'not_useful' },
  { id: '26', date: '2024-07-01', description: 'Salary Credit', amount: 70000, category: 'income' },
  { id: '27', date: '2024-07-10', description: 'PPF Contribution', amount: -12000, category: 'deduction', taxSection: '80C' },
  { id: '28', date: '2024-07-20', description: 'Utility Bills', amount: -2500, category: 'expense' },
  { id: '29', date: '2024-08-01', description: 'Salary Credit', amount: 70000, category: 'income' },
  { id: '30', date: '2024-08-15', description: 'Movie Tickets', amount: -1200, category: 'not_useful' },
  { id: '31', date: '2024-09-01', description: 'Salary Credit', amount: 70000, category: 'income' },
  { id: '32', date: '2024-09-01', description: 'Side Project Income', amount: 30000, category: 'income' },
  { id: '33', date: '2024-09-05', description: 'Term Insurance Premium', amount: -8000, category: 'deduction', taxSection: '80C' },
  { id: '34', date: '2024-09-25', description: 'Credit Card EMI', amount: -5000, category: 'expense' },
  { id: '35', date: '2024-10-01', description: 'Salary Credit', amount: 70000, category: 'income' },
  { id: '36', date: '2024-10-15', description: 'Doctor Visit', amount: -2000, category: 'deduction', taxSection: '80D' },
  { id: '37', date: '2024-10-20', description: 'Clothes Shopping', amount: -4000, category: 'not_useful' },
  { id: '38', date: '2024-11-01', description: 'Salary Credit', amount: 70000, category: 'income' },
  { id: '39', date: '2024-11-10', description: 'Donation to Trust', amount: -3000, category: 'deduction', taxSection: '80G' },
  { id: '40', date: '2024-11-15', description: 'Festival Gifts', amount: -5000, category: 'not_useful' },
  { id: '41', date: '2024-12-01', description: 'Salary Credit', amount: 70000, category: 'income' },
  { id: '42', date: '2024-12-01', description: 'Freelance Income', amount: 15000, category: 'income' },
  { id: '43', date: '2024-12-10', description: 'Family Dinner', amount: -2800, category: 'not_useful' },
  { id: '44', date: '2024-12-20', description: 'Internet Recharge', amount: -1200, category: 'expense' },
];

function categorizeBankData(transactions: Transaction[]) {
  const summary = {
    totalIncome: 0,
    totalExpenses: 0,
    deductions: {
      '80C': 0,
      '80D': 0,
      '80G': 0,
      '24': 0
    }
  };
  for (const tx of transactions) {
    if (tx.category === 'income') {
      summary.totalIncome += tx.amount;
    } else if (tx.category === 'deduction' && tx.taxSection) {
      summary.deductions[tx.taxSection] += -tx.amount;
    } else if (tx.category === 'expense') {
      summary.totalExpenses += -tx.amount;
    }
  }
  return summary;
}

function getBankDataSuggestions(transactions: Transaction[]) {
  const summary = categorizeBankData(transactions);
  return {
    annualIncome: summary.totalIncome, // just sum, no multiplying
    section80C: summary.deductions['80C'],
    section80D: summary.deductions['80D'],
    section80G: summary.deductions['80G'],
    homeLoanInterest: summary.deductions['24'],
    usefulExpenses: summary.totalExpenses
  };
}

function displayAnnualSummary(transactions: Transaction[]) {
  const totalIncome = transactions
    .filter(tx => tx.category === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Group deductions by taxSection and sum
  const deductionMap: Record<string, number> = {};
  let totalDeductions = 0;
  transactions.forEach(tx => {
    if (tx.category === "deduction" && tx.taxSection) {
      if (!deductionMap[tx.taxSection]) deductionMap[tx.taxSection] = 0;
      deductionMap[tx.taxSection] += Math.abs(tx.amount);
      totalDeductions += Math.abs(tx.amount);
    }
  });

  let output = `Annual Income: ₹${totalIncome.toLocaleString()}`;
  output += `\n\nDeductions:`;
  for (const [section, amount] of Object.entries(deductionMap)) {
    let label = section;
    if (section === "80C") label += " (PPF/ELSS/Insurance)";
    if (section === "80D") label += " (Health)";
    if (section === "80G") label += " (Donations)";
    if (section === "24") label += " (Home Loan Interest)";
    output += `\n- ${label}: ₹${amount.toLocaleString()}`;
  }
  output += `\n\nTotal Deductions: ₹${totalDeductions.toLocaleString()}`;
  output += `\n\nTaxable Income: ₹${(totalIncome - totalDeductions).toLocaleString()}`;
  return output;
}

const getFinalTaxSummary = () => {
  // Calculate total annual income
  const totalAnnualIncome = mockTransactions
    .filter(t => t.category === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate deductions
  const total80C = mockTransactions
    .filter(t => t.category === 'deduction' && t.taxSection === '80C')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const total80D = mockTransactions
    .filter(t => t.category === 'deduction' && t.taxSection === '80D')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const total80G = mockTransactions
    .filter(t => t.category === 'deduction' && t.taxSection === '80G')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const total24 = mockTransactions
    .filter(t => t.category === 'deduction' && t.taxSection === '24')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalDeductions = total80C + total80D + total80G + total24;
  const taxableIncome = totalAnnualIncome - totalDeductions;

  return {
    totalAnnualIncome,
    total80C,
    total80D,
    total80G,
    total24,
    totalDeductions,
    taxableIncome,
  };
};

const getMonthlyBreakdown = () => {
  const monthlyIncome = mockTransactions
    .filter(t => t.category === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyDeductions = {
    '80C': mockTransactions
      .filter(t => t.category === 'deduction' && t.taxSection === '80C')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    '80D': mockTransactions
      .filter(t => t.category === 'deduction' && t.taxSection === '80D')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    '80G': mockTransactions
      .filter(t => t.category === 'deduction' && t.taxSection === '80G')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    '24': mockTransactions
      .filter(t => t.category === 'deduction' && t.taxSection === '24')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
  };

  const monthlyExpenses = mockTransactions
    .filter(t => t.category === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return {
    monthlyIncome,
    monthlyDeductions,
    monthlyExpenses,
  };
};

export {
  mockTransactions,
  categorizeBankData,
  getBankDataSuggestions,
  getFinalTaxSummary,
  getMonthlyBreakdown,
  displayAnnualSummary
};