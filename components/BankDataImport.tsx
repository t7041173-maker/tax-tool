import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Upload } from 'lucide-react-native';

interface BankDataImportProps {
  onDataImport: (data: any) => void;
}

const BankDataImport: React.FC<BankDataImportProps> = ({ onDataImport }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const mockTransactions = [
    { id: '1', date: '2024-01-01', description: 'Salary Credit', amount: 70000, category: 'income' },
    { id: '2', date: '2024-01-10', description: 'LIC Premium', amount: -10000, category: 'deduction', taxSection: '80C' },
    { id: '3', date: '2024-01-20', description: 'Health Insurance', amount: -7000, category: 'deduction', taxSection: '80D' },
    { id: '4', date: '2024-02-01', description: 'Salary Credit', amount: 70000, category: 'income' },
    { id: '5', date: '2024-02-10', description: 'ELSS Investment', amount: -15000, category: 'deduction', taxSection: '80C' },
  ];

  const handleFetchBankData = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 2000);
  };

  const handleApplySuggestions = () => {
    const suggestions = {
      annualIncome: 840000,
      section80C: 25000,
      section80D: 7000,
      section80G: 0,
      homeLoanInterest: 0
    };
    
    onDataImport(suggestions);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Auto-Fill from Bank Data</Text>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleFetchBankData}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Import Bank Transactions</Text>
            )}
          </TouchableOpacity>
        </View>

        {transactions.length > 0 && (
          <>
            <ScrollView style={styles.transactionsContainer}>
              {transactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                    <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={[
                      styles.transactionAmount,
                      { color: transaction.amount > 0 ? '#28a745' : '#dc3545' }
                    ]}>
                      ₹{Math.abs(transaction.amount).toLocaleString()}
                    </Text>
                    <View style={[
                      styles.categoryBadge,
                      { backgroundColor: transaction.category === 'income' ? '#d4edda' : '#fff3cd' }
                    ]}>
                      <Text style={[
                        styles.categoryText,
                        { color: transaction.category === 'income' ? '#155724' : '#856404' }
                      ]}>
                        {transaction.taxSection || transaction.category}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Auto-Detected Tax Data:</Text>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Annual Income:</Text>
                <Text style={styles.summaryValue}>₹8,40,000</Text>
              </View>

              <Text style={styles.deductionsTitle}>Total Deductions: ₹32,000</Text>
              
              <View style={styles.deductionsGrid}>
                <View style={styles.deductionItem}>
                  <Text style={styles.deductionLabel}>80C Deductions:</Text>
                  <Text style={styles.deductionValue}>₹25,000</Text>
                </View>
                <View style={styles.deductionItem}>
                  <Text style={styles.deductionLabel}>80D Deductions:</Text>
                  <Text style={styles.deductionValue}>₹7,000</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplySuggestions}
              >
                <Text style={styles.applyButtonText}>Apply to Tax Calculator</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  button: {
    backgroundColor: '#0070ba',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  transactionLeft: {
    flex: 1,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deductionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    color: '#6c757d',
  },
  deductionsGrid: {
    marginBottom: 16,
  },
  deductionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  deductionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  deductionValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#0070ba',
    paddingVertical: 12,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default BankDataImport;