'use client'

import { useState } from 'react'
import PDFUpload from './components/PDFUpload'
import PDFViewer from './components/PDFViewer'
import SelectionSummary from './components/SelectionSummary'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

export interface SelectedPage {
  pageNumber: number
  thumbnail?: string
}

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [selectedPages, setSelectedPages] = useState<SelectedPage[]>([])
  const [currentStep, setCurrentStep] = useState<'upload' | 'view' | 'summary'>('upload')

  const handleFileUpload = (file: File) => {
    setPdfFile(file)
    setSelectedPages([])
    setCurrentStep('view')
  }

  const handlePageSelection = (pageNumber: number, isSelected: boolean, thumbnail?: string) => {
    if (isSelected) {
      setSelectedPages(prev => [...prev, { pageNumber, thumbnail }])
    } else {
      setSelectedPages(prev => prev.filter(p => p.pageNumber !== pageNumber))
    }
  }

  const handleProceedToSummary = () => {
    setCurrentStep('summary')
  }

  const handleStartOver = () => {
    setPdfFile(null)
    setSelectedPages([])
    setCurrentStep('upload')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Digital Catalogue</h1>
              <p className="text-gray-600 mt-1">Upload PDF catalogs and let customers select what they want</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-8">
            <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-primary-600' : currentStep === 'view' || currentStep === 'summary' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep === 'upload' ? 'bg-primary-600 text-white' : currentStep === 'view' || currentStep === 'summary' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                1
              </div>
              <span className="font-medium">Upload PDF</span>
            </div>
            <div className={`flex items-center space-x-2 ${currentStep === 'view' ? 'text-primary-600' : currentStep === 'summary' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep === 'view' ? 'bg-primary-600 text-white' : currentStep === 'summary' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
              <span className="font-medium">Select Pages</span>
            </div>
            <div className={`flex items-center space-x-2 ${currentStep === 'summary' ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep === 'summary' ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                3
              </div>
              <span className="font-medium">Review & Submit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'upload' && (
          <PDFUpload onFileUpload={handleFileUpload} />
        )}
        
        {currentStep === 'view' && pdfFile && (
          <PDFViewer 
            file={pdfFile}
            selectedPages={selectedPages.map(p => p.pageNumber)}
            onPageSelection={handlePageSelection}
            onProceedToSummary={handleProceedToSummary}
            onStartOver={handleStartOver}
          />
        )}
        
        {currentStep === 'summary' && (
          <SelectionSummary 
            selectedPages={selectedPages}
            fileName={pdfFile?.name || ''}
            onStartOver={handleStartOver}
          />
        )}
      </main>
    </div>
  )
}