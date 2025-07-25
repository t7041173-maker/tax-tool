import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface TaxCalculation {
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  incomeTax: number;
  cess: number;
  totalTax: number;
  netIncome: number;
}

interface TaxCalculatorProps {
  onTaxDataChange?: (data: any) => void;
  income: string;
  setIncome: (val: string) => void;
  employmentType: string;
  setEmploymentType: (val: string) => void;
  ageGroup: string;
  setAgeGroup: (val: string) => void;
  deductions80C: number;
  setDeductions80C: (val: number) => void;
  deductions80D: number;
  setDeductions80D: (val: number) => void;
  hraExemption: number;
  setHraExemption: (val: number) => void;
  homeLoanInterest: number;
  setHomeLoanInterest: (val: number) => void;
  educationLoanInterest: number;
  setEducationLoanInterest: (val: number) => void;
  nps: number;
  setNps: (val: number) => void;
  deductions80G: number;
  setDeductions80G: (val: number) => void;
  regime: string;
  setRegime: (val: string) => void;
  taxResult: any;
  setTaxResult: (val: any) => void;
  isCalculated: boolean;
  setIsCalculated: (val: boolean) => void;
}

const TaxCalculator: React.FC<TaxCalculatorProps> = ({
  onTaxDataChange,
  income,
  setIncome,
  employmentType,
  setEmploymentType,
  ageGroup,
  setAgeGroup,
  deductions80C,
  setDeductions80C,
  deductions80D,
  setDeductions80D,
  hraExemption,
  setHraExemption,
  homeLoanInterest,
  setHomeLoanInterest,
  educationLoanInterest,
  setEducationLoanInterest,
  nps,
  setNps,
  deductions80G,
  setDeductions80G,
  regime,
  setRegime,
  taxResult,
  setTaxResult,
  isCalculated,
  setIsCalculated,
}) => {
  const getAgeFromGroup = (ageGroup: string): number => {
    switch (ageGroup) {
      case "below60": return 30;
      case "60to80": return 65;
      case "above80": return 85;
      default: return 30;
    }
  };

  const calculateOldRegime = (annualIncome: number, userAge: number): TaxCalculation => {
    const standardDeduction = employmentType === "salaried" ? 50000 : 0;
    const totalDeductions = Math.min(deductions80C, 150000) + 
                           Math.min(deductions80D, userAge >= 60 ? 50000 : 25000) + 
                           Math.min(homeLoanInterest, 200000) + 
                           Math.min(hraExemption, annualIncome * 0.5) +
                           educationLoanInterest +
                           Math.min(nps, annualIncome * 0.1) +
                           deductions80G +
                           standardDeduction;

    const taxableIncome = Math.max(0, annualIncome - totalDeductions);
    
    let exemptionLimit = 250000;
    if (userAge >= 80) exemptionLimit = 500000;
    else if (userAge >= 60) exemptionLimit = 300000;
    
    let tax = 0;
    if (taxableIncome > exemptionLimit) {
      tax += Math.min(taxableIncome - exemptionLimit, 500000 - exemptionLimit) * 0.05;
    }
    if (taxableIncome > 500000) {
      tax += Math.min(taxableIncome - 500000, 500000) * 0.2;
    }
    if (taxableIncome > 1000000) {
      tax += (taxableIncome - 1000000) * 0.3;
    }
    
    if (taxableIncome <= 500000) {
      tax = Math.max(0, tax - 12500);
    }
    
    const cess = tax * 0.04;
    const totalTax = tax + cess;
    
    return {
      grossIncome: annualIncome,
      totalDeductions,
      taxableIncome,
      incomeTax: tax,
      cess,
      totalTax,
      netIncome: annualIncome - totalTax
    };
  };

  const calculateNewRegime = (annualIncome: number): TaxCalculation => {
    const standardDeduction = 50000;
    const taxableIncome = Math.max(0, annualIncome - standardDeduction);
    
    let tax = 0;
    if (taxableIncome > 300000) {
      tax += Math.min(taxableIncome - 300000, 300000) * 0.05;
    }
    if (taxableIncome > 600000) {
      tax += Math.min(taxableIncome - 600000, 300000) * 0.1;
    }
    if (taxableIncome > 900000) {
      tax += Math.min(taxableIncome - 900000, 300000) * 0.15;
    }
    if (taxableIncome > 1200000) {
      tax += Math.min(taxableIncome - 1200000, 300000) * 0.2;
    }
    if (taxableIncome > 1500000) {
      tax += (taxableIncome - 1500000) * 0.3;
    }
    
    if (taxableIncome <= 700000) {
      tax = Math.max(0, tax - 25000);
    }
    
    const cess = tax * 0.04;
    const totalTax = tax + cess;
    
    return {
      grossIncome: annualIncome,
      totalDeductions: standardDeduction,
      taxableIncome,
      incomeTax: tax,
      cess,
      totalTax,
      netIncome: annualIncome - totalTax
    };
  };

  const handleCalculate = () => {
    const annualIncome = Number(income) || 0;
    const userAge = getAgeFromGroup(ageGroup);

    if (annualIncome <= 0) {
      Alert.alert("Error", "Please enter a valid annual income");
      return;
    }

    const oldRegimeCalc = calculateOldRegime(annualIncome, userAge);
    const newRegimeCalc = calculateNewRegime(annualIncome);
    const savings = oldRegimeCalc.totalTax - newRegimeCalc.totalTax;
    let recommendedRegime = 'New Regime';
    if (oldRegimeCalc.totalTax < newRegimeCalc.totalTax) {
      recommendedRegime = 'Old Regime';
    }

    const result = {
      old: oldRegimeCalc,
      new: newRegimeCalc,
      savings,
      recommendedRegime
    };

    setTaxResult(result);
    setIsCalculated(true);

    if (onTaxDataChange) {
      onTaxDataChange({
        income: annualIncome,
        deductions: {
          section80C: deductions80C,
          section80D: deductions80D,
          hraExemption: hraExemption,
          homeLoanInterest: homeLoanInterest,
          educationLoanInterest: educationLoanInterest,
          nps: nps,
          section80G: deductions80G,
          standardDeduction: 50000
        },
        ageGroup,
        regime,
        oldRegimeTax: oldRegimeCalc.totalTax,
        newRegimeTax: newRegimeCalc.totalTax,
        recommendation: recommendedRegime,
        savings
      });
    }
  };

  const handleReset = () => {
    setIncome("");
    setEmploymentType("salaried");
    setAgeGroup("below60");
    setDeductions80C(0);
    setDeductions80D(0);
    setHraExemption(0);
    setHomeLoanInterest(0);
    setEducationLoanInterest(0);
    setNps(0);
    setDeductions80G(0);
    setRegime("new");
    setTaxResult(null);
    setIsCalculated(false);
    if (onTaxDataChange) {
      onTaxDataChange(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tax Calculator</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Annual Income (₹)</Text>
          <TextInput
            style={styles.input}
            value={income}
            onChangeText={setIncome}
            placeholder="Enter your annual income"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Employment Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={employmentType}
              onValueChange={setEmploymentType}
              style={styles.picker}
            >
              <Picker.Item label="Salaried (Employed)" value="salaried" />
              <Picker.Item label="Self-Employed" value="self-employed" />
              <Picker.Item label="Business Owner" value="business" />
              <Picker.Item label="Freelancer" value="freelancer" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age Group</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={ageGroup}
              onValueChange={setAgeGroup}
              style={styles.picker}
            >
              <Picker.Item label="Below 60 years" value="below60" />
              <Picker.Item label="60-80 years (Senior Citizen)" value="60to80" />
              <Picker.Item label="Above 80 years (Very Senior)" value="above80" />
            </Picker>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>80C Investments (₹)</Text>
            <TextInput
              style={styles.input}
              value={deductions80C.toString()}
              onChangeText={(text) => setDeductions80C(Number(text) || 0)}
              placeholder="Max ₹1,50,000"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>80D Health Insurance (₹)</Text>
            <TextInput
              style={styles.input}
              value={deductions80D.toString()}
              onChangeText={(text) => setDeductions80D(Number(text) || 0)}
              placeholder="Max ₹25,000"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>HRA Exemption (₹)</Text>
            <TextInput
              style={styles.input}
              value={hraExemption.toString()}
              onChangeText={(text) => setHraExemption(Number(text) || 0)}
              placeholder="House Rent Allowance"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Home Loan Interest (₹)</Text>
            <TextInput
              style={styles.input}
              value={homeLoanInterest.toString()}
              onChangeText={(text) => setHomeLoanInterest(Number(text) || 0)}
              placeholder="Max ₹2,00,000"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Education Loan Interest (₹)</Text>
            <TextInput
              style={styles.input}
              value={educationLoanInterest.toString()}
              onChangeText={(text) => setEducationLoanInterest(Number(text) || 0)}
              placeholder="No limit (Section 80E)"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>80G Donations (₹)</Text>
            <TextInput
              style={styles.input}
              value={deductions80G.toString()}
              onChangeText={(text) => setDeductions80G(Number(text) || 0)}
              placeholder="Charitable donations"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleCalculate}>
            <Text style={styles.primaryButtonText}>Calculate Tax</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleReset}>
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {isCalculated && taxResult && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Tax Calculation Results</Text>
            
            <View style={styles.comparisonRow}>
              <View style={styles.regimeCard}>
                <Text style={styles.regimeTitle}>Old Regime</Text>
                <Text style={styles.taxAmount}>₹{taxResult.old.totalTax.toLocaleString()}</Text>
                <Text style={styles.netIncome}>Net: ₹{taxResult.old.netIncome.toLocaleString()}</Text>
              </View>
              
              <View style={styles.regimeCard}>
                <Text style={styles.regimeTitle}>New Regime</Text>
                <Text style={styles.taxAmount}>₹{taxResult.new.totalTax.toLocaleString()}</Text>
                <Text style={styles.netIncome}>Net: ₹{taxResult.new.netIncome.toLocaleString()}</Text>
              </View>
            </View>

            <View style={[
              styles.recommendationCard,
              { backgroundColor: taxResult.recommendedRegime === 'Old Regime' ? '#e8f5e8' : '#fff3cd' }
            ]}>
              <Text style={styles.recommendationTitle}>
                {taxResult.recommendedRegime} Saves You
              </Text>
              <Text style={styles.savingsAmount}>
                ₹{Math.abs(taxResult.savings).toLocaleString()}
              </Text>
              <Text style={styles.recommendationText}>
                Recommended: {taxResult.recommendedRegime}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInput: {
    flex: 0.48,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#0070ba',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 0.48,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 0.48,
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultsContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  regimeCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  regimeTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  taxAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  netIncome: {
    fontSize: 12,
    color: '#666',
  },
  recommendationCard: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  savingsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#28a745',
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
  },
});

export default TaxCalculator;