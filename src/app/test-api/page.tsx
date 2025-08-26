import {
	ArrowLeft,
	ArrowRight,
	CreditCard,
	DollarSign,
	FileText,
	Zap,
} from "lucide-react";
import Link from "next/link";

const documentTypes = [
	{
		id: "drivers-license",
		name: "Driver's Licenses",
		icon: CreditCard,
		path: "/test-api/drivers-license",
		samples: 7,
		color: "bg-blue-600 hover:bg-blue-700",
	},
	{
		id: "passport",
		name: "Passports",
		icon: FileText,
		path: "/test-api/passport",
		samples: 10,
		color: "bg-green-600 hover:bg-green-700",
	},
	{
		id: "bank-statements",
		name: "Bank Statements",
		icon: DollarSign,
		path: "/test-api/bank-statements",
		samples: 1,
		color: "bg-purple-600 hover:bg-purple-700",
	},
	{
		id: "auto-process",
		name: "Auto Process Test",
		icon: Zap,
		path: "/test-api/auto-process",
		samples: 6,
		color: "bg-orange-600 hover:bg-orange-700",
		description: "Test automatic document type detection without predefined templates",
	},
];

export default function TestApiPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
						API Testing Suite
					</h1>
					<p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
						Test the Nutrient AI Document Processing API with different document
						types. Choose a document type below to start testing with sample
						images.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
					{documentTypes.map((docType) => {
						const IconComponent = docType.icon;

						return (
							<Link
								key={docType.id}
								href={docType.path}
								className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
							>
								<div className="p-8">
									<div className="text-center mb-6">
										<div className="mx-auto h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
											<IconComponent className="h-8 w-8 text-indigo-600" />
										</div>
										<h3 className="text-xl font-semibold text-gray-900 mb-2">
											{docType.name}
										</h3>
									</div>

									<div className="bg-gray-50 rounded-lg p-4 mb-6">
										<div className="flex items-center justify-between text-sm">
											<span className="font-medium text-gray-700">
												Sample Images:
											</span>
											<span className="text-gray-600">
												{docType.samples} files
											</span>
										</div>
									</div>

									<div className="text-center">
										<div
											className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white transition-colors ${docType.color}`}
										>
											Start Test
											<ArrowRight className="ml-2 h-4 w-4" />
										</div>
									</div>
								</div>
							</Link>
						);
					})}
				</div>

				{/* API Information */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						How the API Test Works
					</h2>
					<div className="grid md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="bg-indigo-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
								<span className="text-indigo-600 font-bold">1</span>
							</div>
							<h3 className="font-medium text-gray-900 mb-2">Get Templates</h3>
							<p className="text-sm text-gray-600">
								Fetch predefined document templates from the API
							</p>
						</div>
						<div className="text-center">
							<div className="bg-indigo-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
								<span className="text-indigo-600 font-bold">2</span>
							</div>
							<h3 className="font-medium text-gray-900 mb-2">
								Register Component
							</h3>
							<p className="text-sm text-gray-600">
								Register the selected template for document processing
							</p>
						</div>
						<div className="text-center">
							<div className="bg-indigo-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
								<span className="text-indigo-600 font-bold">3</span>
							</div>
							<h3 className="font-medium text-gray-900 mb-2">
								Process Documents
							</h3>
							<p className="text-sm text-gray-600">
								Upload and process each sample document with the API
							</p>
						</div>
					</div>
				</div>

				{/* API Endpoints Used */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						API Endpoints
					</h2>
					<div className="space-y-3">
						<div className="flex items-start">
							<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-3 mt-0.5">
								GET
							</span>
							<div>
								<code className="text-sm font-mono text-gray-900">
									/api/get-predefined-templates
								</code>
								<p className="text-sm text-gray-600 mt-1">
									Retrieve available document templates
								</p>
							</div>
						</div>
						<div className="flex items-start">
							<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-3 mt-0.5">
								POST
							</span>
							<div>
								<code className="text-sm font-mono text-gray-900">
									/api/register-component
								</code>
								<p className="text-sm text-gray-600 mt-1">
									Register document templates for processing
								</p>
							</div>
						</div>
						<div className="flex items-start">
							<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-3 mt-0.5">
								POST
							</span>
							<div>
								<code className="text-sm font-mono text-gray-900">
									/api/process
								</code>
								<p className="text-sm text-gray-600 mt-1">
									Process uploaded documents and extract data
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-8 text-center text-sm text-gray-500">
					<p>
						Nutrient AI Document Processing SDK (formerly known as XtractFlow)
					</p>
				</div>
			</div>
		</div>
	);
}
