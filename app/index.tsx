import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Calculator, Upload, Target, Shield, FileText } from 'lucide-react-native';
import TaxCalculator from '../components/TaxCalculator';
import BankDataImport from '../components/BankDataImport';
import ReceiptUpload from '../components/ReceiptUpload';
import PDFReportGenerator from '../components/PDFReportGenerator';
import ComplianceScore from '../components/ComplianceScore';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [taxData, setTaxData] = useState({
    income: 1200000,
    deductions: { section80C: 150000, section80D: 25000, section80G: 0, homeLoanInterest: 200000 },
    oldRegimeTax: 187200,
    newRegimeTax: 198500,
    recommendation: 'Old Regime',
    savings: 11300
  });

  // TaxCalculator form state
  const [income, setIncome] = useState("");
  const [employmentType, setEmploymentType] = useState("salaried");
  const [ageGroup, setAgeGroup] = useState("below60");
  const [deductions80C, setDeductions80C] = useState(0);
  const [deductions80D, setDeductions80D] = useState(0);
  const [hraExemption, setHraExemption] = useState(0);
  const [homeLoanInterest, setHomeLoanInterest] = useState(0);
  const [educationLoanInterest, setEducationLoanInterest] = useState(0);
  const [nps, setNps] = useState(0);
  const [deductions80G, setDeductions80G] = useState(0);
  const [regime, setRegime] = useState("new");
  const [taxResult, setTaxResult] = useState(null);
  const [isCalculated, setIsCalculated] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'bank-import', label: 'Bank Data', icon: Upload },
    { id: 'ocr', label: 'OCR Scanner', icon: FileText },
    { id: 'reports', label: 'Reports', icon: Target },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ComplianceScore />;
      case 'calculator':
        return (
          <TaxCalculator
            onTaxDataChange={setTaxData}
            income={income}
            setIncome={setIncome}
            employmentType={employmentType}
            setEmploymentType={setEmploymentType}
            ageGroup={ageGroup}
            setAgeGroup={setAgeGroup}
            deductions80C={deductions80C}
            setDeductions80C={setDeductions80C}
            deductions80D={deductions80D}
            setDeductions80D={setDeductions80D}
            hraExemption={hraExemption}
            setHraExemption={setHraExemption}
            homeLoanInterest={homeLoanInterest}
            setHomeLoanInterest={setHomeLoanInterest}
            educationLoanInterest={educationLoanInterest}
            setEducationLoanInterest={setEducationLoanInterest}
            nps={nps}
            setNps={setNps}
            deductions80G={deductions80G}
            setDeductions80G={setDeductions80G}
            regime={regime}
            setRegime={setRegime}
            taxResult={taxResult}
            setTaxResult={setTaxResult}
            isCalculated={isCalculated}
            setIsCalculated={setIsCalculated}
          />
        );
      case 'bank-import':
        return <BankDataImport onDataImport={() => {}} />;
      case 'ocr':
        return <ReceiptUpload />;
      case 'reports':
        return (
          <PDFReportGenerator
            taxData={{
              income: Number(income) || 0,
              deductions: {
                section80C: deductions80C,
                section80D: deductions80D,
                section80G: deductions80G,
                homeLoanInterest: homeLoanInterest
              },
              oldRegimeTax: taxData.oldRegimeTax,
              newRegimeTax: taxData.newRegimeTax,
              recommendation: taxData.recommendation,
              savings: taxData.savings
            }}
          />
        );
      default:
        return <ComplianceScore />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Tax Assistant</Text>
        <Text style={styles.subtitle}>AI-powered tax optimization for Indian taxpayers</Text>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  activeTab === tab.id && styles.activeTab
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <IconComponent
                  size={20}
                  color={activeTab === tab.id ? '#ffffff' : '#666666'}
                />
                <Text style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#0070ba',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  tabContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#0070ba',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default Index;