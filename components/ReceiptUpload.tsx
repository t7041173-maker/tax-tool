import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Upload, FileText } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';

const ReceiptUpload = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        multiple: true,
      });

      if (!result.canceled) {
        setFiles(result.assets);
        setIsProcessing(true);
        
        // Simulate OCR processing
        setTimeout(() => {
          setIsProcessing(false);
          Alert.alert(
            'OCR Processing Complete',
            'Receipt data has been extracted and categorized.',
            [{ text: 'OK' }]
          );
        }, 3000);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload files');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Smart Receipt Scanner</Text>
        <Text style={styles.subtitle}>
          Upload receipts for automatic tax deduction extraction using OCR
        </Text>

        <TouchableOpacity
          style={styles.uploadArea}
          onPress={handleFileUpload}
          disabled={isProcessing}
        >
          <Upload size={48} color="#0070ba" />
          <Text style={styles.uploadText}>
            {files.length > 0 ? `${files.length} file(s) selected` : 'Choose receipt files'}
          </Text>
          <Text style={styles.uploadSubtext}>
            Supports JPG, PNG, PDF up to 5MB
          </Text>
        </TouchableOpacity>

        {files.length > 0 && (
          <ScrollView style={styles.filesContainer}>
            {files.map((file, index) => (
              <View key={index} style={styles.fileItem}>
                <FileText size={20} color="#6c757d" />
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Text style={styles.fileSize}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </View>
                {isProcessing && (
                  <Text style={styles.processingText}>Processing...</Text>
                )}
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.supportedDocs}>
          <Text style={styles.supportedTitle}>Supported Documents:</Text>
          <View style={styles.docGrid}>
            <Text style={styles.docItem}>• LIC/Insurance receipts</Text>
            <Text style={styles.docItem}>• Health insurance bills</Text>
            <Text style={styles.docItem}>• ELSS investment receipts</Text>
            <Text style={styles.docItem}>• Donation receipts</Text>
            <Text style={styles.docItem}>• School fee receipts</Text>
            <Text style={styles.docItem}>• Home loan statements</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 20,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: '#333',
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#6c757d',
  },
  filesContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  fileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: '#6c757d',
  },
  processingText: {
    fontSize: 12,
    color: '#0070ba',
    fontWeight: '600',
  },
  supportedDocs: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  supportedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  docGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  docItem: {
    fontSize: 12,
    color: '#6c757d',
    width: '48%',
    marginBottom: 4,
  },
});

export default ReceiptUpload;