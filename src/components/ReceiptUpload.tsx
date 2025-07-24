import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Tesseract from 'tesseract.js';

interface ExtractedData {
  amount?: number;
  date?: string;
  purpose?: string;
  taxSection?: string;
  confidence?: number;
}

interface ReceiptUploadProps {
  onDeductionExtracted?: (data: ExtractedData) => void;
}

export const ReceiptUpload = ({ onDeductionExtracted }: ReceiptUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const { toast } = useToast();

  const categorizePurpose = (text: string): { section: string; purpose: string } => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('lic') || lowerText.includes('insurance premium') || lowerText.includes('life insurance')) {
      return { section: '80C', purpose: 'Life Insurance Premium' };
    }
    if (lowerText.includes('elss') || lowerText.includes('equity linked')) {
      return { section: '80C', purpose: 'ELSS Investment' };
    }
    if (lowerText.includes('ppf') || lowerText.includes('public provident')) {
      return { section: '80C', purpose: 'PPF Investment' };
    }
    if (lowerText.includes('health insurance') || lowerText.includes('medical insurance')) {
      return { section: '80D', purpose: 'Health Insurance Premium' };
    }
    if (lowerText.includes('donation') || lowerText.includes('charity')) {
      return { section: '80G', purpose: 'Charitable Donation' };
    }
    if (lowerText.includes('school fee') || lowerText.includes('tuition')) {
      return { section: '80C', purpose: 'Tuition Fees' };
    }
    if (lowerText.includes('home loan') || lowerText.includes('housing loan')) {
      return { section: '24', purpose: 'Home Loan Interest' };
    }
    
    return { section: 'Other', purpose: 'General Expense' };
  };

  const extractAmountFromText = (text: string): number | null => {
    // Look for various amount patterns
    const patterns = [
      /(?:rs\.?|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
      /(?:amount|total|paid)\s*:?\s*(?:rs\.?|₹)?\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
      /(\d+(?:,\d+)*(?:\.\d{2})?)\s*(?:rs\.?|₹)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseFloat(match[1].replace(/,/g, ''));
      }
    }
    
    return null;
  };

  const extractDateFromText = (text: string): string | null => {
    const patterns = [
      /(\d{1,2}[-/]\d{1,2}[-/]\d{4})/,
      /(\d{4}[-/]\d{1,2}[-/]\d{1,2})/,
      /(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{4})/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return null;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    
    setFile(uploadedFile);
    setIsProcessing(true);
    setOcrProgress(0);
    
    try {
      const { data: { text, confidence } } = await Tesseract.recognize(
        uploadedFile,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          }
        }
      );
      
      // Extract relevant information
      const amount = extractAmountFromText(text);
      const date = extractDateFromText(text);
      const { section, purpose } = categorizePurpose(text);
      
      const extractedInfo: ExtractedData = {
        amount,
        date,
        purpose,
        taxSection: section,
        confidence: Math.round(confidence)
      };
      
      setExtractedData(extractedInfo);
      
      toast({
        title: "Receipt Processed",
        description: `Successfully extracted information with ${Math.round(confidence)}% confidence`,
      });
      
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "Could not extract text from the receipt",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setOcrProgress(0);
    }
  };

  const handleApplyDeduction = () => {
    if (extractedData) {
      onDeductionExtracted?.(extractedData);
      
      toast({
        title: "Deduction Applied",
        description: `₹${extractedData.amount?.toLocaleString()} added to ${extractedData.taxSection} deductions`,
      });
      
      // Reset the form
      setExtractedData(null);
      setFile(null);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Smart Receipt Scanner</h3>
          <p className="text-sm text-muted-foreground">
            Upload receipts for automatic tax deduction extraction using OCR
          </p>
        </div>

        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <Label htmlFor="receipt-upload" className="cursor-pointer">
              <span className="text-sm font-medium">
                {file ? file.name : "Choose a receipt file"}
              </span>
            </Label>
            <Input
              id="receipt-upload"
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground">
              Supports JPG, PNG, PDF up to 5MB
            </p>
          </div>
        </div>

        {isProcessing && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-sm font-medium">Processing with OCR...</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${ocrProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{ocrProgress}% complete</p>
          </div>
        )}

        {extractedData && (
          <Card className="p-4 bg-success-light border-success/20">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-success" />
                <h4 className="font-medium">Extracted Information</h4>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">{extractedData.taxSection}</Badge>
                <Badge variant="outline">{extractedData.confidence}% confidence</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              {extractedData.amount && (
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <p className="font-semibold">₹{extractedData.amount.toLocaleString()}</p>
                </div>
              )}
              {extractedData.date && (
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <p className="font-semibold">{extractedData.date}</p>
                </div>
              )}
              <div className="col-span-2">
                <span className="text-muted-foreground">Purpose:</span>
                <p className="font-semibold">{extractedData.purpose}</p>
              </div>
            </div>
            
            <Button 
              onClick={handleApplyDeduction} 
              className="w-full"
              disabled={!extractedData.amount}
            >
              Apply to Tax Deductions
            </Button>
          </Card>
        )}

        <div className="bg-muted/50 p-3 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Supported Documents:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>• LIC/Insurance receipts</div>
            <div>• Health insurance bills</div>
            <div>• ELSS investment receipts</div>
            <div>• Donation receipts</div>
            <div>• School fee receipts</div>
            <div>• Home loan statements</div>
          </div>
        </div>
      </div>
    </Card>
  );
};