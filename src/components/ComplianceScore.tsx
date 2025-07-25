import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, XCircle, Shield } from "lucide-react";

interface ComplianceItem {
  name: string;
  status: 'completed' | 'pending' | 'failed';
  score: number;
  description: string;
}

const complianceItems: ComplianceItem[] = [
  {
    name: 'Aadhaar-PAN Linked',
    status: 'completed',
    score: 20,
    description: 'Aadhaar successfully linked with PAN'
  },
  {
    name: 'KYC Verified',
    status: 'completed',
    score: 15,
    description: 'Know Your Customer verification completed'
  },
  {
    name: 'ITR Filed (Previous Year)',
    status: 'completed',
    score: 25,
    description: 'Income Tax Return filed for FY 2023-24'
  },
  {
    name: 'Advance Tax Paid',
    status: 'pending',
    score: 10,
    description: 'Q4 advance tax payment due'
  },
  {
    name: 'TDS Reconciliation Done',
    status: 'completed',
    score: 15,
    description: 'Form 26AS matched with Form 16'
  },
  {
    name: 'Form 16 Uploaded',
    status: 'pending',
    score: 10,
    description: 'Employer certificate pending upload'
  },
  {
    name: 'E-Verification Complete',
    status: 'failed',
    score: 15,
    description: 'ITR e-verification not completed'
  }
];

export const ComplianceScore = () => {
  const totalScore = complianceItems.reduce((sum, item) => {
    return sum + (item.status === 'completed' ? item.score : 0);
  }, 0);
  const maxScore = 100;
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground">✔ Completed</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-warning-foreground">⚠ Pending</Badge>;
      case 'failed':
        return <Badge className="bg-destructive text-destructive-foreground">❗ Action Required</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="shadow-elevated">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Tax Compliance Score</h2>
        </div>
      </div>
      
      <div className="p-6">
        {/* Circular Progress Score Display */}
        <div className="text-center mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - totalScore / 100)}`}
                className="text-primary transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(totalScore)}`}>
                  {totalScore}
                </div>
                <div className="text-sm text-muted-foreground">out of 100</div>
              </div>
            </div>
          </div>
          <p className="text-lg font-semibold">
            {totalScore >= 80 ? 'Excellent Compliance' : 
             totalScore >= 60 ? 'Good Compliance' : 
             'Needs Improvement'}
          </p>
        </div>

        {/* Compliance Items */}
        <div className="space-y-4">
          {complianceItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                {getStatusIcon(item.status)}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">+{item.score} pts</span>
                {getStatusBadge(item.status)}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button className="w-full bg-gradient-primary hover:bg-primary-hover">
            Improve Score
          </Button>
          <Button variant="outline" className="w-full">
            View Detailed Report
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 p-4 rounded-lg bg-primary-light">
          <h3 className="font-semibold text-primary mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="flex items-center gap-2 text-sm text-primary hover:underline">
              <AlertCircle className="h-4 w-4" />
              Complete e-verification for ITR (+10 pts)
            </button>
            <button className="flex items-center gap-2 text-sm text-primary hover:underline">
              <AlertCircle className="h-4 w-4" />
              Upload Form 16 (+15 pts)
            </button>
            <button className="flex items-center gap-2 text-sm text-primary hover:underline">
              <AlertCircle className="h-4 w-4" />
              Pay advance tax (+10 pts)
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};