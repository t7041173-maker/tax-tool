import { useState } from "react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
}

export const TaxCalculator = ({ onTaxDataChange }: TaxCalculatorProps) => {
  // Default empty/zero values as requested
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
  const [taxResult, setTaxResult] = useState<{old: TaxCalculation, new: TaxCalculation, savings: number} | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);

  const getAgeFromGroup = (ageGroup: string): number => {
    switch (ageGroup) {
      case "below60": return 30;
      case "60to80": return 65;
      case "above80": return 85;
      default: return 30;
    }
  };

  const calculateOldRegime = (annualIncome: number, userAge: number): TaxCalculation => {
    // Standard deduction only available for salaried employees
    const standardDeduction = employmentType === "salaried" ? 50000 : 0;
    const totalDeductions = Math.min(deductions80C, 150000) + 
                           Math.min(deductions80D, userAge >= 60 ? 50000 : 25000) + 
                           Math.min(homeLoanInterest, 200000) + 
                           Math.min(hraExemption, annualIncome * 0.5) +
                           educationLoanInterest + // No limit on 80E
                           Math.min(nps, annualIncome * 0.1) + // NPS 10% limit
                           deductions80G + // No limit on 80G
                           standardDeduction;

    const taxableIncome = Math.max(0, annualIncome - totalDeductions);
    
    // Age-based tax slabs for Old Regime
    let exemptionLimit = 250000; // Up to 60 years
    if (userAge >= 80) exemptionLimit = 500000; // Very senior citizen
    else if (userAge >= 60) exemptionLimit = 300000; // Senior citizen
    
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
    
    // Apply rebate u/s 87A for Old Regime (₹12,500 if taxable income ≤ ₹5L)
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
    // New Regime slabs: 0% up to ₹3L, 5% (₹3L-₹6L), 10% (₹6L-₹9L), 15% (₹9L-₹12L), 20% (₹12L-₹15L), 30% (₹15L+)
    if (taxableIncome > 300000) {
      tax += Math.min(taxableIncome - 300000, 300000) * 0.05; // ₹3L-₹6L at 5%
    }
    if (taxableIncome > 600000) {
      tax += Math.min(taxableIncome - 600000, 300000) * 0.1; // ₹6L-₹9L at 10%
    }
    if (taxableIncome > 900000) {
      tax += Math.min(taxableIncome - 900000, 300000) * 0.15; // ₹9L-₹12L at 15%
    }
    if (taxableIncome > 1200000) {
      tax += Math.min(taxableIncome - 1200000, 300000) * 0.2; // ₹12L-₹15L at 20%
    }
    if (taxableIncome > 1500000) {
      tax += (taxableIncome - 1500000) * 0.3; // Above ₹15L at 30%
    }
    
    // Apply rebate u/s 87A for New Regime (₹25,000 if taxable income ≤ ₹7L)
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
      alert("Please enter a valid annual income");
      return;
    }

    const oldRegimeCalc = calculateOldRegime(annualIncome, userAge);
    const newRegimeCalc = calculateNewRegime(annualIncome);
    const savings = oldRegimeCalc.totalTax - newRegimeCalc.totalTax;

    setTaxResult({
      old: oldRegimeCalc,
      new: newRegimeCalc,
      savings
    });
    setIsCalculated(true);

    // Update parent component with tax data
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
        recommendation: savings > 0 ? 'Old Regime' : 'New Regime',
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
  };

  // Function to handle bank data import
  const handleBankDataImport = (bankData: any) => {
    if (bankData.annualIncome) setIncome(bankData.annualIncome.toString());
    if (bankData.ageGroup) setAgeGroup(bankData.ageGroup);
    if (bankData.section80C) setDeductions80C(bankData.section80C);
    if (bankData.section80D) setDeductions80D(bankData.section80D);
    if (bankData.section80G) setDeductions80G(bankData.section80G);
    if (bankData.homeLoanInterest) setHomeLoanInterest(bankData.homeLoanInterest);
  };

  // Function to handle receipt OCR data
  const handleReceiptData = (receiptData: any) => {
    if (receiptData.amount && receiptData.taxSection) {
      switch (receiptData.taxSection) {
        case '80C':
          setDeductions80C(prev => prev + receiptData.amount);
          break;
        case '80D':
          setDeductions80D(prev => prev + receiptData.amount);
          break;
        case '80G':
          setDeductions80G(prev => prev + receiptData.amount);
          break;
        case '24':
          setHomeLoanInterest(prev => prev + receiptData.amount);
          break;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="income">Annual Income (₹)</Label>
            <Input
              id="income"
              type="text"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="Enter your annual income"
              className="text-lg font-semibold"
            />
          </div>
          
          <div>
            <Label htmlFor="employmentType">Employment Type</Label>
            <Select value={employmentType} onValueChange={setEmploymentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salaried">🔘 Salaried (Employed)</SelectItem>
                <SelectItem value="self-employed">🔘 Self-Employed</SelectItem>
                <SelectItem value="business">🔘 Business Owner</SelectItem>
                <SelectItem value="freelancer">🔘 Freelancer</SelectItem>
              </SelectContent>
            </Select>
            {employmentType !== "salaried" && (
              <p className="text-sm text-warning mt-1">
                ⚠️ Standard Deduction (₹50,000) is only available for salaried individuals under Old Regime
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="ageGroup">Age Group</Label>
            <Select value={ageGroup} onValueChange={setAgeGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="below60">Below 60 years</SelectItem>
                <SelectItem value="60to80">60-80 years (Senior Citizen)</SelectItem>
                <SelectItem value="above80">Above 80 years (Very Senior)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="deductions80c">80C Investments (₹)</Label>
            <Input
              id="deductions80c"
              type="number"
              value={deductions80C}
              onChange={(e) => setDeductions80C(Number(e.target.value) || 0)}
              placeholder="Max ₹1,50,000"
            />
          </div>

          <div>
            <Label htmlFor="deductions80d">80D Health Insurance (₹)</Label>
            <Input
              id="deductions80d"  
              type="number"
              value={deductions80D}
              onChange={(e) => setDeductions80D(Number(e.target.value) || 0)}
              placeholder="Max ₹25,000 (₹50,000 for seniors)"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="hraExemption">HRA Exemption (₹)</Label>
            <Input
              id="hraExemption"
              type="number"
              value={hraExemption}
              onChange={(e) => setHraExemption(Number(e.target.value) || 0)}
              placeholder="House Rent Allowance"
            />
          </div>
          
          <div>
            <Label htmlFor="homeLoanInterest">Home Loan Interest (₹)</Label>
            <Input
              id="homeLoanInterest"
              type="number"
              value={homeLoanInterest}
              onChange={(e) => setHomeLoanInterest(Number(e.target.value) || 0)}
              placeholder="Max ₹2,00,000"
            />
          </div>
          
          <div>
            <Label htmlFor="educationLoanInterest">Education Loan Interest (₹)</Label>
            <Input
              id="educationLoanInterest"
              type="number"
              value={educationLoanInterest}
              onChange={(e) => setEducationLoanInterest(Number(e.target.value) || 0)}
              placeholder="No limit (Section 80E)"
            />
          </div>

          <div>
            <Label htmlFor="deductions80g">80G Donations (₹)</Label>
            <Input
              id="deductions80g"
              type="number"
              value={deductions80G}
              onChange={(e) => setDeductions80G(Number(e.target.value) || 0)}
              placeholder="Charitable donations"
            />
          </div>
        </div>
      </div>

      {/* Calculate and Reset Buttons */}
      <div className="flex gap-4 justify-center">
        <Button onClick={handleCalculate} size="lg" className="min-w-32">
          Calculate Tax
        </Button>
        <Button onClick={handleReset} variant="outline" size="lg" className="min-w-32">
          Reset
        </Button>
      </div>

      {/* Results Section - Only show if calculated */}
      {isCalculated && taxResult && (
        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="old">Old Regime</TabsTrigger>
            <TabsTrigger value="new">New Regime</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-secondary border-primary/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Old Regime</h3>
                    <Badge variant="outline">With Deductions</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Tax:</span>
                      <span className="font-semibold">₹{taxResult.old.totalTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Net Income:</span>
                      <span className="font-semibold">₹{taxResult.old.netIncome.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-secondary border-primary/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">New Regime</h3>
                    <Badge variant="outline">No Deductions</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Tax:</span>
                      <span className="font-semibold">₹{taxResult.new.totalTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Net Income:</span>
                      <span className="font-semibold">₹{taxResult.new.netIncome.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className={`p-6 ${taxResult.savings > 0 ? 'bg-success-light border-success/20' : 'bg-warning-light border-warning/20'}`}>
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">
                  {taxResult.savings > 0 ? 'Old Regime Saves You' : 'New Regime Saves You'}
                </p>
                <p className={`text-3xl font-bold ${taxResult.savings > 0 ? 'text-success' : 'text-warning'}`}>
                  ₹{Math.abs(taxResult.savings).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Recommended: {taxResult.savings > 0 ? 'Old Regime' : 'New Regime'}
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="old" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Old Regime Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Gross Income:</span>
                  <span className="font-semibold">₹{taxResult.old.grossIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Deductions:</span>
                  <span className="font-semibold text-success">-₹{taxResult.old.totalDeductions.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Taxable Income:</span>
                  <span className="font-semibold">₹{taxResult.old.taxableIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Income Tax:</span>
                  <span className="font-semibold">₹{taxResult.old.incomeTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Health & Education Cess (4%):</span>
                  <span className="font-semibold">₹{taxResult.old.cess.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total Tax:</span>
                  <span className="font-bold text-primary">₹{taxResult.old.totalTax.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">New Regime Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Gross Income:</span>
                  <span className="font-semibold">₹{taxResult.new.grossIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Deduction:</span>
                  <span className="font-semibold text-success">-₹{taxResult.new.totalDeductions.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Taxable Income:</span>
                  <span className="font-semibold">₹{taxResult.new.taxableIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Income Tax:</span>
                  <span className="font-semibold">₹{taxResult.new.incomeTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Health & Education Cess (4%):</span>
                  <span className="font-semibold">₹{taxResult.new.cess.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total Tax:</span>
                  <span className="font-bold text-primary">₹{taxResult.new.totalTax.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Hidden props for parent components */}
      <div style={{ display: 'none' }}>
        {JSON.stringify({ handleBankDataImport, handleReceiptData })}
      </div>
    </div>
  );
};

// Export the handler functions for use by parent components
export const useTaxCalculatorHandlers = () => {
  return {
    handleBankDataImport: (bankData: any) => {
      // This will be handled by the component instance
    },
    handleReceiptData: (receiptData: any) => {
      // This will be handled by the component instance  
    }
  };
};