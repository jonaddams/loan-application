"use client";

import { ArrowLeft, CheckCircle, Clock, XCircle, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface TestResult {
	file: string;
	type: string;
	success: boolean;
	detectedTemplate?: string;
	fieldsCount?: number;
	result?: Record<string, unknown>;
	error?: string;
	timestamp: string;
}

interface TestSummary {
	totalTests: number;
	successful: number;
	failed: number;
	timestamp: string;
}

export default function AutoProcessTestPage() {
	const [isRunning, setIsRunning] = useState(false);
	const [results, setResults] = useState<TestResult[]>([]);
	const [summary, setSummary] = useState<TestSummary | null>(null);

	const runTest = async () => {
		setIsRunning(true);
		setResults([]);
		setSummary(null);

		try {
			const response = await fetch("/api/test-process");
			const data = await response.json();

			if (response.ok) {
				setResults(data.results || []);
				setSummary(data.summary || null);
			} else {
				console.error("Test failed:", data);
			}
		} catch (error) {
			console.error("Test error:", error);
		} finally {
			setIsRunning(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
			<div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8">
					<Link
						href="/test-api"
						className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Test Suite
					</Link>
				</div>

				<div className="text-center mb-12">
					<div className="mx-auto h-16 w-16 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
						<Zap className="h-8 w-8 text-orange-600" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
						Auto Process Test
					</h1>
					<p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
						Test automatic document type detection by sending files directly to
						the API without a componentId. The server will automatically deduce
						the document type.
					</p>
				</div>

				{/* Test Info */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						How This Test Works
					</h2>
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h3 className="font-medium text-gray-900 mb-2">Test Files</h3>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>• 3 Passport images</li>
								<li>• 3 Driver's License images</li>
								<li>• No predefined templates used</li>
								<li>• No componentId sent to API</li>
							</ul>
						</div>
						<div>
							<h3 className="font-medium text-gray-900 mb-2">API Process</h3>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>• Direct call to /api/process</li>
								<li>• Server deduces document type</li>
								<li>• Returns detected template + extracted fields</li>
								<li>• Tests classification accuracy</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Run Test Button */}
				<div className="text-center mb-8">
					<button
						type="button"
						onClick={runTest}
						disabled={isRunning}
						className={`inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white transition-colors ${
							isRunning
								? "bg-gray-400 cursor-not-allowed"
								: "bg-orange-600 hover:bg-orange-700"
						}`}
					>
						{isRunning ? (
							<>
								<Clock className="mr-3 h-5 w-5 animate-spin" />
								Running Tests...
							</>
						) : (
							<>
								<Zap className="mr-3 h-5 w-5" />
								Run Auto Process Test
							</>
						)}
					</button>
				</div>

				{/* Summary */}
				{summary && (
					<div className="bg-white rounded-lg shadow-md p-6 mb-8">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							Test Summary
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="text-center">
								<div className="text-2xl font-bold text-gray-900">
									{summary.totalTests}
								</div>
								<div className="text-sm text-gray-600">Total Tests</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-green-600">
									{summary.successful}
								</div>
								<div className="text-sm text-gray-600">Successful</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-red-600">
									{summary.failed}
								</div>
								<div className="text-sm text-gray-600">Failed</div>
							</div>
						</div>
						<div className="mt-4 text-center text-sm text-gray-500">
							Completed at {new Date(summary.timestamp).toLocaleString()}
						</div>
					</div>
				)}

				{/* Results */}
				{results.length > 0 && (
					<div className="bg-white rounded-lg shadow-md overflow-hidden">
						<div className="px-6 py-4 border-b border-gray-200">
							<h2 className="text-xl font-semibold text-gray-900">
								Test Results
							</h2>
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											File
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Expected Type
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Detected Template
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Fields
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Details
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{results.map((result) => (
										<tr
											key={`${result.file}-${result.timestamp}`}
											className="hover:bg-gray-50"
										>
											<td className="px-6 py-4 whitespace-nowrap">
												{result.success ? (
													<CheckCircle className="h-5 w-5 text-green-500" />
												) : (
													<XCircle className="h-5 w-5 text-red-500" />
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
												{result.file}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
												{result.type}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
												{result.detectedTemplate || "N/A"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
												{result.fieldsCount ?? "N/A"}
											</td>
											<td className="px-6 py-4 text-sm text-gray-600">
												{result.success ? (
													<details className="cursor-pointer">
														<summary className="text-blue-600 hover:text-blue-800">
															View Result
														</summary>
														<pre className="mt-2 text-xs bg-gray-100 p-2 rounded max-w-md overflow-auto">
															{JSON.stringify(result.result, null, 2)}
														</pre>
													</details>
												) : (
													<span className="text-red-600">{result.error}</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* API Endpoint Used */}
				<div className="mt-8 bg-white rounded-lg shadow-md p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						API Endpoint Used
					</h2>
					<div className="flex items-start">
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-3 mt-0.5">
							POST
						</span>
						<div>
							<code className="text-sm font-mono text-gray-900">
								/api/process
							</code>
							<p className="text-sm text-gray-600 mt-1">
								Process documents without componentId - let server deduce type
								automatically
							</p>
							<p className="text-xs text-gray-500 mt-1">
								Payload: FormData with inputFile only (no componentId)
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
