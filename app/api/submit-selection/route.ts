import { NextRequest, NextResponse } from 'next/server'

interface CustomerInfo {
  name: string
  email: string
  phone: string
  message: string
}

interface SubmissionData {
  fileName: string
  selectedPages: number[]
  customerInfo: CustomerInfo
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const data: SubmissionData = await request.json()
    
    // Validate the submission data
    if (!data.fileName || !data.selectedPages || !data.customerInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate customer info
    const { name, email, phone } = data.customerInfo
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Customer information is incomplete' },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    // Here you can add your business logic:
    // 1. Save to database
    // 2. Send email notifications
    // 3. Integrate with CRM systems
    // 4. Generate invoice/quote
    
    // For now, we'll just log the submission
    console.log('New selection submission:', {
      fileName: data.fileName,
      selectedPages: data.selectedPages,
      customer: {
        name: data.customerInfo.name,
        email: data.customerInfo.email,
        phone: data.customerInfo.phone,
      },
      totalPages: data.selectedPages.length,
      timestamp: data.timestamp
    })
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real application, you might want to:
    // 1. Send confirmation email to customer
    // 2. Send notification email to admin
    // 3. Save submission to database
    // 4. Create a ticket in your system
    
    // Example of what you could do with the data:
    /*
    // Save to database (example with a hypothetical DB)
    await db.submissions.create({
      fileName: data.fileName,
      selectedPages: data.selectedPages,
      customerName: data.customerInfo.name,
      customerEmail: data.customerInfo.email,
      customerPhone: data.customerInfo.phone,
      message: data.customerInfo.message,
      createdAt: new Date(data.timestamp)
    })
    
    // Send email notification (example with a hypothetical email service)
    await emailService.send({
      to: data.customerInfo.email,
      subject: `Catalogue Selection Confirmation - ${data.fileName}`,
      template: 'selection-confirmation',
      data: {
        customerName: data.customerInfo.name,
        fileName: data.fileName,
        selectedPages: data.selectedPages,
        totalPages: data.selectedPages.length
      }
    })
    
    // Notify admin
    await emailService.send({
      to: 'admin@yourcompany.com',
      subject: `New Catalogue Selection from ${data.customerInfo.name}`,
      template: 'admin-notification',
      data: data
    })
    */
    
    return NextResponse.json({
      success: true,
      message: 'Selection submitted successfully',
      submissionId: `sel_${Date.now()}`, // Generate a simple submission ID
      data: {
        fileName: data.fileName,
        selectedPages: data.selectedPages,
        totalPages: data.selectedPages.length,
        customerEmail: data.customerInfo.email
      }
    })
    
  } catch (error) {
    console.error('Error processing submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}