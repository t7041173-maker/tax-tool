interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: 'income' | 'deduction' | 'expense';
  taxSection?: string;
}

export const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-01-15', description: 'Salary Credit', amount: 65000, category: 'income' },
  { id: '2', date: '2024-01-20', description: 'LIC Premium Payment', amount: -12000, category: 'deduction', taxSection: '80C' },
  { id: '3', date: '2024-01-25', description: 'Rent Payment', amount: -15000, category: 'expense' },
  { id: '4', date: '2024-02-01', description: 'Health Insurance Premium', amount: -8000, category: 'deduction', taxSection: '80D' },
  { id: '5', date: '2024-02-15', description: 'Salary Credit', amount: 65000, category: 'income' },
  { id: '6', date: '2024-02-20', description: 'ELSS Investment', amount: -25000, category: 'deduction', taxSection: '80C' },
  { id: '7', date: '2024-03-01', description: 'Donation to NGO', amount: -5000, category: 'deduction', taxSection: '80G' },
  { id: '8', date: '2024-03-15', description: 'Salary Credit', amount: 65000, category: 'income' },
  { id: '9', date: '2024-03-25', description: 'Home Loan Interest', amount: -18000, category: 'deduction', taxSection: '24' },
  { id: '10', date: '2024-04-10', description: 'Freelancing Income', amount: 25000, category: 'income' },
];

export const categorizeBankData = () => {
  const summary = {
    totalIncome: 0,
    deductions: {
      '80C': 0,
      '80D': 0,
      '80G': 0,
      '24': 0,
    },
    expenses: 0,
  };

  mockTransactions.forEach(transaction => {
    if (transaction.category === 'income') {
      summary.totalIncome += transaction.amount;
    } else if (transaction.category === 'deduction' && transaction.taxSection) {
      summary.deductions[transaction.taxSection as keyof typeof summary.deductions] += Math.abs(transaction.amount);
    } else if (transaction.category === 'expense') {
      summary.expenses += Math.abs(transaction.amount);
    }
  });

  return { transactions: mockTransactions, summary };
};

export const getBankDataSuggestions = () => {
  const { summary } = categorizeBankData();
  
  return {
    annualIncome: summary.totalIncome * 12,
    section80C: summary.deductions['80C'] * 12,
    section80D: summary.deductions['80D'] * 12,
    section80G: summary.deductions['80G'] * 12,
    homeLoanInterest: summary.deductions['24'] * 12,
  };
};