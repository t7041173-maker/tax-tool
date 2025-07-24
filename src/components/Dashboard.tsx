import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaxCalculator } from "./TaxCalculator";
import { TaxChart } from "./TaxChart";
import { ComplianceScore } from "./ComplianceScore";
import { TaxGoals } from "./TaxGoals";
import { ReceiptUpload } from "./ReceiptUpload";
import { 
  Calculator, 
  Upload, 
  Target, 
  Shield, 
  Calendar,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-white px-6 py-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Smart Tax Assistant</h1>
              <p className="text-white/90">AI-Powered Tax Optimization for Indian Users</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Assessment Year</p>
              <p className="text-xl font-semibold">2024-25</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-secondary border-0 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estimated Tax</p>
                <p className="text-2xl font-bold text-primary">₹2,84,500</p>
              </div>
              <Calculator className="h-8 w-8 text-primary" />
            </div>
          </Card>
          
          <Card className="p-6 bg-success-light border-0 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potential Savings</p>
                <p className="text-2xl font-bold text-success">₹45,000</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </Card>
          
          <Card className="p-6 bg-warning-light border-0 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next Deadline</p>
                <p className="text-lg font-bold text-warning">ITR Filing</p>
                <p className="text-sm text-warning">31 July 2024</p>
              </div>
              <Calendar className="h-8 w-8 text-warning" />
            </div>
          </Card>
          
          <Card className="p-6 bg-primary-light border-0 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                <p className="text-2xl font-bold text-primary">85/100</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tax Calculator */}
            <Card className="shadow-elevated">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">Tax Calculator</h2>
                  <Badge variant="secondary">Old vs New Regime</Badge>
                </div>
              </div>
              <div className="p-6">
                <TaxCalculator />
              </div>
            </Card>

            {/* Tax Visualization */}
            <Card className="shadow-elevated">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">Tax Breakdown</h2>
                </div>
              </div>
              <div className="p-6">
                <TaxChart />
              </div>
            </Card>

            {/* Recent Transactions */}
            <Card className="shadow-elevated">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-semibold">Recent Transactions</h2>
                  </div>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { type: "Salary Credit", amount: "₹85,000", date: "15 Jan 2024", category: "Income" },
                    { type: "PPF Contribution", amount: "₹12,500", date: "10 Jan 2024", category: "Investment" },
                    { type: "Health Insurance", amount: "₹15,000", date: "05 Jan 2024", category: "Insurance" }
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{transaction.type}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{transaction.amount}</p>
                        <Badge variant="outline" className="text-xs">{transaction.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Compliance Score */}
            <ComplianceScore />

            {/* Tax Goals */}
            <TaxGoals />

            {/* Receipt Upload */}
            <Card className="shadow-elevated">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <Upload className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">Upload Receipts</h2>
                </div>
              </div>
              <div className="p-6">
                <ReceiptUpload />
              </div>
            </Card>

            {/* AI Recommendations */}
            <Card className="shadow-elevated border-primary/20">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">AI Recommendations</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-success-light">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium text-success">Optimize ELSS Investment</p>
                    <p className="text-sm text-success/80">Invest ₹25,000 more in ELSS to save ₹7,500 in taxes</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-warning-light">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <p className="font-medium text-warning">Health Insurance Gap</p>
                    <p className="text-sm text-warning/80">Increase coverage by ₹3L to maximize 80D benefits</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary-light">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-primary">New Regime Better</p>
                    <p className="text-sm text-primary/80">Switch to new regime to save ₹12,000 annually</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};