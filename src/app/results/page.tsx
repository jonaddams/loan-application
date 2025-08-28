"use client";

import {
	AlertCircle,
	ArrowLeft,
	CheckCircle,
	Download,
	FileText,
	RefreshCw,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import Viewer from "@/components/Viewer";

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

// Removed complex processing steps - just show simple processing state

function ResultsContent() {
	const searchParams = useSearchParams();
	const packageId = searchParams.get("package") || "package1";

	const [isProcessing, setIsProcessing] = useState(true);
	const [results, setResults] = useState<ProcessingResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [formFields, setFormFields] = useState<
		Array<{
			name: string;
			type: string;
			required: boolean;
			value: string | null;
		}>
	>([]);

	// Get package info or default to package1
	const packageInfo =
		PACKAGE_INFO[packageId as keyof typeof PACKAGE_INFO] ||
		PACKAGE_INFO.package1;

	const processPackageDocuments = useCallback(async () => {
		try {
			console.log(`🔄 Processing package: ${packageId}`);

			const response = await fetch("/api/process-package", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ packageId }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to process documents");
			}

			const data: ProcessingResult = await response.json();
			console.log("✅ Processing completed:", data);

			setResults(data);
			setIsProcessing(false);
		} catch (err) {
			console.error("❌ Processing failed:", err);
			setError(err instanceof Error ? err.message : "Unknown error occurred");
			setIsProcessing(false);
		}
	}, [packageId]);

	useEffect(() => {
		// Start processing immediately
		processPackageDocuments();
	}, [processPackageDocuments]);

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
			setFormFields(fields);
		},
		[],
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
							<p className="text-gray-600">
								Classifying and extracting data from documents using AI Document
								Processing...
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Show results if processing is complete
	if (!results) return null;

	const getOverallStatus = () => {
		if (results.summary.failedDocuments > 0) {
			return {
				status: "error",
				message: "Some documents failed to process",
				color: "red",
			};
		}
		if (results.summary.missingFields > 0) {
			return {
				status: "incomplete",
				message: "Some data could not be extracted",
				color: "red",
			};
		}
		if (results.summary.verificationNeededFields > 0) {
			return {
				status: "review",
				message: "Review required for some fields (unable to validate data)",
				color: "yellow",
			};
		}
		if (results.summary.validFields === results.summary.totalFields) {
			return {
				status: "complete",
				message: "All documents processed successfully",
				color: "green",
			};
		}
		return {
			status: "partial",
			message: "Processing completed",
			color: "yellow",
		};
	};

	const overallStatus = getOverallStatus();

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

				{/* Summary Card */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Processing Summary
					</h2>
					<div className="grid md:grid-cols-4 gap-4 mb-6">
						<div className="text-center">
							<div className="text-2xl font-bold text-indigo-600">
								{results.summary.successfulDocuments}/
								{results.summary.totalDocuments}
							</div>
							<div className="text-sm text-gray-600">Documents Processed</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">
								{results.summary.validFields}
							</div>
							<div className="text-sm text-gray-600">Valid Fields</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-yellow-600">
								{results.summary.verificationNeededFields}
							</div>
							<div className="text-sm text-gray-600">Need Review</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-red-600">
								{results.summary.missingFields}
							</div>
							<div className="text-sm text-gray-600">Missing Data</div>
						</div>
					</div>

					<div
						className={`p-4 rounded-lg ${
							overallStatus.color === "green"
								? "bg-green-50"
								: overallStatus.color === "yellow"
									? "bg-yellow-50"
									: overallStatus.color === "red"
										? "bg-red-50"
										: "bg-gray-50"
						}`}
					>
						<div className="flex items-center">
							{overallStatus.status === "complete" && (
								<CheckCircle className="h-5 w-5 text-green-600 mr-2" />
							)}
							{overallStatus.status === "review" && (
								<AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
							)}
							{overallStatus.status === "error" && (
								<XCircle className="h-5 w-5 text-red-600 mr-2" />
							)}
							{overallStatus.status === "partial" && (
								<AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
							)}
							<span
								className={`font-medium ${
									overallStatus.color === "green"
										? "text-green-800"
										: overallStatus.color === "yellow"
											? "text-yellow-900"
											: overallStatus.color === "red"
												? "text-red-800"
												: "text-gray-800"
								}`}
							>
								Status: {overallStatus.message}
							</span>
						</div>
					</div>
				</div>

				{/* Detailed Results */}
				<div className="space-y-6">
					{results.documents
						.filter((doc) => doc.category !== "application")
						.map((doc) => (
							<div key={doc.id} className="bg-white rounded-lg shadow-md p-6">
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

				{/* PDF Form Fields Display */}
				{pdfPath && loanApplicationDoc && formFields.length > 0 && (
					<div className="mt-12 bg-white rounded-lg shadow-md p-6">
						<div className="mb-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-1">
								{loanApplicationDoc.documentType}
							</h2>
							<p className="text-sm text-gray-600 mb-3">
								{loanApplicationDoc.fileName}
							</p>
							<h3 className="text-lg font-medium text-gray-900">
								Available Form Fields ({formFields.length})
							</h3>
						</div>
						<div className="grid md:grid-cols-2 gap-4">
							{formFields.map((field) => (
								<div
									key={field.name}
									className="bg-gray-50 rounded-lg p-4 border border-gray-200"
								>
									<div className="text-sm font-medium text-gray-900 mb-2 break-words">
										{field.name}
									</div>
									<div className="flex items-center justify-between text-xs text-gray-500 mb-1">
										<span>Type: {field.type || "Unknown"}</span>
										{field.required && (
											<span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
												Required
											</span>
										)}
									</div>
									{field.value && (
										<div className="text-xs text-blue-600 mt-2 p-2 bg-blue-50 rounded border-l-2 border-blue-200">
											<span className="font-medium">Current value:</span>{" "}
											{field.value}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				)}

				{/* Loan Application PDF Viewer */}
				{pdfPath && loanApplicationDoc && (
					<div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
						<div className="p-4 border-b bg-gray-50">
							<p className="text-sm text-gray-600">
								Review and complete the loan application with extracted data
							</p>
						</div>
						<Viewer
							document={pdfPath}
							onFormFieldsLoaded={handleFormFieldsLoaded}
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
