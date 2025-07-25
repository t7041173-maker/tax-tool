import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Tesseract from 'tesseract.js';

const deductionOptions = [
  { value: "80C", label: "80C (Investments, Insurance, etc.)" },
  { value: "80D", label: "80D (Health Insurance)" },
  { value: "80G", label: "80G (Donations)" },
  { value: "24", label: "24 (Home Loan Interest)" }
];

function extractAmountFromText(text: string, filename: string): number | string {
  // 1. Try to match using provided patterns
  const patterns = [
    /total amount (paid|received)[^\d₹]*[₹]?\s*([\d,]+\.\d{2})/i,
    /total premium paid[^\d₹]*[₹]?\s*([\d,]+\.\d{2})/i,
    /amount paid[^\d₹]*[₹]?\s*([\d,]+\.\d{2})/i,
    /grand total[^\d₹]*[₹]?\s*([\d,]+\.\d{2})/i,
    /total payable[^\d₹]*[₹]?\s*([\d,]+\.\d{2})/i,
    /net payable[^\d₹]*[₹]?\s*([\d,]+\.\d{2})/i,
    /total[^\d₹]*[₹]?\s*([\d,]+\.\d{2})/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[2]) {
      let numStr = match[2].replace(/,/g, '');
      const num = parseFloat(numStr);
      if (!isNaN(num)) return num;
    }
  }

  // 2. Fallback: find all currency amounts, return the largest
  const fallbackPattern = /((₹|Rs\.?|INR)\s?[\d.,]+)|([\d.,]+\s?(₹|Rs\.?|INR))/gi;
  const matches = text.match(fallbackPattern);
  const numbers = matches
    ?.map(m => {
      let numStr = m.replace(/[^\d.,]/g, '').replace(/,/g, '');
      const parts = numStr.split('.');
      if (parts.length > 2) {
        numStr = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
      }
      return parseFloat(numStr);
    })
    .filter(Boolean);
  if (numbers?.length) {
    return Math.max(...numbers);
  }

  // 3. If nothing found, return error message
  return `Unable to extract amount from ${filename}`;
}

