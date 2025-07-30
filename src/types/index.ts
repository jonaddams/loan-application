// Field format types
export type FieldFormat = "Text" | "Number" | "Date" | "Currency";

// Validation method types
export type ValidationMethod =
	| "PostalAddressIntegrity"
	| "IBANIntegrity"
	| "CreditCardNumberIntegrity"
	| "VehicleIdentificationNumberIntegrity"
	| "EmailIntegrity"
	| "URIIntegrity"
	| "VATIdIntegrity"
	| "PhoneNumberIntegrity"
	| "CurrencyIntegrity"
	| "DateIntegrity"
	| "NumberIntegrity";

// Validation state types
export type ValidationState = "Undefined" | "VerificationNeeded" | "Valid";

// Document template field definition
export interface TemplateField {
	name: string;
	semanticDescription: string;
	format: FieldFormat;
	validationMethod: ValidationMethod;
}

// Document template definition
export interface DocumentTemplate {
	name: string;
	fields: TemplateField[];
	identifier: string;
	semanticDescription: string;
}

// Register component request
export interface RegisterComponentRequest {
	enableClassifier: boolean;
	enableExtraction: boolean;
	templates: DocumentTemplate[];
}

// Register component response
export interface RegisterComponentResponse {
	componentId: string;
}

// Field value from processing response
export interface FieldValue {
	value: string;
	format: FieldFormat;
}

// Processed field from API response
export interface ProcessedField {
	fieldName: string;
	value: FieldValue;
	validationState: ValidationState;
}

// Process document response
export interface ProcessDocumentResponse {
	detectedTemplate: string | null;
	fields: ProcessedField[] | null;
}

// Loan package definition
export interface LoanPackage {
	id: string;
	name: string;
	description: string;
	documents: {
		type: string;
		description: string;
	}[];
}

// Application summary for results
export interface ApplicationSummary {
	totalDocuments: number;
	processedDocuments: number;
	validFields: number;
	invalidFields: number;
	missingFields: number;
	overallStatus: "valid" | "needs_review" | "invalid";
}

// Document processing result
export interface DocumentResult {
	id: string;
	type: string;
	status: "processing" | "completed" | "failed";
	fields: {
		name: string;
		value: string;
		status: "valid" | "verification_needed" | "missing" | "invalid";
	}[];
}

// Complete processing results
export interface ProcessingResults {
	summary: ApplicationSummary;
	documents: DocumentResult[];
}

// Processing step for UI
export interface ProcessingStep {
	id: number;
	name: string;
	status: "pending" | "processing" | "completed" | "failed";
}
