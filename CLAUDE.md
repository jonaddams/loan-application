# NextJS Loan Application POC - Development Steps

## Project Overview
A NextJS application that demonstrates AI-powered document classification and data extraction for loan applications using the XtractFlow API.

## Phase 1: Project Setup and Configuration

### Step 1: Initialize NextJS Project
- Create new NextJS project with TypeScript and Tailwind CSS
- Configure project structure with appropriate folders (`components`, `lib`, `types`, `constants`)
- Set up basic layout and routing structure

### Step 2: Environment Configuration
- Create `.env.local` file for API configuration
- Add environment variables for XtractFlow API base URL and authorization token
- Configure Next.js API routes structure

### Step 3: TypeScript Interfaces and Types
- Create type definitions for API request/response formats
- Define interfaces for:
  - Document templates and fields
  - API responses from `/register-component` and `/process`
  - Validation states and field formats
  - Loan application data structures

### Step 4: Constants and Mock Data
- Create constants file with predefined document templates
- Define loan package configurations (different combinations of documents)
- Set up sample document metadata for testing
- Create validation field mappings

## Phase 2: Core API Integration

### Step 5: API Utility Functions
- Create API client utility with proper headers and error handling
- Implement `registerComponent` function for template registration
- Implement `processDocument` function for file processing
- Add retry logic and error handling for API calls

### Step 6: Document Template Management
- Create template definitions for each document type:
  - Driver's License (name, DOB, address fields)
  - Passport (name, DOB, address fields)
  - Pay Stub (employer, gross/net pay, pay period)
  - Employment Letter (employer, gross/net pay, pay period)
  - Bank Statement (account holder, account number, statement period, balance)
  - Loan Application Form (requested amount, purpose)
- Implement template selection and registration logic

### Step 7: File Processing Logic
- Create document processing workflow
- Implement batch processing for multiple documents
- Add progress tracking for individual file processing
- Handle processing results and map to application fields

## Phase 3: UI Components Development

### Step 8: Layout and Navigation
- Create main layout component with responsive design
- Implement step indicator/progress bar for multi-step wizard
- Add header with branding and navigation elements
- Style with modern Tailwind design patterns

### Step 9: Welcome/Overview Page (Step 1)
- Create landing page explaining the POC concept
- Add feature highlights and benefits
- Include "Get Started" CTA button
- Implement smooth transitions to next step

### Step 10: Package Selection Page (Step 2)
- Create package selection interface with predefined loan packages
- Display package contents (list of document types included)
- Add package cards with visual indicators
- Implement package selection state management
- Add "Continue" button to proceed to results

### Step 11: Processing and Results Page (Step 3)
- Create processing status indicators with animations
- Implement real-time status updates (sending → processing → complete)
- Design results display with summary and detailed views
- Add expandable sections for validation details
- Create retry functionality for failed documents

### Step 12: Results Components
- Build summary card showing overall application status
- Create detailed results sections for each document type:
  - Borrower ID section (name, DOB, address)
  - Income verification section (employer, pay details)
  - Banking information section (account details, balance)
  - Loan details section (amount, purpose)
- Implement validation status indicators (valid/invalid/missing)

## Phase 4: Advanced Features and Polish

### Step 13: Validation and Status Logic
- Implement application validation logic
- Create rules for determining "valid" vs "invalid" applications
- Generate missing data reports
- Add field-level validation status display

### Step 14: Error Handling and User Feedback
- Create error boundary components
- Implement graceful error handling for API failures
- Add user-friendly error messages
- Create retry mechanisms for failed operations
- Add loading states and skeleton components

### Step 15: Responsive Design and Accessibility
- Ensure mobile responsiveness across all components
- Add proper ARIA labels and keyboard navigation
- Implement focus management for multi-step wizard
- Test and refine responsive breakpoints

### Step 16: Sample Data and Testing
- Create sample document files for testing
- Add sample data sets that demonstrate various scenarios
- Implement dev mode with mock responses for offline testing
- Add console logging for debugging and demonstration

## Phase 5: Deployment and Optimization

