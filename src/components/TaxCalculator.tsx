import { useState, useEffect } from "react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

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
  const [income, setIncome] = useState(1000000);
  const [age, setAge] = useState(30);
  const [deductions80C, setDeductions80C] = useState(150000);
  const [deductions80D, setDeductions80D] = useState(25000);
  const [homeInterest, setHomeInterest] = useState(200000);
  const [hra, setHra] = useState(240000);
  const [deductions80G, setDeductions80G] = useState(0);
  
  const calculateOldRegime = (): TaxCalculation => {
    const standardDeduction = 50000;
    const totalDeductions = Math.min(deductions80C, 150000) + 
                           Math.min(deductions80D, age >= 60 ? 50000 : 25000) + 
                           Math.min(homeInterest, 200000) + 
                           Math.min(hra, income * 0.5) +
                           deductions80G + // No limit on 80G
                           standardDeduction;

    const taxableIncome = Math.max(0, income - totalDeductions);
    
    // Age-based tax slabs for Old Regime
    let exemptionLimit = 250000; // Up to 60 years
    if (age >= 80) exemptionLimit = 500000; // Very senior citizen
    else if (age >= 60) exemptionLimit = 300000; // Senior citizen
    
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
      grossIncome: income,
      totalDeductions,
      taxableIncome,
      incomeTax: tax,
      cess,
      totalTax,
      netIncome: income - totalTax
    };
  };

  const calculateNewRegime = (): TaxCalculation => {
    const standardDeduction = 50000;
    const taxableIncome = Math.max(0, income - standardDeduction);
    
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
      grossIncome: income,
      totalDeductions: standardDeduction,
      taxableIncome,
      incomeTax: tax,
      cess,
      totalTax,
      netIncome: income - totalTax
    };
  };

  const oldRegimeCalc = calculateOldRegime();
  const newRegimeCalc = calculateNewRegime();
  const savings = oldRegimeCalc.totalTax - newRegimeCalc.totalTax;

  // Update parent component with tax data
  React.useEffect(() => {
    if (onTaxDataChange) {
      onTaxDataChange({
        income,
        deductions: {
          section80C: deductions80C,
          section80D: deductions80D,
          section80G: deductions80G,
          homeLoanInterest: homeInterest,
        },
        oldRegimeTax: oldRegimeCalc.totalTax,
        newRegimeTax: newRegimeCalc.totalTax,
        recommendation: savings > 0 ? 'Old Regime' : 'New Regime',
        savings
      });
    }
  }, [income, age, deductions80C, deductions80D, deductions80G, homeInterest, oldRegimeCalc.totalTax, newRegimeCalc.totalTax, savings, onTaxDataChange]);

  // Function to handle bank data import
  const handleBankDataImport = (bankData: any) => {
    if (bankData.annualIncome) setIncome(bankData.annualIncome);
    if (bankData.age) setAge(bankData.age);
    if (bankData.section80C) setDeductions80C(bankData.section80C);
    if (bankData.section80D) setDeductions80D(bankData.section80D);
    if (bankData.section80G) setDeductions80G(bankData.section80G);
    if (bankData.homeLoanInterest) setHomeInterest(bankData.homeLoanInterest);
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
          setHomeInterest(prev => prev + receiptData.amount);
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
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="text-lg font-semibold"
            />
          </div>
          
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              placeholder="For age-based tax slabs"
              min="18"
              max="100"
            />
          </div>
          
          <div>
            <Label htmlFor="deductions80c">80C Deductions (₹)</Label>
            <Input
              id="deductions80c"
              type="number"
              value={deductions80C}
              onChange={(e) => setDeductions80C(Number(e.target.value))}
              placeholder="Max ₹1,50,000"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="deductions80d">80D Health Insurance (₹)</Label>
            <Input
              id="deductions80d"
              type="number"
              value={deductions80D}
              onChange={(e) => setDeductions80D(Number(e.target.value))}
              placeholder="Max ₹25,000"
            />
          </div>
          
            <div>
              <Label htmlFor="homeInterest">Home Loan Interest (₹)</Label>
              <Input
                id="homeInterest"
                type="number"
                value={homeInterest}
                onChange={(e) => setHomeInterest(Number(e.target.value))}
                placeholder="Max ₹2,00,000"
              />
            </div>
            
            <div>
              <Label htmlFor="deductions80g">80G Donations (₹)</Label>
              <Input
                id="deductions80g"
                type="number"
                value={deductions80G}
                onChange={(e) => setDeductions80G(Number(e.target.value))}
                placeholder="Charitable donations"
              />
            </div>
        </div>
      </div>

      {/* Results Comparison */}
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
                    <span className="font-semibold">₹{oldRegimeCalc.totalTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Net Income:</span>
                    <span className="font-semibold">₹{oldRegimeCalc.netIncome.toLocaleString()}</span>
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
                    <span className="font-semibold">₹{newRegimeCalc.totalTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Net Income:</span>
                    <span className="font-semibold">₹{newRegimeCalc.netIncome.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className={`p-6 ${savings > 0 ? 'bg-success-light border-success/20' : 'bg-warning-light border-warning/20'}`}>
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">
                {savings > 0 ? 'Old Regime Saves You' : 'New Regime Saves You'}
              </p>
              <p className={`text-3xl font-bold ${savings > 0 ? 'text-success' : 'text-warning'}`}>
                ₹{Math.abs(savings).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Recommended: {savings > 0 ? 'Old Regime' : 'New Regime'}
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
                <span className="font-semibold">₹{oldRegimeCalc.grossIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Deductions:</span>
                <span className="font-semibold text-success">-₹{oldRegimeCalc.totalDeductions.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Taxable Income:</span>
                <span className="font-semibold">₹{oldRegimeCalc.taxableIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Income Tax:</span>
                <span className="font-semibold">₹{oldRegimeCalc.incomeTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Health & Education Cess (4%):</span>
                <span className="font-semibold">₹{oldRegimeCalc.cess.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total Tax:</span>
                <span className="font-bold text-primary">₹{oldRegimeCalc.totalTax.toLocaleString()}</span>
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
                <span className="font-semibold">₹{newRegimeCalc.grossIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Standard Deduction:</span>
                <span className="font-semibold text-success">-₹{newRegimeCalc.totalDeductions.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Taxable Income:</span>
                <span className="font-semibold">₹{newRegimeCalc.taxableIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Income Tax:</span>
                <span className="font-semibold">₹{newRegimeCalc.incomeTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Health & Education Cess (4%):</span>
                <span className="font-semibold">₹{newRegimeCalc.cess.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total Tax:</span>
                <span className="font-bold text-primary">₹{newRegimeCalc.totalTax.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

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