export const ReceiptUpload = ({
  onDeductionExtracted,
  onRedirectToCalculator,
  onApplyDeductions,
  files,
  setFiles,
  categories,
  setCategories,
  isProcessing,
  setIsProcessing,
  ocrProgress,
  setOcrProgress,
  amounts,
  setAmounts,
  confirmed,
  setConfirmed
}: {
  onDeductionExtracted?: (data: { file: File, category: string }) => void,
  onRedirectToCalculator?: () => void,
  onApplyDeductions?: (deductions: { section80C: number, section80D: number, section80G: number, homeLoanInterest: number }) => void,
  files: File[],
  setFiles: React.Dispatch<React.SetStateAction<File[]>>,
  categories: { [filename: string]: string },
  setCategories: React.Dispatch<React.SetStateAction<{ [filename: string]: string }>>,
  isProcessing: { [filename: string]: boolean },
  setIsProcessing: React.Dispatch<React.SetStateAction<{ [filename: string]: boolean }>>,
  ocrProgress: { [filename: string]: number },
  setOcrProgress: React.Dispatch<React.SetStateAction<{ [filename: string]: number }>>,
  amounts: { [filename: string]: number | null },
  setAmounts: React.Dispatch<React.SetStateAction<{ [filename: string]: number | null }>>,
  confirmed: { file: File, amount: number, category: string }[],
  setConfirmed: React.Dispatch<React.SetStateAction<{ file: File, amount: number, category: string }[]>>
}) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles(newFiles);
    setAmounts({});
    setOcrProgress({});
    setIsProcessing({});
    // Start OCR for each file
    newFiles.forEach(file => runOcr(file));
  };

  const runOcr = (file: File) => {
    setIsProcessing(prev => ({ ...prev, [file.name]: true }));
    setOcrProgress(prev => ({ ...prev, [file.name]: 0 }));
    Tesseract.recognize(
      file,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            setOcrProgress(prev => ({ ...prev, [file.name]: Math.round(m.progress * 100) }));
          }
        }
      }
    ).then(({ data: { text } }) => {
      console.log('OCR TEXT:', text); // <-- Add this line
      const amount = extractAmountFromText(text, file.name);
      setAmounts(prev => ({ ...prev, [file.name]: typeof amount === 'number' ? amount : null }));
      setIsProcessing(prev => ({ ...prev, [file.name]: false }));
      if (typeof amount === 'string') {
        toast({ title: amount, variant: 'destructive' });
      }
    }).catch(() => {
      setAmounts(prev => ({ ...prev, [file.name]: null }));
      setIsProcessing(prev => ({ ...prev, [file.name]: false }));
    });
  };

  const handleCategoryChange = (filename: string, value: string) => {
    setCategories(prev => ({ ...prev, [filename]: value }));
  };

  const handleConfirm = (file: File) => {
    const category = categories[file.name];
    const amount = amounts[file.name];
    if (!category) {
      toast({ title: "Please select a deduction category for this file.", variant: "destructive" });
      return;
    }
    if (amount == null || isNaN(amount)) {
      toast({ title: "Could not extract amount from this file.", variant: "destructive" });
      return;
    }
    setConfirmed(prev => [...prev, { file, amount, category }]);
    onDeductionExtracted?.({ file, category });
    toast({
      title: "Deduction Confirmed",
      description: `${file.name} assigned to ${category} (₹${amount.toLocaleString()})`,
      variant: "default"
    });
  };

  // Group confirmed by category for summary
  const summary: { [cat: string]: number } = {};
  confirmed.forEach(item => {
    if (!summary[item.category]) summary[item.category] = 0;
    summary[item.category] += item.amount;
  });

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
                {files.length > 0 ? `${files.length} file(s) selected` : "Choose receipt files"}
              </span>
            </Label>
            <Input
              id="receipt-upload"
              type="file"
              accept="image/*,.pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
              disabled={Object.values(isProcessing).some(Boolean)}
            />
            <p className="text-xs text-muted-foreground">
              Supports JPG, PNG, PDF up to 5MB
            </p>
          </div>
        </div>
        {files.length > 0 && (
          <ul className="space-y-3">
            {files.map(file => (
              <li key={file.name} className="flex items-center gap-4">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="truncate max-w-xs">{file.name}</span>
                <select
                  value={categories[file.name] || ""}
                  onChange={e => handleCategoryChange(file.name, e.target.value)}
                  className="border rounded px-2 py-1"
                  disabled={isProcessing[file.name]}
                >
                  <option value="">Select Category</option>
                  {deductionOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {isProcessing[file.name] && (
                  <span className="ml-2 text-xs text-muted-foreground flex items-center gap-1">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    OCR: {ocrProgress[file.name] || 0}%
                  </span>
                )}
                {!isProcessing[file.name] && (
                  typeof amounts[file.name] === 'number' ? (
                    <span className="ml-2 text-xs text-success">₹{amounts[file.name]?.toLocaleString()}</span>
                  ) : (
                    <span className="ml-2 text-xs text-destructive">No amount found</span>
                  )
                )}
                <Button size="sm" className="ml-2" onClick={() => handleConfirm(file)} disabled={isProcessing[file.name]}>
                  Confirm
                </Button>
              </li>
            ))}
          </ul>
        )}
        {Object.keys(summary).length > 0 && (
          <div className="bg-success-light p-4 rounded-lg mt-4">
            <h4 className="text-sm font-medium mb-2">Confirmed Deductions Summary:</h4>
            <ul className="text-sm">
              {Object.entries(summary).map(([cat, amt]) => (
                <li key={cat} className="mb-1">
                  <span className="font-semibold">{deductionOptions.find(o => o.value === cat)?.label || cat}:</span> ₹{amt.toLocaleString()}
                </li>
              ))}
            </ul>
            <Button
              className="mt-4"
              color="primary"
              onClick={() => {
                if (onApplyDeductions) {
                  onApplyDeductions({
                    section80C: summary['80C'] || 0,
                    section80D: summary['80D'] || 0,
                    section80G: summary['80G'] || 0,
                    homeLoanInterest: summary['24'] || 0
                  });
                }
                if (onRedirectToCalculator) onRedirectToCalculator();
              }}
            >
              Go to Tax Calculator
            </Button>
          </div>
        )}
        <div className="bg-muted/50 p-3 rounded-lg mt-4">
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