### Step 17: Performance Optimization
- Optimize image loading and component rendering
- Implement proper loading states and suspense boundaries
- Add error boundaries and fallback components
- Optimize bundle size and remove unused dependencies

### Step 18: Vercel Deployment Configuration
- Configure `vercel.json` for optimal deployment settings
- Set up environment variables in Vercel dashboard
- Configure domain and SSL settings
- Test production deployment

### Step 19: Final Testing and Refinement
- Test complete user flow from start to finish
- Verify API integration works correctly in production
- Test error scenarios and edge cases
- Validate responsive design on various devices

### Step 20: Documentation and Demo Preparation
- Create README with setup and usage instructions
- Document API integration and template configuration
- Prepare demo script and talking points
- Add inline code comments for clarity

## API Workflow

The correct sequence for processing documents with the XtractFlow API is:

### 1. Get Predefined Templates
Call `/api/get-predefined-templates` to retrieve available document templates from the system.

### 2. Register Component
Use a template from step 1 to call `/api/register-component`. This creates a processing component and returns a `componentId`.

**Important**: Even when using predefined templates, you must register them to get a valid `componentId`. You cannot use the template's `identifier` directly as a `componentId` for processing.

### 3. Process Documents
Use the `componentId` from step 2 to call `/api/process` with your document files.

### Example Flow
```javascript
// Step 1: Get predefined templates
const templates = await getPredefinedTemplates();

// Step 2: Find and register the desired template
const driverLicenseTemplate = templates.find(t => t.name.includes('Driver'));
const registerResponse = await registerComponent([driverLicenseTemplate]);
const componentId = registerResponse.componentId;

// Step 3: Process documents
const result = await processDocument(file, componentId);
```

## API Specifications

### Authentication
All API requests require an Authorization header:
```
Authorization: Bearer <your_auth_token>
```

### POST /api/register-component
**Purpose**: Register document templates for classification and extraction

