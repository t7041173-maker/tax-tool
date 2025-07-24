import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockTransactions, getBankDataSuggestions } from "@/services/mockBankData";
import { useToast } from "@/components/ui/use-toast";

interface BankDataImportProps {
  onDataImport: (data: any) => void;
}

export const BankDataImport = ({ onDataImport }: BankDataImportProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFetchBankData = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setTransactions(mockTransactions);
      const suggestions = getBankDataSuggestions();
      
      toast({
        title: "Bank Data Imported",
        description: `Found ${mockTransactions.length} transactions with auto-categorized tax deductions`,
      });
      
      setIsLoading(false);
    }, 2000);
  };

  const handleApplySuggestions = () => {
    const suggestions = getBankDataSuggestions();
    onDataImport(suggestions);
    
    toast({
      title: "Data Applied",
      description: "Tax calculator updated with bank transaction data",
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Auto-Fill from Bank Data</h3>
          <Button 
            onClick={handleFetchBankData} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? "Fetching..." : "Import Bank Transactions"}
          </Button>
        </div>

        {transactions.length > 0 && (
          <>
            <div className="rounded-lg border max-h-64 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-sm">{transaction.date}</TableCell>
                      <TableCell className="text-sm">{transaction.description}</TableCell>
                      <TableCell className={`text-sm font-medium ${transaction.amount > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                        ₹{Math.abs(transaction.amount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.category === 'income' ? 'default' : 'secondary'}>
                          {transaction.taxSection || transaction.category}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="bg-primary-light p-4 rounded-lg">
              <h4 className="font-medium mb-2">Auto-Detected Tax Data:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Annual Income:</span>
                  <p className="font-semibold">₹{getBankDataSuggestions().annualIncome.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">80C Deductions:</span>
                  <p className="font-semibold">₹{getBankDataSuggestions().section80C.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">80D Deductions:</span>
                  <p className="font-semibold">₹{getBankDataSuggestions().section80D.toLocaleString()}</p>
                </div>
              </div>
              
              <Button 
                onClick={handleApplySuggestions}
                className="mt-4 w-full"
              >
                Apply to Tax Calculator
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};