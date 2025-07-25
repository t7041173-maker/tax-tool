import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { TaxCalculator } from "@/components/TaxCalculator";
import { TaxChart } from "@/components/TaxChart";
import { BankDataImport } from "@/components/BankDataImport";
import { ReceiptUpload } from "@/components/ReceiptUpload";
import { PDFReportGenerator } from "@/components/PDFReportGenerator";
import { ComplianceScore } from "@/components/ComplianceScore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const Index = () => {
  const [taxData, setTaxData] = useState({
    income: 1200000,
    deductions: { section80C: 150000, section80D: 25000, section80G: 0, homeLoanInterest: 200000 },
    oldRegimeTax: 187200,
    newRegimeTax: 198500,
    recommendation: 'Old Regime',
    savings: 11300
  });
  const [bankData, setBankData] = useState(null);

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

  // OCR Scanner state (lifted)
  const [ocrFiles, setOcrFiles] = useState<File[]>([]);
  const [ocrCategories, setOcrCategories] = useState<{ [filename: string]: string }>({});
  const [ocrIsProcessing, setOcrIsProcessing] = useState<{ [filename: string]: boolean }>({});
  const [ocrOcrProgress, setOcrOcrProgress] = useState<{ [filename: string]: number }>({});
  const [ocrAmounts, setOcrAmounts] = useState<{ [filename: string]: number | null }>({});
  const [ocrConfirmed, setOcrConfirmed] = useState<{ file: File, amount: number, category: string }[]>([]);

  // When bankData changes, fill the calculator state
  React.useEffect(() => {
    if (bankData) {
      if (bankData.annualIncome) setIncome(bankData.annualIncome.toString());
      if (bankData.section80C) setDeductions80C(bankData.section80C);
      if (bankData.section80D) setDeductions80D(bankData.section80D);
      if (bankData.section80G) setDeductions80G(bankData.section80G);
      if (bankData.homeLoanInterest) setHomeLoanInterest(bankData.homeLoanInterest);
      if (bankData.hraExemption) setHraExemption(bankData.hraExemption);
      if (bankData.nps) setNps(bankData.nps);
      if (bankData.educationLoanInterest) setEducationLoanInterest(bankData.educationLoanInterest);
      if (bankData.ageGroup) setAgeGroup(bankData.ageGroup);
      if (bankData.regime) setRegime(bankData.regime);
    }
  }, [bankData]);

  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Smart Tax Assistant</h1>
          <p className="text-muted-foreground">AI-powered tax optimization for Indian taxpayers</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="bank-import">Bank Data</TabsTrigger>
            <TabsTrigger value="ocr">OCR Scanner</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <ComplianceScore />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calculator">
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
          </TabsContent>

          <TabsContent value="bank-import">
            <BankDataImport onDataImport={setBankData} />
          </TabsContent>

          <TabsContent value="ocr">
            <ReceiptUpload
              onDeductionExtracted={(data) => console.log('Receipt data:', data)}
              onRedirectToCalculator={() => setActiveTab('calculator')}
              onApplyDeductions={(deductions) => {
                setDeductions80C(deductions.section80C);
                setDeductions80D(deductions.section80D);
                setDeductions80G(deductions.section80G);
                setHomeLoanInterest(deductions.homeLoanInterest);
              }}
              files={ocrFiles}
              setFiles={setOcrFiles}
              categories={ocrCategories}
              setCategories={setOcrCategories}
              isProcessing={ocrIsProcessing}
              setIsProcessing={setOcrIsProcessing}
              ocrProgress={ocrOcrProgress}
              setOcrProgress={setOcrOcrProgress}
              amounts={ocrAmounts}
              setAmounts={setOcrAmounts}
              confirmed={ocrConfirmed}
              setConfirmed={setOcrConfirmed}
            />
          </TabsContent>

          <TabsContent value="reports">
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
          </TabsContent>

          <TabsContent value="goals">
            {/* Removed TaxGoals component */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
