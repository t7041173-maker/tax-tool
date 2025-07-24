import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface NoticeAnalysis {
  isGenuine: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  warnings: string[];
  genuineIndicators: string[];
}

export const TaxNoticeChecker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<NoticeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [noticeText, setNoticeText] = useState('');
  const { toast } = useToast();

  const analyzeNotice = (text: string): NoticeAnalysis => {
    const warnings: string[] = [];
    const genuineIndicators: string[] = [];
    
    // Check for genuine indicators
    if (text.includes('@incometax.gov.in') || text.includes('incometax.gov.in')) {
      genuineIndicators.push('Official Income Tax department email domain');
    }
    
    if (text.includes('PAN') && text.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)) {
      genuineIndicators.push('Valid PAN format found');
    }
    
    if (text.includes('Assessment Year') || text.includes('AY')) {
      genuineIndicators.push('Contains Assessment Year reference');
    }
    
    // Check for red flags
    if (text.includes('urgent action required') && text.includes('within 24 hours')) {
      warnings.push('Suspicious urgency - genuine notices rarely demand immediate action');
    }
    
    if (text.includes('click here') || text.includes('download immediately')) {
      warnings.push('Contains suspicious links - be cautious of phishing attempts');
    }
    
    if (text.includes('refund') && text.includes('claim now')) {
      warnings.push('Suspicious refund claims - verify independently');
    }
    
    if (!text.includes('Income Tax Department') && !text.includes('Government of India')) {
      warnings.push('Missing official government headers');
    }
    
    if (text.match(/\b(?:gmail|yahoo|hotmail|outlook)\.com\b/i)) {
      warnings.push('Sent from personal email domain instead of official government domain');
    }
    
    const riskLevel: 'low' | 'medium' | 'high' = 
      warnings.length >= 3 ? 'high' : 
      warnings.length >= 2 ? 'medium' : 'low';
    
    const isGenuine = warnings.length === 0 && genuineIndicators.length >= 2;
    
    return { isGenuine, riskLevel, warnings, genuineIndicators };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    
    setFile(uploadedFile);
    setIsAnalyzing(true);
    
    try {
      // Simulate OCR processing
      setTimeout(() => {
        // Mock extracted text from uploaded file
        const mockText = `
          Subject: Income Tax Notice - Urgent Action Required
          From: noreply@incometax-notice.com
          
          Dear Taxpayer,
          
          This is to inform you that there is a discrepancy in your Income Tax Return for Assessment Year 2023-24.
          Your PAN ABCDE1234F shows pending verification.
          
          Please click here to verify your details within 24 hours to avoid penalty.
          
          Download the notice immediately from our portal.
          
          Regards,
          Income Tax Department
        `;
        
        setNoticeText(mockText);
        const result = analyzeNotice(mockText);
        setAnalysis(result);
        setIsAnalyzing(false);
        
        toast({
          title: "Notice Analyzed",
          description: `Risk level: ${result.riskLevel.toUpperCase()}`,
          variant: result.riskLevel === 'high' ? 'destructive' : 'default'
        });
      }, 2000);
    } catch (error) {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the uploaded notice",
        variant: "destructive"
      });
    }
  };

  const handleTextAnalysis = () => {
    if (!noticeText.trim()) return;
    
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeNotice(noticeText);
      setAnalysis(result);
      setIsAnalyzing(false);
      
      toast({
        title: "Text Analyzed",
        description: `Risk level: ${result.riskLevel.toUpperCase()}`,
        variant: result.riskLevel === 'high' ? 'destructive' : 'default'
      });
    }, 1000);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Tax Notice Fraud Checker</h3>
          <p className="text-sm text-muted-foreground">
            Upload a tax notice or paste the content to check for potential fraud indicators
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="notice-file">Upload Notice (PDF/Image)</Label>
            <div className="mt-2">
              <Input
                id="notice-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.txt"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="text-center text-muted-foreground">or</div>

          <div>
            <Label htmlFor="notice-text">Paste Notice Content</Label>
            <textarea
              id="notice-text"
              value={noticeText}
              onChange={(e) => setNoticeText(e.target.value)}
              className="mt-2 w-full min-h-32 p-3 border rounded-md resize-none"
              placeholder="Paste the tax notice content here..."
            />
            <Button 
              onClick={handleTextAnalysis}
              disabled={!noticeText.trim() || isAnalyzing}
              className="mt-2"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Text"}
            </Button>
          </div>
        </div>

        {analysis && (
          <div className="space-y-4">
            <Alert className={analysis.riskLevel === 'high' ? 'border-destructive' : analysis.riskLevel === 'medium' ? 'border-warning' : 'border-success'}>
              <div className="flex items-center gap-2">
                {analysis.riskLevel === 'high' ? (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                ) : analysis.riskLevel === 'medium' ? (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-success" />
                )}
                <Badge variant={analysis.riskLevel === 'high' ? 'destructive' : analysis.riskLevel === 'medium' ? 'secondary' : 'default'}>
                  {analysis.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
              <AlertDescription className="mt-2">
                {analysis.isGenuine 
                  ? "This notice appears to be genuine based on our analysis."
                  : "This notice has several suspicious indicators. Please verify independently."}
              </AlertDescription>
            </Alert>

            {analysis.warnings.length > 0 && (
              <div className="bg-destructive-light p-4 rounded-lg">
                <h4 className="font-medium text-destructive mb-2">⚠️ Warning Signs:</h4>
                <ul className="space-y-1 text-sm">
                  {analysis.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.genuineIndicators.length > 0 && (
              <div className="bg-success-light p-4 rounded-lg">
                <h4 className="font-medium text-success mb-2">✓ Genuine Indicators:</h4>
                <ul className="space-y-1 text-sm">
                  {analysis.genuineIndicators.map((indicator, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-success">•</span>
                      <span>{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">💡 Safety Tips:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Always verify notices by logging into the official Income Tax portal</li>
                <li>• Genuine notices will have your correct PAN and personal details</li>
                <li>• Be cautious of urgent deadlines and immediate action demands</li>
                <li>• Never share sensitive information through email or unofficial channels</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};