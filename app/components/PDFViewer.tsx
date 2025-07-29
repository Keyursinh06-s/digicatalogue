'use client'

import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { CheckCircleIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface PDFViewerProps {
  file: File
  selectedPages: number[]
  onPageSelection: (pageNumber: number, isSelected: boolean, thumbnail?: string) => void
  onProceedToSummary: () => void
  onStartOver: () => void
}

export default function PDFViewer({ 
  file, 
  selectedPages, 
  onPageSelection, 
  onProceedToSummary, 
  onStartOver 
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single')
  const [scale, setScale] = useState(0.8)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
  }

  const togglePageSelection = (page: number) => {
    const isSelected = selectedPages.includes(page)
    onPageSelection(page, !isSelected)
  }

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(1, prev - 1))
  }

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(numPages, prev + 1))
  }

  const selectAllPages = () => {
    for (let i = 1; i <= numPages; i++) {
      if (!selectedPages.includes(i)) {
        onPageSelection(i, true)
      }
    }
  }

  const clearAllSelections = () => {
    selectedPages.forEach(page => {
      onPageSelection(page, false)
    })
  }

  const GridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
        <div key={page} className="relative group">
          <div 
            className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
              selectedPages.includes(page) 
                ? 'border-green-500 shadow-lg scale-105' 
                : 'border-gray-200 hover:border-primary-400 hover:shadow-md'
            }`}
            onClick={() => togglePageSelection(page)}
          >
            <Document file={file} loading={null}>
              <Page 
                pageNumber={page} 
                scale={0.3}
                loading={null}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
            
            {/* Selection Overlay */}
            <div className={`absolute inset-0 transition-opacity duration-200 ${
              selectedPages.includes(page) 
                ? 'bg-green-500 bg-opacity-20' 
                : 'bg-black bg-opacity-0 group-hover:bg-opacity-10'
            }`} />
            
            {/* Selection Icon */}
            <div className="absolute top-2 right-2">
              {selectedPages.includes(page) ? (
                <CheckCircleIconSolid className="h-6 w-6 text-green-500 bg-white rounded-full" />
              ) : (
                <div className="h-6 w-6 border-2 border-white rounded-full bg-black bg-opacity-30" />
              )}
            </div>
            
            {/* Page Number */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              Page {page}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const SingleView = () => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Document file={file} loading={null}>
          <Page 
            pageNumber={pageNumber} 
            scale={scale}
            loading={null}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-lg"
          />
        </Document>
        
        {/* Selection Overlay for Current Page */}
        {selectedPages.includes(pageNumber) && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-20 border-4 border-green-500 rounded-lg" />
        )}
      </div>
      
      {/* Navigation Controls */}
      <div className="flex items-center space-x-4 mt-6">
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          <span>Previous</span>
        </button>
        
        <span className="text-gray-600">
          Page {pageNumber} of {numPages}
        </span>
        
        <button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          <span>Next</span>
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Current Page Selection */}
      <div className="mt-4">
        <button
          onClick={() => togglePageSelection(pageNumber)}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
            selectedPages.includes(pageNumber)
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-primary-100 text-primary-800 hover:bg-primary-200'
          }`}
        >
          {selectedPages.includes(pageNumber) ? (
            <>
              <CheckCircleIconSolid className="h-5 w-5" />
              <span>Selected</span>
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-5 w-5" />
              <span>Select Page {pageNumber}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{file.name}</h2>
            <p className="text-gray-600">{numPages} pages • {selectedPages.length} selected</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onStartOver}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back</span>
            </button>
            
            {selectedPages.length > 0 && (
              <button
                onClick={onProceedToSummary}
                className="flex items-center space-x-2 btn-primary"
              >
                <span>Continue</span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('single')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'single'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Single Page
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Pages
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={selectAllPages}
              className="text-sm px-3 py-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-lg transition-colors"
            >
              Select All
            </button>
            <button
              onClick={clearAllSelections}
              className="text-sm px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className="card p-6">
        {viewMode === 'single' ? <SingleView /> : <GridView />}
      </div>

      {/* Selection Summary */}
      {selectedPages.length > 0 && (
        <div className="card p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircleIconSolid className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">
                {selectedPages.length} page{selectedPages.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={onProceedToSummary}
              className="btn-primary"
            >
              Continue to Review
            </button>
          </div>
        </div>
      )}
    </div>
  )
}