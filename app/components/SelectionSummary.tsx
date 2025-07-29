'use client'

import { useState } from 'react'
import { SelectedPage } from '../page'
import { CheckCircleIcon, PaperAirplaneIcon, ArrowLeftIcon, UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'

interface SelectionSummaryProps {
  selectedPages: SelectedPage[]
  fileName: string
  onStartOver: () => void
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  message: string
}

export default function SelectionSummary({ selectedPages, fileName, onStartOver }: SelectionSummaryProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {}
    
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const submissionData = {
        fileName,
        selectedPages: selectedPages.map(p => p.pageNumber).sort((a, b) => a - b),
        customerInfo,
        timestamp: new Date().toISOString()
      }

      const response = await fetch('/api/submit-selection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        throw new Error('Failed to submit selection')
      }
    } catch (error) {
      console.error('Error submitting selection:', error)
      alert('There was an error submitting your selection. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Selection Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your selection. We have received your request for {selectedPages.length} page{selectedPages.length !== 1 ? 's' : ''} from {fileName}.
            We will contact you shortly at {customerInfo.email}.
          </p>
          <div className="space-y-2 text-sm text-gray-500 mb-6">
            <p><strong>Selected Pages:</strong> {selectedPages.map(p => p.pageNumber).sort((a, b) => a - b).join(', ')}</p>
            <p><strong>Contact:</strong> {customerInfo.name} ({customerInfo.email})</p>
          </div>
          <button
            onClick={onStartOver}
            className="btn-primary"
          >
            Submit Another Selection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Review Your Selection</h2>
            <p className="text-gray-600 mt-1">
              {selectedPages.length} page{selectedPages.length !== 1 ? 's' : ''} selected from {fileName}
            </p>
          </div>
          <button
            onClick={onStartOver}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Catalog</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selected Pages */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Pages</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedPages
              .sort((a, b) => a.pageNumber - b.pageNumber)
              .map((page) => (
                <div
                  key={page.pageNumber}
                  className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="font-medium text-green-800">
                    Page {page.pageNumber}
                  </span>
                </div>
              ))}
          </div>
          
          {selectedPages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No pages selected</p>
            </div>
          )}
        </div>

        {/* Customer Information Form */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`input-field pl-10 ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  id="email"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`input-field pl-10 ${errors.email ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="tel"
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`input-field pl-10 ${errors.phone ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Message (Optional)
              </label>
              <textarea
                id="message"
                rows={4}
                value={customerInfo.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="input-field resize-none"
                placeholder="Any special requirements or questions..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting || selectedPages.length === 0}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                submitting || selectedPages.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-5 w-5" />
                  <span>Submit Selection</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Summary Card */}
      <div className="card p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-blue-900">
                Ready to submit your selection?
              </p>
              <p className="text-sm text-blue-700">
                We'll contact you with pricing and availability information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}