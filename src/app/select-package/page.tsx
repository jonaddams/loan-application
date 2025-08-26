"use client";

import {
	ArrowLeft,
	ArrowRight,
	Building,
	CheckCircle,
	CreditCard,
	FileText,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const packages = [
	{
		id: "package1",
		name: "Auto Loan Package",
		description:
			"Auto loan application with California driver's license for Ima Cardholder",
		documents: [
			{
				type: "California Driver's License",
				description: "Government-issued identification for Ima Cardholder",
			},
			{ type: "Pay Stub", description: "Income verification document" },
			{ type: "Bank Statement", description: "Commerce Bank account statement" },
			{
				type: "Auto Loan Application",
				description: "Vehicle financing application form",
			},
		],
		icon: FileText,
	},
	{
		id: "package2",
		name: "Personal Loan Package",
		description: "Personal loan application with Florida driver's license for Joseph Sample",
		documents: [
			{
				type: "Florida Driver's License",
				description: "Government-issued identification for Joseph Sample",
			},
			{ type: "Pay Stub", description: "TechFlow Solutions payroll document" },
			{ type: "Employment Letter", description: "Employment verification from TechFlow Solutions" },
			{ type: "Bank Statement", description: "SunTrust Bank account statement" },
			{
				type: "Personal Loan Application",
				description: "General purpose loan application form",
			},
		],
		icon: CreditCard,
	},
	{
		id: "package3",
		name: "Home Improvement Package",
		description: "Home improvement loan with Canadian passport for Sarah Martin",
		documents: [
			{
				type: "Canadian Passport",
				description: "Government-issued identification for Sarah Martin",
			},
			{ type: "Pay Stub", description: "Meridian Healthcare Systems payroll" },
			{ type: "Employment Letter", description: "Employment verification from Meridian Healthcare" },
			{ type: "Bank Statement", description: "Royal Bank of Canada account statement" },
			{
				type: "Home Improvement Loan Application",
				description: "Property improvement financing form",
			},
		],
		icon: Building,
	},
];

export default function SelectPackage() {
	const [selectedPackage, setSelectedPackage] = useState<string>("");

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8">
					<Link
						href="/"
						className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Home
					</Link>
				</div>

				<div className="text-center mb-12">
					<h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
						Select Your Document Package
					</h1>
					<p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
						Each package includes different combinations of documents for
						processing.
					</p>
				</div>

				<div className="grid lg:grid-cols-3 gap-8 mb-12 items-start">
					{packages.map((pkg) => {
						const IconComponent = pkg.icon;
						const isSelected = selectedPackage === pkg.id;

						return (
							<button
								key={pkg.id}
								type="button"
								className={`relative bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all text-left w-full flex flex-col ${
									isSelected
										? "ring-2 ring-indigo-500 shadow-lg"
										: "hover:shadow-lg"
								}`}
								onClick={() => setSelectedPackage(pkg.id)}
							>
								{isSelected && (
									<div className="absolute -top-2 -right-2 bg-indigo-500 rounded-full p-1">
										<CheckCircle className="h-4 w-4 text-white" />
									</div>
								)}

								{/* Fixed height header section */}
								<div className="text-center mb-6 flex-shrink-0">
									<div className="h-16 flex items-center justify-center mb-4">
										<IconComponent className="h-12 w-12 text-indigo-600" />
									</div>
									<div className="h-8 flex items-center justify-center mb-4">
										<h3 className="text-xl font-semibold text-gray-900">
											{pkg.name}
										</h3>
									</div>
									<div className="h-16 flex items-center justify-center">
										<p className="text-gray-600 text-center leading-tight">
											{pkg.description}
										</p>
									</div>
								</div>

								{/* Variable content section */}
								<div className="space-y-3 flex-grow">
									<h4 className="font-medium text-gray-900">
										Included Documents:
									</h4>
									{pkg.documents.map((doc) => (
										<div key={doc.type} className="flex items-start">
											<CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
											<div>
												<span className="font-medium text-gray-900">
													{doc.type}
												</span>
												<p className="text-sm text-gray-600">
													{doc.description}
												</p>
											</div>
										</div>
									))}
								</div>
							</button>
						);
					})}
				</div>

				{selectedPackage && (
					<div className="text-center">
						<Link
							href="/results"
							className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
						>
							Process Documents
							<ArrowRight className="ml-2 h-5 w-5" />
						</Link>
					</div>
				)}

				<div className="mt-16 text-center text-sm text-gray-500">
					<p>Nutrient AI Document Processing SDK (formerly XtractFlow)</p>
				</div>
			</div>
		</div>
	);
}
