import { useState } from "react";
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

export const TaxCalculator = () => {
  const [income, setIncome] = useState(1200000);
  const [deductions80C, setDeductions80C] = useState(150000);
  const [deductions80D, setDeductions80D] = useState(25000);
  const [homeInterest, setHomeInterest] = useState(200000);
  const [hra, setHra] = useState(240000);
  
  const calculateOldRegime = (): TaxCalculation => {
    const totalDeductions = Math.min(deductions80C, 150000) + 
                           Math.min(deductions80D, 25000) + 
                           Math.min(homeInterest, 200000) + 
                           Math.min(hra, income * 0.5) +
                           50000; // Standard deduction

    const taxableIncome = Math.max(0, income - totalDeductions);
    
    let tax = 0;
    if (taxableIncome > 250000) {
      tax += Math.min(taxableIncome - 250000, 250000) * 0.05;
    }
    if (taxableIncome > 500000) {
      tax += Math.min(taxableIncome - 500000, 500000) * 0.2;
    }
    if (taxableIncome > 1000000) {
      tax += (taxableIncome - 1000000) * 0.3;
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
    const standardDeduction = 75000;
    const taxableIncome = Math.max(0, income - standardDeduction);
    
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
    </div>
  );
};