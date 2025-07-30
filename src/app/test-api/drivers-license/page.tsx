"use client";

import {
	AlertCircle,
	ArrowLeft,
	CheckCircle,
	FileText,
	RefreshCw,
	XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	getDriverLicenseImages,
	getPredefinedTemplates,
	type PredefinedTemplate,
	processDocument,
	registerComponent,
	urlToFile,
} from "@/lib/api";
import type { ProcessDocumentResponse } from "@/types";

interface ProcessingResult {
	filename: string;
	imagePath: string;
	status: "pending" | "processing" | "completed" | "error";
	result?: ProcessDocumentResponse;
	error?: string;
}

export default function TestApiPage() {
	const [templates, setTemplates] = useState<PredefinedTemplate[]>([]);
	const [componentId, setComponentId] = useState<string>("");
	const [selectedTemplate, setSelectedTemplate] =
		useState<PredefinedTemplate | null>(null);
	const [processingResults, setProcessingResults] = useState<
		ProcessingResult[]
	>([]);
	const [sampleImages, setSampleImages] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");

	// Load sample images from server
	useEffect(() => {
		const loadSampleImages = async () => {
			try {
				const images = await getDriverLicenseImages();
				setSampleImages(images);

				const initialResults: ProcessingResult[] = images.map((filename) => ({
					filename,
					imagePath: `/documents/drivers-licenses/${filename}`,
					status: "pending",
				}));
				setProcessingResults(initialResults);
			} catch (err) {
				console.error("Failed to load sample images:", err);
				setError("Failed to load sample images");
			}
		};

		loadSampleImages();
	}, []);

	const handleTestApi = async () => {
		setLoading(true);
		setError("");

		try {
			// Step 1: Get predefined templates
			console.log("Getting predefined templates...");
			const predefinedTemplates = await getPredefinedTemplates();
			setTemplates(predefinedTemplates);

			// Step 2: Find driver&apos;s license template
			const driversLicenseTemplate = predefinedTemplates.find(
				(template) =>
					template.identifier === "drivers_license" ||
					template.name.toLowerCase().includes("driver") ||
					template.name.toLowerCase().includes("license"),
			);

			if (!driversLicenseTemplate) {
				throw new Error(
					"Driver&apos;s license template not found in predefined templates",
				);
			}

			console.log(
				"Found driver&apos;s license template:",
				driversLicenseTemplate,
			);

			setSelectedTemplate(driversLicenseTemplate);

			// Step 3: Register the template to get a componentId
			console.log("Registering driver's license template...");
			const registerResponse = await registerComponent([
				{
					name: driversLicenseTemplate.name,
					fields: driversLicenseTemplate.fields.map((field) => ({
						...field,
						validationMethod:
							field.validationMethod || "PostalAddressIntegrity",
					})),
					identifier: driversLicenseTemplate.identifier,
					semanticDescription: driversLicenseTemplate.semanticDescription,
				},
			]);

			const useComponentId = registerResponse.componentId;
			console.log("Registered component with ID:", useComponentId);

			setComponentId(useComponentId);

			// Step 4: Process each image
			for (let i = 0; i < sampleImages.length; i++) {
				const filename = sampleImages[i];
				const imagePath = `/documents/drivers-licenses/${filename}`;

				// Update status to processing
				setProcessingResults((prev) =>
					prev.map((result) =>
						result.filename === filename
							? { ...result, status: "processing" }
							: result,
					),
				);

				try {
					// Convert image to File object
					const file = await urlToFile(imagePath, filename);

					// Process the document
					const processResult = await processDocument(file, useComponentId);

					// Update with results
					setProcessingResults((prev) =>
						prev.map((result) =>
							result.filename === filename
								? { ...result, status: "completed", result: processResult }
								: result,
						),
					);

					console.log(`Processed ${filename}:`, processResult);
				} catch (processError) {
					console.error(`Error processing ${filename}:`, processError);
					setProcessingResults((prev) =>
						prev.map((result) =>
							result.filename === filename
								? {
										...result,
										status: "error",
										error:
											processError instanceof Error
												? processError.message
												: "Unknown error",
									}
								: result,
						),
					);
				}

				// Add small delay between requests
				if (i < sampleImages.length - 1) {
					await new Promise((resolve) => setTimeout(resolve, 1000));
				}
			}
		} catch (err) {
			console.error("API test error:", err);
			setError(err instanceof Error ? err.message : "Unknown error occurred");
		} finally {
			setLoading(false);
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case "processing":
				return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
			case "error":
				return <XCircle className="h-4 w-4 text-red-500" />;
			default:
				return <AlertCircle className="h-4 w-4 text-gray-400" />;
		}
	};

	const getFieldStatusIcon = (status: string) => {
		switch (status) {
			case "Valid":
				return <CheckCircle className="h-3 w-3 text-green-500" />;
			case "VerificationNeeded":
				return <AlertCircle className="h-3 w-3 text-yellow-500" />;
			case "Undefined":
				return <XCircle className="h-3 w-3 text-red-500" />;
			default:
				return <FileText className="h-3 w-3 text-gray-400" />;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8">
					<Link
						href="/test-api"
						className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Test Suite
					</Link>
				</div>

				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
						API Test - Driver&apos;s License Processing
					</h1>
					<p className="mt-4 text-lg text-gray-600">
						Test the Nutrient AI Document Processing API with sample
						driver&apos;s license images
					</p>
				</div>

				{/* Control Panel */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-semibold text-gray-900">
								API Test Controls
							</h2>
							<p className="text-gray-600">
								Test processing {sampleImages.length} sample driver&apos;s
								license images
							</p>
						</div>
						<button
							type="button"
							onClick={handleTestApi}
							disabled={loading}
							className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
						>
							{loading ? (
								<>
									<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
									Processing...
								</>
							) : (
								"Start API Test"
							)}
						</button>
					</div>

					{error && (
						<div className="mt-4 p-4 bg-red-50 rounded-lg">
							<div className="flex items-center">
								<XCircle className="h-5 w-5 text-red-600 mr-2" />
								<span className="font-medium text-red-800">Error</span>
							</div>
							<p className="text-sm text-red-700 mt-1">{error}</p>
						</div>
					)}

					{componentId && selectedTemplate && (
						<div className="mt-4 p-4 bg-green-50 rounded-lg">
							<div className="flex items-center">
								<CheckCircle className="h-5 w-5 text-green-600 mr-2" />
								<span className="font-medium text-green-800">
									Component Registered
								</span>
							</div>
							<div className="text-sm text-green-700 mt-2 space-y-1">
								<p>
									<strong>Template:</strong> {selectedTemplate.name}
								</p>
								<p>
									<strong>Template ID:</strong> {selectedTemplate.identifier}
								</p>
								<p>
									<strong>Description:</strong>{" "}
									{selectedTemplate.semanticDescription}
								</p>
								<p>
									<strong>Component ID:</strong> {componentId}
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Results Grid */}
				<div className="grid lg:grid-cols-2 gap-8">
					{processingResults.map((result) => (
						<div
							key={result.filename}
							className="bg-white rounded-lg shadow-md p-6"
						>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">
									{result.filename}
								</h3>
								<div className="flex items-center">
									{getStatusIcon(result.status)}
									<span className="ml-2 text-sm font-medium text-gray-600 capitalize">
										{result.status}
									</span>
								</div>
							</div>

							{/* Image */}
							<div className="mb-6">
								<div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden">
									<Image
										src={result.imagePath}
										alt={`Driver&apos;s license - ${result.filename}`}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										className="object-contain"
									/>
								</div>
							</div>

							{/* Results */}
							{result.status === "completed" && result.result && (
								<div className="space-y-4">
									<div className="p-3 bg-gray-50 rounded-lg">
										<p className="text-sm font-medium text-gray-700">
											Detected Template:{" "}
											{result.result.detectedTemplate || "Not detected"}
										</p>
									</div>

									{result.result.fields && result.result.fields.length > 0 && (
										<div className="space-y-2">
											<h4 className="font-medium text-gray-900">
												Extracted Fields:
											</h4>
											{result.result.fields.map((field) => (
												<div
													key={field.fieldName}
													className="p-3 border rounded-lg"
												>
													<div className="flex items-center justify-between mb-1">
														<span className="text-sm font-medium text-gray-700">
															{field.fieldName}
														</span>
														{getFieldStatusIcon(field.validationState)}
													</div>
													<div className="text-sm text-gray-600">
														<p>
															<strong>Value:</strong>{" "}
															{field.value?.value || "Not found"}
														</p>
														<p>
															<strong>Format:</strong> {field.value?.format}
														</p>
														<p>
															<strong>Status:</strong> {field.validationState}
														</p>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							)}

							{result.status === "error" && result.error && (
								<div className="p-4 bg-red-50 rounded-lg">
									<div className="flex items-center">
										<XCircle className="h-5 w-5 text-red-600 mr-2" />
										<span className="font-medium text-red-800">
											Processing Error
										</span>
									</div>
									<p className="text-sm text-red-700 mt-1">{result.error}</p>
								</div>
							)}
						</div>
					))}
				</div>

				{/* Templates Info */}
				{templates.length > 0 && (
					<div className="mt-8 bg-white rounded-lg shadow-md p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Predefined Templates ({templates.length})
						</h3>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
							{templates.map((template) => (
								<div
									key={template.identifier}
									className="p-3 border rounded-lg"
								>
									<h4 className="font-medium text-gray-900">{template.name}</h4>
									<p className="text-sm text-gray-600">{template.identifier}</p>
									<p className="text-xs text-gray-500 mt-1">
										{template.fields.length} fields
									</p>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="mt-8 text-center text-sm text-gray-500">
					<p>
						Nutrient AI Document Processing SDK (formerly known as XtractFlow)
					</p>
				</div>
			</div>
		</div>
	);
}