**Request Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "enableClassifier": true,
  "enableExtraction": true,
  "templates": [
    {
      "name": "Driver License",
      "fields": [
        {
          "name": "fullName",
          "semanticDescription": "Full name of the license holder",
          "format": "Text",
          "validationMethod": "PostalAddressIntegrity"
        },
        {
          "name": "dateOfBirth",
          "semanticDescription": "Date of birth",
          "format": "Date",
          "validationMethod": "DateIntegrity"
        },
        {
          "name": "address",
          "semanticDescription": "Full address of the license holder",
          "format": "Text",
          "validationMethod": "PostalAddressIntegrity"
        }
      ],
      "identifier": "driver_license",
      "semanticDescription": "Government issued driver's license for identification"
    }
  ]
}
```

**Available Field Formats**:
- `Text`
- `Number` 
- `Date`
- `Currency`

**Available Validation Methods**:
- `PostalAddressIntegrity`
- `IBANIntegrity`
- `CreditCardNumberIntegrity`
- `VehicleIdentificationNumberIntegrity`
- `EmailIntegrity`
- `URIIntegrity`
- `VATIdIntegrity`
- `PhoneNumberIntegrity`
- `CurrencyIntegrity`
- `DateIntegrity`
- `NumberIntegrity`

**Response**:
```json
{
  "componentId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response Schema**:
```json
{
  "type": "object",
  "properties": {
    "componentId": {
      "type": "string",
      "format": "uuid"
    }
  }
}
```

### POST /api/process
**Purpose**: Process uploaded documents using registered templates

**Request Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body** (FormData):
```json
{
  "inputFile": "<file_binary_data>",
  "componentId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Supported File Formats**:
- PDF
- PNG
- JPG/JPEG
- DOCX
- TIFF

**Response**:
```json
{
  "detectedTemplate": "driver_license",
  "fields": [
    {
      "fieldName": "fullName",
      "value": {
        "value": "John Smith",
        "format": "Text"
      },
      "validationState": "Valid"
    },
    {
      "fieldName": "dateOfBirth",
      "value": {
        "value": "1985-03-15",
        "format": "Date"
      },
      "validationState": "Valid"
    },
    {
      "fieldName": "address",
      "value": {
        "value": "123 Main St, Anytown, ST 12345",
        "format": "Text"
      },
      "validationState": "VerificationNeeded"
    }
  ]
}
```

**Response Schema**:
```json
{
  "type": "object",
  "properties": {
    "detectedTemplate": {
      "type": ["string", "null"]
    },
    "fields": {
      "type": ["array", "null"],
      "items": {
        "type": "object",
        "properties": {
          "fieldName": {
            "type": "string"
          },
          "value": {
            "type": "object",
            "properties": {
              "value": {
                "type": "string"
              },
              "format": {
                "enum": ["Text", "Number", "Date", "Currency"]
              }
            }
          },
          "validationState": {
            "enum": ["Undefined", "VerificationNeeded", "Valid"]
          }
        }
      }
    }
  }
}
```

**Validation States**:
- `Valid`: Field passed validation
- `VerificationNeeded`: Field extracted but requires manual verification
- `Undefined`: Field could not be validated or extracted

### GET /api/get-predefined-templates
**Purpose**: Retrieve predefined document templates available in the system

**Request Headers**:
```
Authorization: D5866799-4283-45DF-9E3A-263D4EDE07A3
```

**Example Usage**:
```javascript
fetch('https://api.xtractflow.com/api/get-predefined-templates', {
  headers: {
    Authorization: 'D5866799-4283-45DF-9E3A-263D4EDE07A3'
  }
})
```

**Response**:
```json
[
  {
    "name": "…",
    "fields": [
      {
        "name": "…",
        "semanticDescription": "…",
        "format": "Text",
        "validationMethod": "PostalAddressIntegrity"
      }
    ],
    "identifier": "…",
    "semanticDescription": "…"
  }
]
```

**Response Schema**:
```json
{
  "schema": {
    "type": "array",
    "items": {
      "required": [
        "fields"
      ],
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "fields": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "semanticDescription": {
                "type": "string"
              },
              "format": {
                "enum": [
                  "Text",
                  "Number",
                  "Date",
                  "Currency"
                ]
              },
              "validationMethod": {
                "enum": [
                  "PostalAddressIntegrity",
                  "IBANIntegrity",
                  "CreditCardNumberIntegrity",
                  "VehicleIdentificationNumberIntegrity",
                  "EmailIntegrity",
                  "URIIntegrity",
                  "VATIdIntegrity",
                  "PhoneNumberIntegrity",
                  "CurrencyIntegrity",
                  "DateIntegrity",
                  "NumberIntegrity",
                  null
                ],
                "type": [
                  null,
                  "null"
                ]
              }
            }
          }
        },
        "identifier": {
          "type": "string"
        },
        "semanticDescription": {
          "type": "string"
        }
      }
    }
  }
}
```

Returns an array of predefined document templates, each containing the same structure as templates used in the `/api/register-component` endpoint.

## Technical Specifications

### Required Dependencies
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- Lucide React (for icons)
- React Hook Form (if needed for complex forms)

### API Base URL
- `https://api.xtractflow.com`

### File Structure
```
src/
├── app/
│   ├── page.tsx (Welcome)
│   ├── select-package/page.tsx
│   ├── results/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/ (reusable components)
│   ├── PackageSelector.tsx
│   ├── ProcessingStatus.tsx
│   ├── ResultsSummary.tsx
│   └── ResultsDetail.tsx
├── lib/
│   ├── api.ts
│   ├── types.ts
│   └── constants.ts
└── types/
    └── index.ts
```

### Environment Variables
```
NEXT_PUBLIC_XTRACTFLOW_API_URL=https://api.xtractflow.com
XTRACTFLOW_AUTH_TOKEN=your_auth_token_here
```

## Success Criteria
- Functional 3-step wizard interface
- Successful API integration with XtractFlow
- Responsive design that works on mobile and desktop
- Clear demonstration of document classification and extraction
- Professional, modern UI that showcases the API capabilities
- Deployed and accessible via Vercel URL