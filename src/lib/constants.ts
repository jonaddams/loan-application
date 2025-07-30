import type { DocumentTemplate, LoanPackage } from "@/types";

// Document template definitions
export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
	{
		name: "Driver License",
		identifier: "driver_license",
		semanticDescription:
			"Government issued driver's license for identification",
		fields: [
			{
				name: "fullName",
				semanticDescription: "Full name of the license holder",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "dateOfBirth",
				semanticDescription: "Date of birth",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "address",
				semanticDescription: "Full address of the license holder",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
		],
	},
	{
		name: "Passport",
		identifier: "passport",
		semanticDescription: "Government issued passport for identification",
		fields: [
			{
				name: "fullName",
				semanticDescription: "Full name of the passport holder",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "dateOfBirth",
				semanticDescription: "Date of birth",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "address",
				semanticDescription: "Full address of the passport holder",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
		],
	},
	{
		name: "Pay Stub",
		identifier: "pay_stub",
		semanticDescription: "Recent pay stub for income verification",
		fields: [
			{
				name: "employer",
				semanticDescription: "Employer name",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "grossPay",
				semanticDescription: "Gross pay amount",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "netPay",
				semanticDescription: "Net pay amount",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "payPeriod",
				semanticDescription: "Pay period frequency",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
		],
	},
	{
		name: "Employment Letter",
		identifier: "employment_letter",
		semanticDescription: "Employment verification letter",
		fields: [
			{
				name: "employer",
				semanticDescription: "Employer name",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "grossPay",
				semanticDescription: "Annual gross salary",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "netPay",
				semanticDescription: "Annual net salary",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "payPeriod",
				semanticDescription: "Salary payment frequency",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
		],
	},
	{
		name: "Bank Statement",
		identifier: "bank_statement",
		semanticDescription: "Recent bank statement for financial verification",
		fields: [
			{
				name: "accountHolder",
				semanticDescription: "Account holder name",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "accountNumber",
				semanticDescription: "Bank account number",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "statementPeriod",
				semanticDescription: "Statement period dates",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "balance",
				semanticDescription: "Account balance",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
		],
	},
	{
		name: "Loan Application Form",
		identifier: "loan_application",
		semanticDescription: "Formal loan application document",
		fields: [
			{
				name: "requestedAmount",
				semanticDescription: "Requested loan amount",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "purpose",
				semanticDescription: "Purpose of the loan",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
		],
	},
];

// Loan package configurations
export const LOAN_PACKAGES: LoanPackage[] = [
	{
		id: "package1",
		name: "Package 1",
		description:
			"Sample document set with identification and income verification",
		documents: [
			{
				type: "Driver's License",
				description: "Government-issued identification",
			},
			{ type: "Pay Stub", description: "Recent income verification" },
			{ type: "Bank Statement", description: "Financial account information" },
		],
	},
	{
		id: "package2",
		name: "Package 2",
		description: "Extended document set with multiple identification options",
		documents: [
			{
				type: "Driver's License",
				description: "Government-issued identification",
			},
			{ type: "Passport", description: "Alternative identification document" },
			{ type: "Pay Stub", description: "Recent income verification" },
			{ type: "Employment Letter", description: "Employment verification" },
			{ type: "Bank Statement", description: "Financial account information" },
		],
	},
	{
		id: "package3",
		name: "Package 3",
		description: "Complete document set including formal application forms",
		documents: [
			{
				type: "Driver's License",
				description: "Government-issued identification",
			},
			{ type: "Passport", description: "Alternative identification document" },
			{ type: "Pay Stub", description: "Recent income verification" },
			{ type: "Employment Letter", description: "Employment verification" },
			{ type: "Bank Statement", description: "Financial account information" },
			{
				type: "Loan Application Form",
				description: "Formal application document",
			},
		],
	},
];

// API configuration
export const API_CONFIG = {
	baseUrl:
		process.env.NEXT_PUBLIC_NUTRIENT_API_URL || "https://api.xtractflow.com",
	authToken: process.env.NUTRIENT_AUTH_TOKEN || "",
};

// Processing steps for UI
export const PROCESSING_STEPS = [
	{ id: 1, name: "Uploading documents", status: "pending" as const },
	{ id: 2, name: "Classifying document types", status: "pending" as const },
	{ id: 3, name: "Extracting data fields", status: "pending" as const },
	{ id: 4, name: "Validating information", status: "pending" as const },
	{ id: 5, name: "Generating results", status: "pending" as const },
];
