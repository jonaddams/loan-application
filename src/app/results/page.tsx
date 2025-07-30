"use client";

import {
	AlertCircle,
	ArrowLeft,
	CheckCircle,
	FileText,
	RefreshCw,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const mockResults = {
	summary: {
		totalDocuments: 5,
		processedDocuments: 5,
		validFields: 12,
		invalidFields: 2,
		missingFields: 1,
		overallStatus: "needs_review",
	},
	documents: [
		{
			id: "1",
			type: "Driver's License",
			status: "completed",
			fields: [
				{ name: "fullName", value: "John Smith", status: "valid" },
				{ name: "dateOfBirth", value: "1985-03-15", status: "valid" },
				{
					name: "address",
					value: "123 Main St, Anytown, ST 12345",
					status: "verification_needed",
				},
			],
		},
		{
			id: "2",
			type: "Pay Stub",
			status: "completed",
			fields: [
				{ name: "employer", value: "Tech Solutions Inc", status: "valid" },
				{ name: "grossPay", value: "$5,200.00", status: "valid" },
				{ name: "netPay", value: "$3,890.00", status: "valid" },
				{ name: "payPeriod", value: "Bi-weekly", status: "valid" },
			],
		},
		{
			id: "3",
			type: "Bank Statement",
			status: "completed",
			fields: [
				{ name: "accountHolder", value: "John Smith", status: "valid" },
				{ name: "accountNumber", value: "****1234", status: "valid" },
				{ name: "balance", value: "$15,450.00", status: "valid" },
				{ name: "statementPeriod", value: "", status: "missing" },
			],
		},
	],
};

const processingSteps = [
	{ id: 1, name: "Uploading documents", status: "completed" },
	{ id: 2, name: "Classifying document types", status: "completed" },
	{ id: 3, name: "Extracting data fields", status: "completed" },
	{ id: 4, name: "Validating information", status: "completed" },
	{ id: 5, name: "Generating results", status: "completed" },
];

export default function Results() {
	const [isProcessing, setIsProcessing] = useState(true);
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentStep((prev) => {
				if (prev < processingSteps.length - 1) {
					return prev + 1;
				} else {
					setIsProcessing(false);
					clearInterval(timer);
					return prev;
				}
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "valid":
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case "verification_needed":
				return <AlertCircle className="h-4 w-4 text-yellow-500" />;
			case "missing":
				return <XCircle className="h-4 w-4 text-red-500" />;
			default:
				return <FileText className="h-4 w-4 text-gray-400" />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "valid":
				return "text-green-600 bg-green-50";
			case "verification_needed":
				return "text-yellow-600 bg-yellow-50";
			case "missing":
				return "text-red-600 bg-red-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	if (isProcessing) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
				<div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
							Processing Your Documents
						</h1>
						<p className="text-lg text-gray-600">
							Please wait while we analyze and extract data from your
							documents...
						</p>
					</div>

					<div className="bg-white rounded-lg shadow-md p-8">
						<div className="space-y-6">
							{processingSteps.map((step, index) => (
								<div key={step.id} className="flex items-center">
									<div
										className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
											index <= currentStep
												? "bg-indigo-600 text-white"
												: "bg-gray-200 text-gray-400"
										}`}
									>
										{index <= currentStep ? (
											<CheckCircle className="h-4 w-4" />
										) : (
											<span className="text-sm font-medium">{step.id}</span>
										)}
									</div>
									<div className="ml-4 flex-1">
										<p
											className={`text-sm font-medium ${
												index <= currentStep ? "text-gray-900" : "text-gray-500"
											}`}
										>
											{step.name}
										</p>
										{index === currentStep &&
											index < processingSteps.length - 1 && (
												<div className="flex items-center mt-1">
													<RefreshCw className="h-3 w-3 text-indigo-600 animate-spin mr-1" />
													<span className="text-xs text-indigo-600">
														Processing...
													</span>
												</div>
											)}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

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
						Processing Complete
					</h1>
					<p className="mt-4 text-lg text-gray-600">
						Here are the results from your document analysis
					</p>
				</div>

				{/* Summary Card */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Application Summary
					</h2>
					<div className="grid md:grid-cols-4 gap-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-indigo-600">
								{mockResults.summary.processedDocuments}
							</div>
							<div className="text-sm text-gray-600">Documents Processed</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">
								{mockResults.summary.validFields}
							</div>
							<div className="text-sm text-gray-600">Valid Fields</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-yellow-600">
								{mockResults.summary.invalidFields}
							</div>
							<div className="text-sm text-gray-600">Need Review</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-red-600">
								{mockResults.summary.missingFields}
							</div>
							<div className="text-sm text-gray-600">Missing</div>
						</div>
					</div>

					<div className="mt-6 p-4 bg-yellow-50 rounded-lg">
						<div className="flex items-center">
							<AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
							<span className="font-medium text-yellow-800">
								Application Status: Needs Review
							</span>
						</div>
						<p className="text-sm text-yellow-700 mt-1">
							Some information requires manual verification before proceeding
							with the loan application.
						</p>
					</div>
				</div>

				{/* Detailed Results */}
				<div className="space-y-6">
					{mockResults.documents.map((doc) => (
						<div key={doc.id} className="bg-white rounded-lg shadow-md p-6">
							<div className="flex items-center mb-4">
								<FileText className="h-6 w-6 text-indigo-600 mr-3" />
								<h3 className="text-lg font-semibold text-gray-900">
									{doc.type}
								</h3>
								<span className="ml-auto px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
									Processed
								</span>
							</div>

							<div className="grid md:grid-cols-2 gap-4">
								{doc.fields.map((field) => (
									<div key={field.name} className="border rounded-lg p-3">
										<div className="flex items-center justify-between mb-1">
											<span className="text-sm font-medium text-gray-700">
												{field.name
													.replace(/([A-Z])/g, " $1")
													.replace(/^./, (str) => str.toUpperCase())}
											</span>
											{getStatusIcon(field.status)}
										</div>
										<div
											className={`text-sm px-2 py-1 rounded ${getStatusColor(field.status)}`}
										>
											{field.value || "Not found"}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				<div className="mt-8 text-center">
					<Link
						href="/"
						className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
					>
						Start New Analysis
					</Link>
				</div>

				<div className="mt-8 text-center text-sm text-gray-500">
					<p>Nutrient AI Document Processing SDK (formerly XtractFlow)</p>
				</div>
			</div>
		</div>
	);
}
