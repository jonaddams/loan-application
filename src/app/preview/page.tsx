"use client";

import {
	ArrowLeft,
	ArrowRight,
	Building,
	CreditCard,
	Eye,
	FileText,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Viewer from "@/components/Viewer";

// Package information for display
const PACKAGE_INFO = {
	package1: {
		name: "Auto Loan Package",
		applicant: "Ima Cardholder",
		loanType: "Auto Loan",
		description:
			"Vehicle financing application with California driver's license",
		documents: [
			{
				name: "ima-cardholder-california-drivers-license.jpg",
				type: "California Driver's License",
				category: "identification",
				displayName: "Driver's License",
			},
			{
				name: "ima-cardholder-sample-pay-stub.pdf",
				type: "Pay Stub",
				category: "income",
				displayName: "Pay Stub",
			},
			{
				name: "ima-cardholder-bank-statement.pdf",
				type: "Bank Statement",
				category: "financial",
				displayName: "Bank Statement",
			},
			{
				name: "ima-cardholder-vehicle-bill-of-sale.pdf",
				type: "Vehicle Bill of Sale",
				category: "vehicle",
				displayName: "Vehicle Bill of Sale",
			},
			{
				name: "ima-cardholder-auto-loan-application.pdf",
				type: "Auto Loan Application",
				category: "application",
				displayName: "Auto Loan Application",
			},
		],
		icon: FileText,
	},
	package2: {
		name: "Personal Loan Package",
		applicant: "Joseph Sample",
		loanType: "Personal Loan",
		description: "General purpose loan with Florida driver's license",
		documents: [
			{
				name: "joseph-sample-florida-driver-license.png",
				type: "Florida Driver's License",
				category: "identification",
				displayName: "Driver's License",
			},
			{
				name: "joseph-sample-sample-pay-stub.pdf",
				type: "Pay Stub",
				category: "income",
				displayName: "Pay Stub",
			},
			{
				name: "joseph-sample-employment-letter.pdf",
				type: "Employment Letter",
				category: "income",
				displayName: "Employment Letter",
			},
			{
				name: "joseph-sample-bank-statement.pdf",
				type: "Bank Statement",
				category: "financial",
				displayName: "Bank Statement",
			},
			{
				name: "joseph-sample-personal-loan-application.pdf",
				type: "Personal Loan Application",
				category: "application",
				displayName: "Personal Loan Application",
			},
		],
		icon: CreditCard,
	},
	package3: {
		name: "Home Improvement Package",
		applicant: "Sarah Martin",
		loanType: "Home Improvement Loan",
		description: "Property improvement financing with Canadian passport",
		documents: [
			{
				name: "sarah-martin-canada-passport.jpg",
				type: "Canadian Passport",
				category: "identification",
				displayName: "Canadian Passport",
			},
			{
				name: "sarah-martin-sample-pay-stub.pdf",
				type: "Pay Stub",
				category: "income",
				displayName: "Pay Stub",
			},
			{
				name: "sarah-martin-employment-letter.pdf",
				type: "Employment Letter",
				category: "income",
				displayName: "Employment Letter",
			},
			{
				name: "sarah-martin-bank-statement.pdf",
				type: "Bank Statement",
				category: "financial",
				displayName: "Bank Statement",
			},
			{
				name: "sarah-martin-home-improvement-loan-application.pdf",
				type: "Home Improvement Loan Application",
				category: "application",
				displayName: "Home Improvement Loan Application",
			},
		],
		icon: Building,
	},
} as const;

// Map package IDs to directory names
const PACKAGE_DIRECTORIES = {
	package1: "package-1",
	package2: "package-2",
	package3: "package-3",
} as const;

// Minimal toolbar configuration for preview - moved outside component to prevent re-creation
const MINIMAL_TOOLBAR_ITEMS = [
	{ type: "zoom-out" },
	{ type: "zoom-in" },
	{ type: "zoom-mode" },
	{ type: "search" },
];

function PreviewContent() {
	const searchParams = useSearchParams();
	const packageId = searchParams.get("package") || "package1";
	const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

	// Get package info or default to package1
	const packageInfo =
		PACKAGE_INFO[packageId as keyof typeof PACKAGE_INFO] ||
		PACKAGE_INFO.package1;

	const directoryName =
		PACKAGE_DIRECTORIES[packageId as keyof typeof PACKAGE_DIRECTORIES];

	const getDocumentDescription = (category: string, documentType: string) => {
		switch (category) {
			case "identification":
				return "Government-issued identification document used to verify identity and personal information.";
			case "income":
				if (documentType.includes("Pay Stub")) {
					return "Income verification document showing employment details, pay period, and earnings.";
				} else if (documentType.includes("Employment")) {
					return "Employment verification letter confirming job status, salary, and employment terms.";
				}
				return "Income verification document showing employment and earnings information.";
			case "financial":
				return "Bank account statement showing financial history, balance, and transaction details.";
			case "vehicle":
				return "Vehicle purchase documentation showing sale details and ownership transfer.";
			case "application":
				return "This loan application form will be automatically filled with data extracted from the documents above.";
			default:
				return "Supporting document for the loan application process.";
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case "identification":
				return "bg-blue-50 border-blue-200 text-blue-800";
			case "income":
				return "bg-green-50 border-green-200 text-green-800";
			case "financial":
				return "bg-purple-50 border-purple-200 text-purple-800";
			case "vehicle":
				return "bg-orange-50 border-orange-200 text-orange-800";
			case "application":
				return "bg-indigo-50 border-indigo-200 text-indigo-800";
			default:
				return "bg-gray-50 border-gray-200 text-gray-800";
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "identification":
				return "🆔";
			case "income":
				return "💼";
			case "financial":
				return "🏦";
			case "vehicle":
				return "🚗";
			case "application":
				return "📋";
			default:
				return "📄";
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
						Preview Documents
					</h1>
					<p className="mt-2 text-lg text-gray-600">
						{packageInfo.name} for {packageInfo.applicant}
					</p>
					<p className="mt-1 text-sm text-gray-500">
						{packageInfo.description}
					</p>
				</div>

				{/* Document Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{packageInfo.documents.map((doc) => (
						<button
							type="button"
							key={doc.name}
							className={`rounded-lg border-2 p-4 transition-all cursor-pointer text-left w-full ${
								selectedDocument === doc.name
									? "ring-2 ring-indigo-500 shadow-lg"
									: "hover:shadow-md"
							} ${getCategoryColor(doc.category)}`}
							onClick={() => setSelectedDocument(doc.name)}
						>
							<div className="flex items-center justify-between mb-3">
								<span className="text-2xl">
									{getCategoryIcon(doc.category)}
								</span>
								<span className="text-xs px-2 py-1 rounded-full bg-white/50 font-medium">
									{doc.category.toUpperCase()}
								</span>
							</div>
							<h3 className="font-semibold text-sm mb-2">{doc.displayName}</h3>
							<div className="flex items-center text-xs opacity-75">
								<Eye className="h-3 w-3 mr-1" />
								{doc.name.split(".")[1]?.toUpperCase() || "FILE"}
							</div>
						</button>
					))}
				</div>

				{/* Document Preview Section */}
				{selectedDocument && (
					<div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
						<div className="bg-gray-50 px-6 py-4 border-b">
							<h2 className="text-lg font-semibold text-gray-900">
								Document Preview:{" "}
								{
									packageInfo.documents.find((d) => d.name === selectedDocument)
										?.displayName
								}
							</h2>
							<p className="text-sm text-gray-600 mt-1">
								{getDocumentDescription(
									packageInfo.documents.find((d) => d.name === selectedDocument)
										?.category || "",
									packageInfo.documents.find((d) => d.name === selectedDocument)
										?.type || "",
								)}
							</p>
						</div>
						<Viewer
							document={`/documents/${directoryName}/${selectedDocument}`}
							toolbarItems={MINIMAL_TOOLBAR_ITEMS}
						/>
					</div>
				)}

				{/* Process Documents Button */}
				<div className="text-center">
					<Link
						href={`/results?package=${packageId}`}
						className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
					>
						Process Documents
						<ArrowRight className="ml-2 h-5 w-5" />
					</Link>
					<p className="mt-4 text-sm text-gray-600">
						This will analyze all documents and automatically fill the loan
						application form
					</p>
				</div>

				<div className="mt-16 text-center text-sm text-gray-500">
					<p>Nutrient AI Document Processing SDK</p>
				</div>
			</div>
		</div>
	);
}

export default function Preview() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
					<div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
						<div className="bg-white rounded-lg shadow-md p-12">
							<div className="text-center">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									Loading Preview
								</h3>
								<p className="text-gray-600">
									Please wait while we prepare the document preview...
								</p>
							</div>
						</div>
					</div>
				</div>
			}
		>
			<PreviewContent />
		</Suspense>
	);
}
