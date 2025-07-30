import { ArrowRight, CheckCircle, FileText, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-900 sm:text-5xl md:text-3xl">
						<span className="block">Nutrient AI Document Processing</span>
						Loan Application Demo
					</h1>
					<p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
						Experience AI-powered document classification and data extraction
						for loan applications. Upload your documents and watch as our
						advanced technology automatically processes and validates your
						information.
					</p>
				</div>

				<div className="mt-16 grid md:grid-cols-3 gap-8">
					<div className="bg-white rounded-lg shadow-md p-6 text-center">
						<FileText className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Smart Document Recognition
						</h3>
						<p className="text-gray-600">
							Automatically identifies and classifies driver&apos;s licenses,
							pay stubs, bank statements, and more.
						</p>
					</div>

					<div className="bg-white rounded-lg shadow-md p-6 text-center">
						<Zap className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Instant Data Extraction
						</h3>
						<p className="text-gray-600">
							Extracts key information like names, addresses, income details,
							and account numbers in seconds.
						</p>
					</div>

					<div className="bg-white rounded-lg shadow-md p-6 text-center">
						<CheckCircle className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Built-in Validation
						</h3>
						<p className="text-gray-600">
							Validates extracted data for accuracy and completeness, ensuring
							reliable loan processing.
						</p>
					</div>
				</div>

				<div className="mt-16 text-center space-y-4">
					<Link
						href="/select-package"
						className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
					>
						Get Started
						<ArrowRight className="ml-2 h-5 w-5" />
					</Link>

					<div>
						<Link
							href="/test-api"
							className="inline-flex items-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
						>
							<FileText className="mr-2 h-4 w-4" />
							Test API with Sample Documents
						</Link>
					</div>
				</div>

				<div className="mt-12 text-center text-sm text-gray-500">
					<p>
						This is a proof-of-concept demonstration of the Nutrient AI Document
						Processing API capabilities.
					</p>
					<p className="mt-2">
						Nutrient AI Document Processing SDK (formerly known as XtractFlow)
					</p>
				</div>
			</div>
		</div>
	);
}
