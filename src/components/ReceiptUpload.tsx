import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedReceipt {
  id: string;
  fileName: string;
  category: string;
  amount: number;
  status: 'processing' | 'verified' | 'rejected';
  extractedData?: {
    vendor: string;
    date: string;
    amount: number;
    category: string;
  };
}

export const ReceiptUpload = () => {
  const [uploadedReceipts, setUploadedReceipts] = useState<UploadedReceipt[]>([
    {
      id: '1',
      fileName: 'health_insurance_premium.pdf',
      category: '80D',
      amount: 15000,
      status: 'verified',
      extractedData: {
        vendor: 'Star Health Insurance',
        date: '15 Jan 2024',
        amount: 15000,
        category: 'Health Insurance'
      }
    },
    {
      id: '2', 
      fileName: 'lic_premium_receipt.pdf',
      category: '80C',
      amount: 25000,
      status: 'processing'
    }
  ]);
  
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const newReceipt: UploadedReceipt = {
      id: Date.now().toString(),
      fileName: file.name,
      category: 'Processing...',
      amount: 0,
      status: 'processing'
    };

    setUploadedReceipts(prev => [newReceipt, ...prev]);

    // Simulate OCR processing
    setTimeout(() => {
      setUploadedReceipts(prev => 
        prev.map(receipt => 
          receipt.id === newReceipt.id
            ? {
                ...receipt,
                category: '80C',
                amount: Math.floor(Math.random() * 50000) + 5000,
                status: 'verified',
                extractedData: {
                  vendor: 'Mock Vendor',
                  date: new Date().toLocaleDateString(),
                  amount: Math.floor(Math.random() * 50000) + 5000,
                  category: 'Investment'
                }
              }
            : receipt
        )
      );

      toast({
        title: "Receipt Processed",
        description: "Data extracted successfully using AI OCR",
      });
    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'processing':
        return <AlertCircle className="h-5 w-5 text-warning animate-pulse" />;
      case 'rejected':
        return <X className="h-5 w-5 text-destructive" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-success text-success-foreground">Verified</Badge>;
      case 'processing':
        return <Badge className="bg-warning text-warning-foreground">Processing</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging 
            ? 'border-primary bg-primary-light' 
            : 'border-border hover:border-primary/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="font-semibold mb-2">Upload Tax Documents</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag & drop receipts or click to browse
        </p>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <Button 
          variant="outline" 
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          Choose Files
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Supports PDF, JPG, PNG • Max 10MB
        </p>
      </div>

      {/* Uploaded Receipts */}
      <div className="space-y-4">
        <h3 className="font-semibold">Recent Uploads</h3>
        {uploadedReceipts.map((receipt) => (
          <Card key={receipt.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(receipt.status)}
                <div>
                  <p className="font-medium">{receipt.fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    {receipt.extractedData?.vendor || 'Processing...'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  {receipt.amount > 0 && (
                    <span className="font-semibold">₹{receipt.amount.toLocaleString()}</span>
                  )}
                  {getStatusBadge(receipt.status)}
                </div>
                <Badge variant="outline" className="text-xs">
                  {receipt.category}
                </Badge>
              </div>
            </div>

            {receipt.extractedData && receipt.status === 'verified' && (
              <div className="mt-4 p-3 rounded-lg bg-success-light border border-success/20">
                <p className="text-sm font-medium text-success mb-2">Extracted Data:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <span className="ml-2">{receipt.extractedData.date}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="ml-2">₹{receipt.extractedData.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* OCR Features */}
      <Card className="p-4 bg-primary-light border-primary/20">
        <h3 className="font-semibold text-primary mb-3">AI-Powered OCR Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>Auto-extract amounts & dates</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>Categorize tax deductions</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>Validate receipt authenticity</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>Multi-language support</span>
          </div>
        </div>
      </Card>
    </div>
  );
};