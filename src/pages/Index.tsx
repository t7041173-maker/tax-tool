import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { TaxCalculator } from "@/components/TaxCalculator";
import { TaxChart } from "@/components/TaxChart";
import { BankDataImport } from "@/components/BankDataImport";
import { ReceiptUpload } from "@/components/ReceiptUpload";
import { TaxNoticeChecker } from "@/components/TaxNoticeChecker";
import { PDFReportGenerator } from "@/components/PDFReportGenerator";
import { ComplianceScore } from "@/components/ComplianceScore";
import { TaxGoals } from "@/components/TaxGoals";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [taxData, setTaxData] = useState({
    income: 1200000,
    deductions: { section80C: 150000, section80D: 25000, section80G: 0, homeLoanInterest: 200000 },
    oldRegimeTax: 187200,
    newRegimeTax: 198500,
    recommendation: 'Old Regime',
    savings: 11300
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Smart Tax Assistant</h1>
          <p className="text-muted-foreground">AI-powered tax optimization for Indian taxpayers</p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="bank-import">Bank Data</TabsTrigger>
            <TabsTrigger value="ocr">OCR Scanner</TabsTrigger>
            <TabsTrigger value="fraud-check">Fraud Check</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <ComplianceScore />
              </div>
              <TaxGoals />
            </div>
            <TaxChart />
          </TabsContent>

          <TabsContent value="calculator">
            <TaxCalculator onTaxDataChange={setTaxData} />
          </TabsContent>

          <TabsContent value="bank-import">
            <BankDataImport onDataImport={(data) => console.log('Bank data:', data)} />
          </TabsContent>

          <TabsContent value="ocr">
            <ReceiptUpload onDeductionExtracted={(data) => console.log('Receipt data:', data)} />
          </TabsContent>

          <TabsContent value="fraud-check">
            <TaxNoticeChecker />
          </TabsContent>

          <TabsContent value="reports">
            <PDFReportGenerator taxData={taxData} />
          </TabsContent>

          <TabsContent value="goals">
            <TaxGoals />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
