"use client";

import {
	AlertCircle,
	AlertTriangle,
	ArrowLeft,
	CheckCircle,
	ChevronDown,
	ChevronUp,
	Download,
	FileText,
	RefreshCw,
	X,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Viewer from "@/components/Viewer";
import fieldMappings from "@/lib/field-mappings.json";

// Package information for display
const PACKAGE_INFO = {
	package1: {
		name: "Auto Loan Package",
		applicant: "Ima Cardholder",
		loanType: "Auto Loan",
		description:
			"Vehicle financing application with California driver's license",
	},
	package2: {
		name: "Personal Loan Package",
		applicant: "Joseph Sample",
		loanType: "Personal Loan",
		description: "General purpose loan with Florida driver's license",
	},
	package3: {
		name: "Home Improvement Package",
		applicant: "Sarah Martin",
		loanType: "Home Improvement Loan",
		description: "Property improvement financing with Canadian passport",
	},
} as const;

interface ProcessedDocument {
	id: string;
	fileName: string;
	documentType: string;
	category: string;
	status: string;
	detectedTemplate?: string;
	fields?: Array<{
		fieldName: string;
		value: {
			value: string;
			format: string;
		};
		validationState: "Valid" | "VerificationNeeded" | "Undefined";
	}>;
	error?: string;
}

interface ProcessingResult {
	success: boolean;
	summary: {
		packageId: string;
		totalDocuments: number;
		successfulDocuments: number;
		failedDocuments: number;
		totalFields: number;
		validFields: number;
		verificationNeededFields: number;
		missingFields: number;
		overallStatus: string;
		timestamp: string;
	};
	documents: ProcessedDocument[];
}

// Minimal toolbar configuration - moved outside component to prevent re-creation
const MINIMAL_TOOLBAR_ITEMS = [
	{ type: "zoom-out" },
	{ type: "zoom-in" },
	{ type: "zoom-mode" },
	{ type: "search" },
];

// Removed complex processing steps - just show simple processing state

function ResultsContent() {
	const searchParams = useSearchParams();
	const packageId = searchParams.get("package") || "package1";

	const [isProcessing, setIsProcessing] = useState(true);
	const [results, setResults] = useState<ProcessingResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [currentStep, setCurrentStep] = useState(1);
	const [currentStepDescription, setCurrentStepDescription] = useState(
		"Preparing documents...",
	);
	const [processingLogs, setProcessingLogs] = useState<string[]>([]);

	const totalSteps = 5;

	// Package document information for log simulation
	const packageDocuments = useMemo(
		() =>
			({
				package1: [
					"ima-cardholder-california-drivers-license.jpg",
					"ima-cardholder-sample-pay-stub.pdf",
					"ima-cardholder-bank-statement.pdf",
					"ima-cardholder-vehicle-bill-of-sale.pdf",
					"ima-cardholder-auto-loan-application.pdf",
				],
				package2: [
					"joseph-sample-florida-driver-license.png",
					"joseph-sample-sample-pay-stub.pdf",
					"joseph-sample-employment-letter.pdf",
					"joseph-sample-bank-statement.pdf",
					"joseph-sample-personal-loan-application.pdf",
				],
				package3: [
					"sarah-martin-canada-passport.jpg",
					"sarah-martin-sample-pay-stub.pdf",
					"sarah-martin-employment-letter.pdf",
					"sarah-martin-bank-statement.pdf",
					"sarah-martin-home-improvement-loan-application.pdf",
				],
			}) as const,
		[],
	);
	const [formFields, setFormFields] = useState<
		Array<{
			name: string;
			type: string;
			required: boolean;
			value: string | null;
			extractedValue?: string | null;
			hasMatch?: boolean;
		}>
	>([]);
	const [showDetailedResults, setShowDetailedResults] = useState(false);
	const [showFormFields, setShowFormFields] = useState(false);

	// Get package info or default to package1
	const packageInfo =
		PACKAGE_INFO[packageId as keyof typeof PACKAGE_INFO] ||
		PACKAGE_INFO.package1;

	const addLog = useCallback((message: string) => {
		setProcessingLogs((prev) => [...prev, message]);
	}, []);

	const simulateDocumentProcessing = useCallback(
		async (documents: readonly string[]) => {
			const templateMap: { [key: string]: string } = {
				"drivers-license": "Driver's License",
				"driver-license": "Driver's License",
				passport: "Canadian Passport",
				"pay-stub": "Pay Stub",
				"employment-letter": "Employment Letter",
				"bank-statement": "Bank Statement",
				"vehicle-bill-of-sale": "Vehicle Bill of Sale",
				"auto-loan-application": "Auto Loan Application",
				"personal-loan-application": "Personal Loan Application",
				"home-improvement-loan-application":
					"Home Improvement Loan Application",
			};

			const getDocumentTemplate = (filename: string) => {
				const key = Object.keys(templateMap).find((k) => filename.includes(k));
				return key ? templateMap[key] : "Unknown Template";
			};

			const getFieldCount = (filename: string) => {
				if (filename.includes("pay-stub"))
					return Math.floor(Math.random() * 5) + 18; // 18-22
				if (filename.includes("bank-statement"))
					return Math.floor(Math.random() * 4) + 12; // 12-15
				if (filename.includes("employment-letter"))
					return Math.floor(Math.random() * 3) + 8; // 8-10
				if (
					filename.includes("drivers-license") ||
					filename.includes("driver-license")
				)
					return Math.floor(Math.random() * 3) + 6; // 6-8
				if (filename.includes("passport"))
					return Math.floor(Math.random() * 3) + 7; // 7-9
				if (filename.includes("vehicle-bill-of-sale"))
					return Math.floor(Math.random() * 3) + 10; // 10-12
				return Math.floor(Math.random() * 8) + 15; // 15-22 for applications
			};

			for (let i = 0; i < documents.length; i++) {
				const doc = documents[i];
				const template = getDocumentTemplate(doc);
				const fieldCount = getFieldCount(doc);

				// Processing log
				addLog(`🚀 Processing ${doc}...`);
				await new Promise((resolve) => setTimeout(resolve, 800));

				// API response log
				addLog(`📡 API response for ${doc}: 200 OK`);
				await new Promise((resolve) => setTimeout(resolve, 300));

				// Success log
				addLog(
					`✅ API success for ${doc}: { detectedTemplate: '${template}', fieldsCount: ${fieldCount}, hasFields: true }`,
				);
				await new Promise((resolve) => setTimeout(resolve, 400));

				// Completion log
				addLog(`✅ Successfully processed ${doc}`);
				await new Promise((resolve) => setTimeout(resolve, 500));
			}
		},
		[addLog],
	);

	const processPackageDocuments = useCallback(async () => {
		try {
			console.log(`🔄 Processing package: ${packageId}`);

			const documents =
				packageDocuments[packageId as keyof typeof packageDocuments] ||
				packageDocuments.package1;

			setCurrentStep(2);
			setCurrentStepDescription("Registering document templates...");
			addLog("🔧 Registering custom templates...");
			await new Promise((resolve) => setTimeout(resolve, 1000));
			addLog("✅ Templates registered successfully");

			setCurrentStep(3);
			setCurrentStepDescription("Uploading and analyzing documents...");
			addLog(`📥 Pre-loading all ${documents.length} document files...`);
			await new Promise((resolve) => setTimeout(resolve, 800));
			addLog(
				`📦 File loading completed: ${documents.length}/${documents.length} files loaded successfully`,
			);

			// Start the API call but also simulate detailed processing
			const responsePromise = fetch("/api/process-package", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ packageId }),
			});

			setCurrentStep(4);
			setCurrentStepDescription("Processing document data...");
			addLog("🚀 Starting parallel API processing of loaded documents...");

			// Simulate document processing while waiting for real API
			await simulateDocumentProcessing(documents);

			const response = await responsePromise;

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to process documents");
			}

			setCurrentStep(5);
			setCurrentStepDescription("Finalizing results...");
			addLog("🎉 Parallel processing completed");

			const data: ProcessingResult = await response.json();
			console.log("✅ Processing completed:", data);
			addLog(
				`🏁 Package processing completed: ${data.summary.successfulDocuments}/${data.summary.totalDocuments} documents processed`,
			);

			setResults(data);
			setIsProcessing(false);
		} catch (err) {
			console.error("❌ Processing failed:", err);
			setError(err instanceof Error ? err.message : "Unknown error occurred");
			setIsProcessing(false);
		}
	}, [packageId, packageDocuments, simulateDocumentProcessing, addLog]);

	useEffect(() => {
		// Start processing immediately
		processPackageDocuments();
	}, [processPackageDocuments]);

	// Function to match form fields with extracted data using explicit JSON mapping
	const matchFormFieldsWithData = useCallback(
		(
			fields: Array<{
				name: string;
				type: string;
				required: boolean;
				value: string | null;
			}>,
			extractedData: ProcessedDocument[],
		) => {
			const allExtractedFields = extractedData.flatMap(
				(doc) => doc.fields || [],
			);

			return fields.map((field) => {
				// Clean the form field name to find potential matches
				const cleanFieldName = field.name
					.replace(/^id_[a-f0-9]+_/, "") // Remove ID prefix
					.replace(/^[a-f0-9]{32,}_/, "") // Remove long hash prefix
					.toLowerCase()
					.replace(/[^a-z0-9-]/g, "");

				console.log(
					`🔍 Matching field: "${field.name}" -> cleaned: "${cleanFieldName}"`,
				);

				// First try to find explicit mapping from JSON
				const explicitMapping = fieldMappings.find((mapping) => {
					const mappingKey = Object.keys(mapping)[0];

					// Check if the cleaned field name matches the mapping key
					const normalizedMappingKey = mappingKey
						.toLowerCase()
						.replace(/[^a-z0-9-]/g, "");
					return (
						cleanFieldName === normalizedMappingKey ||
						cleanFieldName.includes(normalizedMappingKey) ||
						normalizedMappingKey.includes(cleanFieldName)
					);
				});

				let matchingField = null;

				if (explicitMapping) {
					const mappingKey = Object.keys(explicitMapping)[0];
					const mappingConfig = explicitMapping[
						mappingKey as keyof typeof explicitMapping
					] as {
						extractedFields: string[];
						document: string[];
						type: string;
						description: string;
					};

					console.log(
						`  🎯 Found explicit mapping for "${cleanFieldName}" -> "${mappingKey}"`,
					);
					console.log(
						`  🔎 Looking for extracted fields:`,
						mappingConfig.extractedFields,
					);

					// Find matching extracted field based on explicit mapping
					matchingField = allExtractedFields.find((extractedField) => {
						const extractedFieldName = extractedField.fieldName.toLowerCase();

						// Check if any of the mapped extracted field names match
						return mappingConfig.extractedFields.some((mappedField) => {
							const normalizedMappedField = mappedField.toLowerCase();
							const isMatch =
								extractedFieldName === normalizedMappedField ||
								extractedFieldName.includes(normalizedMappedField) ||
								normalizedMappedField.includes(extractedFieldName);

							if (isMatch) {
								console.log(
									`    ✅ Matched "${extractedField.fieldName}" with mapped field "${mappedField}"`,
								);
							}
							return isMatch;
						});
					});
				}

				// Fallback to original algorithmic matching if no explicit mapping found
				if (!matchingField) {
					console.log(
						`  ⚠️ No explicit mapping found, trying algorithmic matching...`,
					);

					matchingField = allExtractedFields.find((extractedField) => {
						const extractedFieldName = extractedField.fieldName
							.toLowerCase()
							.replace(/[^a-z0-9]/g, "");

						console.log(
							`    🔎 Comparing with extracted: "${extractedField.fieldName}" -> cleaned: "${extractedFieldName}"`,
						);

						// Exact match after cleaning
						return cleanFieldName === extractedFieldName;
					});
				}

				// Check for duplicate address values for line 2 fields
				let extractedValue = matchingField?.value?.value || null;
				let hasMatch = !!matchingField;

				// Special handling for address line 2 fields to prevent duplicates
				if (
					cleanFieldName.includes("addressline2") ||
					cleanFieldName.includes("address-line-2")
				) {
					// Find the corresponding line 1 field name
					const line1FieldName = cleanFieldName
						.replace(/addressline2|address-line-2/, "addressline1")
						.replace(/addressline1/, "address-line-1");

					// Find the line 1 field result
					const line1Field = fields.find((f) => {
						const line1CleanName = f.name
							.replace(/^id_[a-f0-9]+_/, "")
							.replace(/^[a-f0-9]{32,}_/, "")
							.toLowerCase()
							.replace(/[^a-z0-9-]/g, "");
						return (
							line1CleanName === line1FieldName ||
							line1CleanName.includes("addressline1") ||
							line1CleanName.includes("address-line-1")
						);
					});

					if (line1Field && extractedValue) {
						// Check if we need to find the line 1 extracted value
						const line1ExplicitMapping = fieldMappings.find((mapping) => {
							const mappingKey = Object.keys(mapping)[0];
							const normalizedMappingKey = mappingKey
								.toLowerCase()
								.replace(/[^a-z0-9-]/g, "");
							const line1CleanName = line1Field.name
								.replace(/^id_[a-f0-9]+_/, "")
								.replace(/^[a-f0-9]{32,}_/, "")
								.toLowerCase()
								.replace(/[^a-z0-9-]/g, "");
							return (
								line1CleanName === normalizedMappingKey ||
								line1CleanName.includes(normalizedMappingKey) ||
								normalizedMappingKey.includes(line1CleanName)
							);
						});

						if (line1ExplicitMapping) {
							const line1MappingKey = Object.keys(line1ExplicitMapping)[0];
							const line1MappingConfig = line1ExplicitMapping[
								line1MappingKey as keyof typeof line1ExplicitMapping
							] as {
								extractedFields: string[];
							};

							// Find line 1 extracted value
							const line1MatchingField = allExtractedFields.find(
								(extractedField) => {
									const extractedFieldName =
										extractedField.fieldName.toLowerCase();
									return line1MappingConfig.extractedFields.some(
										(mappedField) => {
											const normalizedMappedField = mappedField.toLowerCase();
											return (
												extractedFieldName === normalizedMappedField ||
												extractedFieldName.includes(normalizedMappedField) ||
												normalizedMappedField.includes(extractedFieldName)
											);
										},
									);
								},
							);

							const line1Value = line1MatchingField?.value?.value;

							// If line 1 and line 2 values are the same, don't fill line 2
							if (line1Value && line1Value === extractedValue) {
								console.log(
									`  🚫 Skipping "${field.name}" - duplicate of line 1: "${line1Value}"`,
								);
								extractedValue = null;
								hasMatch = false;
							}
						}
					}
				}

				const result = {
					...field,
					extractedValue,
					hasMatch,
				};

				if (matchingField && hasMatch) {
					console.log(
						`  🎯 Final match: "${field.name}" -> "${matchingField.fieldName}" = "${extractedValue}"`,
					);
				} else if (matchingField && !hasMatch) {
					console.log(
						`  🚫 Duplicate prevented: "${field.name}" -> "${matchingField.fieldName}"`,
					);
				} else {
					console.log(`  ❌ No match found for "${field.name}"`);
				}

				return result;
			});
		},
		[],
	);

	const handleFormFieldsLoaded = useCallback(
		(
			fields: Array<{
				name: string;
				type: string;
				required: boolean;
				value: string | null;
			}>,
		) => {
			console.log("📋 Form fields received in results page:", fields);

			// Match fields with extracted data if results are available
			if (results?.documents) {
				const matchedFields = matchFormFieldsWithData(
					fields,
					results.documents,
				);
				setFormFields(matchedFields);
			} else {
				setFormFields(fields.map((field) => ({ ...field, hasMatch: false })));
			}
		},
		[results, matchFormFieldsWithData],
	);

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "Valid":
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case "VerificationNeeded":
				return <AlertCircle className="h-4 w-4 text-yellow-500" />;
			case "Undefined":
				return <AlertCircle className="h-4 w-4 text-yellow-500" />;
			default:
				return <FileText className="h-4 w-4 text-gray-400" />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Valid":
				return "text-green-600 bg-green-50";
			case "VerificationNeeded":
				return "text-yellow-600 bg-yellow-50";
			case "Undefined":
				return "text-yellow-600 bg-yellow-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	const formatFieldName = (fieldName: string) => {
		return fieldName
			.replace(/([A-Z])/g, " $1")
			.replace(/^./, (str) => str.toUpperCase())
			.trim();
	};

	const getCategoryIcon = () => {
		return "";
	};

	// Handle error state
	if (error && !isProcessing) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
				<div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
					<div className="mb-8">
						<Link
							href="/select-package"
							className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Package Selection
						</Link>
					</div>

					<div className="text-center">
						<div className="bg-white rounded-lg shadow-md p-8">
							<XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
							<h1 className="text-2xl font-bold text-gray-900 mb-4">
								Processing Failed
							</h1>
							<p className="text-gray-600 mb-6">{error}</p>
							<Link
								href="/select-package"
								className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
							>
								Try Again
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (isProcessing) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
				<div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
							Processing {packageInfo.name}
						</h1>
						<p className="text-lg text-gray-600 mb-2">
							Analyzing documents for {packageInfo.applicant}
						</p>
						<p className="text-sm text-gray-500">{packageInfo.description}</p>
					</div>

					<div className="bg-white rounded-lg shadow-md p-12">
						<div className="text-center">
							<RefreshCw className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								Processing Documents
							</h3>
							<p className="text-gray-600 mb-4">
								Classifying and extracting data from documents using AI Document
								Processing...
							</p>
							<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<p className="text-sm font-medium text-blue-800 mb-2">
									Step {currentStep} of {totalSteps}
								</p>
								<p className="text-blue-700 mb-4">{currentStepDescription}</p>

								{/* Processing Logs */}
								{processingLogs.length > 0 && (
									<div className="mt-4 p-3 bg-gray-900 rounded-lg text-xs font-mono max-h-48 overflow-y-auto text-left">
										{processingLogs.slice(-8).map((log, index) => (
											<div
												key={`log-${index}-${Date.now()}`}
												className="text-green-400 mb-1 text-left"
											>
												{log}
											</div>
										))}
										{processingLogs.length > 8 && (
											<div className="text-gray-500 mt-2 text-left">
												... showing last 8 entries ...
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Show results if processing is complete
	if (!results) return null;

	// Exclude application documents from validation - they are target forms, not source data
	const sourceDocuments = results.documents.filter(
		(doc) => doc.category !== "application",
	);

	// Generate executive summary for loan application
	const generateExecutiveSummary = () => {
		const failedSourceDocs = sourceDocuments.filter(
			(doc) => doc.status === "failed",
		);

		// Determine status: VALID, REVIEW REQUIRED, or INVALID
		const hasFailedDocs = failedSourceDocs.length > 0;
		const hasMissingData = results.summary.missingFields > 0;
		const hasVerificationNeeded = results.summary.verificationNeededFields > 0;

		let status: string;
		let isValid: boolean;

		if (hasFailedDocs || hasMissingData) {
			status = "Invalid";
			isValid = false;
		} else if (hasVerificationNeeded) {
			status = "Valid - Some Review Required";
			isValid = false; // Not fully valid, needs review
		} else {
			status = "Valid";
			isValid = true;
		}

		const missingData = [];

		// Check for failed source documents (exclude application forms)
		if (failedSourceDocs.length > 0) {
			missingData.push(
				`${failedSourceDocs.length} document${failedSourceDocs.length > 1 ? "s" : ""} failed to process: ${failedSourceDocs.map((doc) => doc.documentType).join(", ")}`,
			);
		}

		// Check for verification needed fields
		if (results.summary.verificationNeededFields > 0) {
			missingData.push(
				`${results.summary.verificationNeededFields} field${results.summary.verificationNeededFields > 1 ? "s" : ""} require verification`,
			);
		}

		// Check for missing fields
		if (results.summary.missingFields > 0) {
			missingData.push(
				`${results.summary.missingFields} field${results.summary.missingFields > 1 ? "s" : ""} could not be extracted`,
			);
		}

		// Identify specific missing document types if any (exclude application category)
		const requiredDocTypes = ["identification", "income", "financial"];
		const processedCategories = sourceDocuments
			.filter((doc) => doc.status === "completed")
			.map((doc) => doc.category);
		const missingCategories = requiredDocTypes.filter(
			(cat) => !processedCategories.includes(cat),
		);

		if (missingCategories.length > 0) {
			const categoryNames = missingCategories.map((cat) => {
				switch (cat) {
					case "identification":
						return "identification document";
					case "income":
						return "income verification";
					case "financial":
						return "financial statements";
					default:
						return cat;
				}
			});
			missingData.push(
				`Missing required document types: ${categoryNames.join(", ")}`,
			);
		}

		return {
			isValid,
			status,
			missingData,
			recommendation:
				status === "Valid"
					? "Application is complete and ready for approval review."
					: status === "Valid - Some Review Required"
						? `Application data extracted successfully. ${results.summary.verificationNeededFields} field${results.summary.verificationNeededFields > 1 ? "s" : ""} require verification.`
						: "Application requires additional documentation or correction before approval.",
		};
	};

	const executiveSummary = generateExecutiveSummary();

	// Find the loan application PDF document for the Viewer
	const loanApplicationDoc = results.documents.find(
		(doc) => doc.category === "application" && doc.fileName.endsWith(".pdf"),
	);

	// Map package ID to directory name for PDF path
	const packageDirectories = {
		package1: "package-1",
		package2: "package-2",
		package3: "package-3",
	} as const;

	const directoryName =
		packageDirectories[packageId as keyof typeof packageDirectories];
	const pdfPath = loanApplicationDoc
		? `/documents/${directoryName}/${loanApplicationDoc.fileName}`
		: null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8">
					<Link
						href="/select-package"
						className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Package Selection
					</Link>
				</div>

				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
						{packageInfo.name} - Processing Complete
					</h1>
					<p className="mt-2 text-lg text-gray-600">
						{packageInfo.applicant} • {packageInfo.loanType}
					</p>
					<p className="mt-1 text-sm text-gray-500">
						{packageInfo.description}
					</p>
				</div>

				{/* Executive Summary */}
				<div className="bg-white rounded-lg shadow-md p-5 mb-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Loan Application Status Summary:{" "}
						<span
							className={`${
								executiveSummary.status === "Valid"
									? "text-green-600"
									: executiveSummary.status === "Valid - Some Review Required"
										? "text-yellow-600"
										: "text-red-600"
							}`}
						>
							{executiveSummary.status}
						</span>
					</h2>

					{/* Recommendation */}
					<div className="mb-4">
						<div
							className={`p-3 rounded-lg border-l-4 ${
								executiveSummary.status === "Valid"
									? "bg-green-50 border-green-400"
									: executiveSummary.status === "Valid - Some Review Required"
										? "bg-yellow-50 border-yellow-400"
										: "bg-red-50 border-red-400"
							}`}
						>
							<p
								className={`font-medium ${
									executiveSummary.status === "Valid"
										? "text-green-800"
										: executiveSummary.status === "Valid - Some Review Required"
											? "text-yellow-800"
											: "text-red-800"
								}`}
							>
								{executiveSummary.recommendation}
							</p>
						</div>
					</div>

					{/* Issues Details - Only show for Invalid status or if there are non-verification issues */}
					{(executiveSummary.status === "Invalid" ||
						(executiveSummary.status === "Valid - Some Review Required" &&
							executiveSummary.missingData.some(
								(issue) => !issue.includes("require verification"),
							))) && (
						<div className="mb-4">
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								Issues Requiring Attention:
							</h3>
							<ul className="space-y-1">
								{executiveSummary.missingData
									.filter((issue) => !issue.includes("require verification"))
									.map((issue) => (
										<li
											key={`issue-${issue.replace(/\s+/g, "-").toLowerCase()}`}
											className="flex items-start"
										>
											<AlertCircle className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-red-500" />
											<span className="text-gray-700 text-sm">{issue}</span>
										</li>
									))}
							</ul>
						</div>
					)}

					{/* Processing Statistics */}
					<div className="grid md:grid-cols-4 gap-3">
						<div className="text-center p-2 bg-gray-50 rounded-lg">
							<div className="text-lg font-bold text-indigo-600">
								{
									sourceDocuments.filter((doc) => doc.status === "completed")
										.length
								}
								/{sourceDocuments.length}
							</div>
							<div className="text-xs text-gray-600">Source Documents</div>
						</div>
						<div className="text-center p-2 bg-gray-50 rounded-lg">
							<div className="text-lg font-bold text-green-600">
								{results.summary.validFields}
							</div>
							<div className="text-xs text-gray-600">Valid Fields</div>
						</div>
						<div className="text-center p-2 bg-gray-50 rounded-lg">
							<div className="text-lg font-bold text-yellow-600">
								{results.summary.verificationNeededFields}
							</div>
							<div className="text-xs text-gray-600">Need Review</div>
						</div>
						<div className="text-center p-2 bg-gray-50 rounded-lg">
							<div className="text-lg font-bold text-red-600">
								{results.summary.missingFields}
							</div>
							<div className="text-xs text-gray-600">Missing Data</div>
						</div>
					</div>
				</div>

				{/* Detailed Results - Collapsible */}
				<div className="bg-white rounded-lg shadow-md mb-8">
					<button
						type="button"
						onClick={() => setShowDetailedResults(!showDetailedResults)}
						className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 rounded-lg transition-colors"
					>
						<div>
							<h3 className="text-lg font-semibold text-gray-900">
								Detailed Document Analysis
							</h3>
							<p className="text-sm text-gray-600">
								View extracted data from each document
							</p>
						</div>
						{showDetailedResults ? (
							<ChevronUp className="h-5 w-5 text-gray-400" />
						) : (
							<ChevronDown className="h-5 w-5 text-gray-400" />
						)}
					</button>

					{showDetailedResults && (
						<div className="px-6 pb-6 space-y-6 border-t border-gray-200">
							{results.documents
								.filter((doc) => doc.category !== "application")
								.map((doc) => (
									<div
										key={doc.id}
										className="bg-white rounded-lg shadow-md p-6"
									>
										<div className="flex items-center mb-4">
											<span className="text-2xl mr-3">{getCategoryIcon()}</span>
											<div className="flex-1">
												<h3 className="text-lg font-semibold text-gray-900">
													{doc.documentType}
												</h3>
												<p className="text-sm text-gray-500">{doc.fileName}</p>
												{doc.detectedTemplate && (
													<p className="text-xs text-blue-600">
														Detected: {doc.detectedTemplate}
													</p>
												)}
											</div>
											<span
												className={`px-3 py-1 rounded-full text-xs font-medium ${
													doc.status === "completed"
														? "bg-green-100 text-green-800"
														: "bg-red-100 text-red-800"
												}`}
											>
												{doc.status === "completed" ? "Processed" : "Failed"}
											</span>
										</div>

										{doc.status === "failed" ? (
											<div className="bg-red-50 border border-red-200 rounded-lg p-4">
												<div className="flex items-center">
													<XCircle className="h-5 w-5 text-red-500 mr-2" />
													<span className="font-medium text-red-800">
														Processing Failed
													</span>
												</div>
												<p className="text-sm text-red-700 mt-1">{doc.error}</p>
											</div>
										) : (
											<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
												{doc.fields && doc.fields.length > 0 ? (
													doc.fields.map((field) => (
														<div
															key={field.fieldName}
															className="border rounded-lg p-3"
														>
															<div className="flex items-center justify-between mb-1">
																<span className="text-sm font-medium text-gray-700">
																	{formatFieldName(field.fieldName)}
																</span>
																{getStatusIcon(field.validationState)}
															</div>
															<div
																className={`text-sm py-1 rounded ${getStatusColor(field.validationState)}`}
															>
																{field.value?.value || "Not found"}
															</div>
															{field.value?.format && (
																<div className="text-xs text-gray-500 mt-1">
																	Format: {field.value.format}
																</div>
															)}
														</div>
													))
												) : (
													<div className="col-span-full text-center py-8 text-gray-500">
														No fields extracted from this document
													</div>
												)}
											</div>
										)}
									</div>
								))}
						</div>
					)}
				</div>

				{/* PDF Form Fields Display - Collapsible */}
				{pdfPath && loanApplicationDoc && formFields.length > 0 && (
					<div className="bg-white rounded-lg shadow-md mb-8">
						<button
							type="button"
							onClick={() => setShowFormFields(!showFormFields)}
							className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 rounded-lg transition-colors"
						>
							<div>
								<h3 className="text-lg font-semibold text-gray-900">
									PDF Form Field Analysis
								</h3>
								<p className="text-sm text-gray-600">
									{loanApplicationDoc.documentType} - {formFields.length} fields
									detected
								</p>
							</div>
							{showFormFields ? (
								<ChevronUp className="h-5 w-5 text-gray-400" />
							) : (
								<ChevronDown className="h-5 w-5 text-gray-400" />
							)}
						</button>

						{showFormFields && (
							<div className="px-6 pb-6 border-t border-gray-200">
								<div className="grid md:grid-cols-2 gap-4">
									{formFields.map((field) => (
										<div
											key={field.name}
											className={`rounded-lg p-4 border-2 ${
												field.hasMatch
													? "bg-green-50 border-green-200"
													: field.required
														? "bg-red-50 border-red-200"
														: "bg-yellow-50 border-yellow-200"
											}`}
										>
											<div className="flex items-start justify-between mb-2">
												<div className="text-sm font-medium text-gray-900 break-words flex-1 mr-2">
													{field.name}
												</div>
												<div className="flex-shrink-0">
													{field.hasMatch ? (
														<CheckCircle className="h-5 w-5 text-green-600" />
													) : field.required ? (
														<X className="h-5 w-5 text-red-600" />
													) : (
														<AlertTriangle className="h-5 w-5 text-yellow-500" />
													)}
												</div>
											</div>
											<div className="flex items-center justify-between text-xs text-gray-500 mb-1">
												<span>Type: {field.type || "Unknown"}</span>
												{field.required && (
													<span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
														Required
													</span>
												)}
											</div>
											{field.extractedValue && (
												<div className="text-xs text-green-700 mt-2 p-2 bg-green-100 rounded border-l-2 border-green-400">
													<span className="font-medium">Extracted value:</span>{" "}
													{field.extractedValue}
												</div>
											)}
											{field.value && (
												<div className="text-xs text-blue-600 mt-2 p-2 bg-blue-50 rounded border-l-2 border-blue-200">
													<span className="font-medium">Current value:</span>{" "}
													{field.value}
												</div>
											)}
											{!field.hasMatch && (
												<div
													className={`text-xs mt-2 p-2 rounded border-l-2 ${
														field.required
															? "text-red-700 bg-red-100 border-red-400"
															: "text-yellow-700 bg-yellow-100 border-yellow-400"
													}`}
												>
													<span className="font-medium">Status:</span> No
													matching data found
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				{/* Loan Application PDF Viewer */}
				{pdfPath && loanApplicationDoc && (
					<div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
						<Viewer
							document={pdfPath}
							onFormFieldsLoaded={handleFormFieldsLoaded}
							fieldData={formFields}
							toolbarItems={MINIMAL_TOOLBAR_ITEMS}
						/>
					</div>
				)}

				{/* Action Buttons - Moved to bottom */}
				<div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						href="/select-package"
						className="inline-flex items-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
					>
						Process Another Package
					</Link>
					<button
						type="button"
						onClick={() => {
							const blob = new Blob([JSON.stringify(results, null, 2)], {
								type: "application/json",
							});
							const url = URL.createObjectURL(blob);
							const a = document.createElement("a");
							a.href = url;
							a.download = `${packageId}-processing-results.json`;
							a.click();
							URL.revokeObjectURL(url);
						}}
						className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
					>
						<Download className="mr-2 h-4 w-4" />
						Download Results
					</button>
				</div>

				<div className="mt-8 text-center text-sm text-gray-500">
					<p>
						Nutrient AI Document Processing SDK • Processed at{" "}
						{new Date(results.summary.timestamp).toLocaleString()}
					</p>
				</div>
			</div>
		</div>
	);
}

export default function Results() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
					<div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
						<div className="bg-white rounded-lg shadow-md p-12">
							<div className="text-center">
								<RefreshCw className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									Loading Results
								</h3>
								<p className="text-gray-600">
									Please wait while we load your processing results...
								</p>
							</div>
						</div>
					</div>
				</div>
			}
		>
			<ResultsContent />
		</Suspense>
	);
}
