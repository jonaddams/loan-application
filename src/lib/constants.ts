import type { DocumentTemplate, LoanPackage } from "@/types";

// Document template definitions
export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
	{
		name: "Driver License",
		identifier: "driver_license",
		semanticDescription:
			"Government issued driver's license for identification and verification",
		fields: [
			{
				name: "fullName",
				semanticDescription: "Full name of the license holder as printed on the license",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "firstName",
				semanticDescription: "First name of the license holder (appears after 'FN' on the license, extract only the name value, not the 'FN' prefix)",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "lastName",
				semanticDescription: "Last name of the license holder (appears after 'LN' on the license, extract only the name value, not the 'LN' prefix)",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "dateOfBirth",
				semanticDescription: "Date of birth or birth date as shown on the license",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "address",
				semanticDescription: "Full residential address of the license holder",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "licenseNumber",
				semanticDescription: "Driver license number or identification number",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "state",
				semanticDescription: "State or province that issued the license",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "expirationDate",
				semanticDescription: "License expiration date",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "issueDate",
				semanticDescription: "Date the license was issued",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "class",
				semanticDescription: "License class or type (Class C, Class A, etc.)",
				format: "Text",
				validationMethod: null,
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
				semanticDescription: "Employer or company name",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "employerAddress",
				semanticDescription: "Employer address or company address",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "employeeName",
				semanticDescription: "Employee full name",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "employeeAddress",
				semanticDescription: "Employee address",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "socialSecurityNumber",
				semanticDescription: "Employee SSN or social security number (may be partially masked)",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "employeeId",
				semanticDescription: "Employee ID or employee number",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "jobTitle",
				semanticDescription: "Employee job title or position (appears after 'Position:' or 'Title:' on the pay stub)",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "payPeriodStart",
				semanticDescription: "Pay period start date or beginning date",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "payPeriodEnd",
				semanticDescription: "Pay period end date or ending date",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "payDate",
				semanticDescription: "Pay date or check date",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "grossPay",
				semanticDescription: "Current gross pay amount for this pay period (numeric dollar amount like 3,500.00, not currency symbol)",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "netPay",
				semanticDescription: "Current net pay amount for this pay period (numeric dollar amount like 2,800.00, not currency symbol)",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "regularPay",
				semanticDescription: "Regular hours pay amount (numeric dollar amount like 2,800.00, not currency symbol)",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "overtimePay",
				semanticDescription: "Overtime pay amount (numeric dollar amount like 700.00, not currency symbol)",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "regularHours",
				semanticDescription: "Regular hours worked",
				format: "Number",
				validationMethod: "NumberIntegrity",
			},
			{
				name: "overtimeHours",
				semanticDescription: "Overtime hours worked",
				format: "Number",
				validationMethod: "NumberIntegrity",
			},
			{
				name: "hourlyRate",
				semanticDescription: "Hourly pay rate or wage rate",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "payPeriodFrequency",
				semanticDescription: "Pay frequency (Weekly, Bi-Weekly, Monthly, etc.)",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "yearToDateGross",
				semanticDescription: "Year-to-date gross pay total (numeric dollar amount like 42,000.00, not currency symbol)",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "yearToDateNet",
				semanticDescription: "Year-to-date net pay total (numeric dollar amount like 33,600.00, not currency symbol)",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "federalTaxWithheld",
				semanticDescription: "Federal income tax withheld this period",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "stateTaxWithheld",
				semanticDescription: "State income tax withheld this period",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "socialSecurityTax",
				semanticDescription: "Social Security tax withheld this period",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "medicareTax",
				semanticDescription: "Medicare tax withheld this period",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "totalDeductions",
				semanticDescription: "Total deductions for this pay period",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
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
				semanticDescription: "Account holder name on the bank statement",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "accountNumber",
				semanticDescription: "Bank account number or partial account number",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "routingNumber",
				semanticDescription: "Bank routing number or transit number",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "bankName",
				semanticDescription: "Name of the financial institution or bank",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "bankAddress",
				semanticDescription: "Bank branch address or mailing address",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "statementDate",
				semanticDescription: "Statement date or statement period end date",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "statementPeriodStart",
				semanticDescription: "Statement period beginning date",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "statementPeriodEnd",
				semanticDescription: "Statement period ending date",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "openingBalance",
				semanticDescription: "Opening balance dollar amount at start of statement period (numeric value like 5,234.67, not currency symbol)",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "closingBalance",
				semanticDescription: "Closing balance dollar amount at end of statement period (numeric value like 3,456.78, not currency symbol)",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "currentBalance",
				semanticDescription: "Current account balance dollar amount (numeric value with decimals, not currency symbol)",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "totalDeposits",
				semanticDescription: "Total deposits dollar amount during statement period (numeric value like 1,250.00, not currency symbol)",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "totalWithdrawals",
				semanticDescription: "Total withdrawals dollar amount during statement period (numeric value like 2,100.50, not currency symbol)",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "currency",
				semanticDescription: "Currency type or currency code (USD, CAD, etc.)",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "accountType",
				semanticDescription: "Type of bank account - look for words like 'CHECKING', 'SAVINGS', 'Money Market' in headers or near 'Account Summary' (extract just the account type like 'Checking' or 'Savings')",
				format: "Text",
				validationMethod: null,
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
	{
		name: "Vehicle Bill of Sale",
		identifier: "vehicle_bill_of_sale",
		semanticDescription: "Vehicle purchase documentation with buyer, seller, and vehicle information",
		fields: [
			{
				name: "billOfSaleNumber",
				semanticDescription: "Bill of sale number or document reference number",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "saleDate",
				semanticDescription: "Date of vehicle sale or transaction date",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "sellerName",
				semanticDescription: "Name of the vehicle seller or dealer",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "sellerAddress",
				semanticDescription: "Address of the vehicle seller or dealership",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "sellerPhone",
				semanticDescription: "Phone number of the seller or dealership",
				format: "Text",
				validationMethod: "PhoneNumberIntegrity",
			},
			{
				name: "buyerName",
				semanticDescription: "Name of the vehicle buyer or purchaser",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "buyerAddress",
				semanticDescription: "Address of the vehicle buyer",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "buyerPhone",
				semanticDescription: "Phone number of the buyer",
				format: "Text",
				validationMethod: "PhoneNumberIntegrity",
			},
			{
				name: "vehicleYear",
				semanticDescription: "Year the vehicle was manufactured",
				format: "Number",
				validationMethod: "NumberIntegrity",
			},
			{
				name: "vehicleMake",
				semanticDescription: "Vehicle manufacturer or make (Honda, Toyota, Ford, etc.)",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "vehicleModel",
				semanticDescription: "Vehicle model name",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "vehicleTrim",
				semanticDescription: "Vehicle trim level or style",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "vehicleVin",
				semanticDescription: "Vehicle Identification Number (VIN)",
				format: "Text",
				validationMethod: "VehicleIdentificationNumberIntegrity",
			},
			{
				name: "vehicleMileage",
				semanticDescription: "Vehicle mileage or odometer reading",
				format: "Number",
				validationMethod: "NumberIntegrity",
			},
			{
				name: "vehicleColor",
				semanticDescription: "Vehicle color or paint color",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "vehicleEngine",
				semanticDescription: "Engine type or engine description",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "vehicleTransmission",
				semanticDescription: "Transmission type (automatic, manual, CVT)",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "vehicleCondition",
				semanticDescription: "Vehicle condition (new, used, excellent, good, fair)",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "salePrice",
				semanticDescription: "Total sale price of the vehicle (numeric dollar amount like 25,000.00, not currency symbol)",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "downPayment",
				semanticDescription: "Down payment amount (numeric dollar amount like 5,000.00, not currency symbol)",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "loanAmount",
				semanticDescription: "Loan amount or financed amount (numeric dollar amount like 20,000.00, not currency symbol)",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "paymentMethod",
				semanticDescription: "Method of payment (cash, financing, loan, etc.)",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "titleStatus",
				semanticDescription: "Title status (clean, salvage, lien, etc.)",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "warranty",
				semanticDescription: "Warranty information or warranty type",
				format: "Text",
				validationMethod: null,
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
			"Auto loan application package with identification, income verification, and vehicle documentation",
		documents: [
			{
				type: "Driver's License",
				description: "Government-issued identification",
			},
			{ type: "Pay Stub", description: "Recent income verification" },
			{ type: "Bank Statement", description: "Financial account information" },
			{ type: "Vehicle Bill of Sale", description: "Vehicle purchase documentation with pricing" },
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
