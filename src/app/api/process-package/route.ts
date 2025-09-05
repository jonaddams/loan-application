import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { type NextRequest, NextResponse } from "next/server";
import { DOCUMENT_TEMPLATES } from "@/lib/constants";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_NUTRIENT_API_URL || "https://api.xtractflow.com";
const AUTH_TOKEN = process.env.NUTRIENT_AUTH_TOKEN;

// Common headers for API requests
const commonHeaders = {
	"User-Agent": "loan-application/1.0",
};

// Define document types and their file patterns for each package
const PACKAGE_DOCUMENTS = {
	package1: [
		{
			name: "ima-cardholder-california-drivers-license.jpg",
			type: "California Driver's License",
			category: "identification",
		},
		{
			name: "ima-cardholder-sample-pay-stub.pdf",
			type: "Pay Stub",
			category: "income",
		},
		{
			name: "ima-cardholder-bank-statement.pdf",
			type: "Bank Statement",
			category: "financial",
		},
		{
			name: "ima-cardholder-vehicle-bill-of-sale.pdf",
			type: "Vehicle Bill of Sale",
			category: "vehicle",
		},
		{
			name: "ima-cardholder-auto-loan-application.pdf",
			type: "Auto Loan Application",
			category: "application",
		},
	],
	package2: [
		{
			name: "joseph-sample-florida-driver-license.png",
			type: "Florida Driver's License",
			category: "identification",
		},
		{
			name: "joseph-sample-sample-pay-stub.pdf",
			type: "Pay Stub",
			category: "income",
		},
		{
			name: "joseph-sample-employment-letter.pdf",
			type: "Employment Letter",
			category: "income",
		},
		{
			name: "joseph-sample-bank-statement.pdf",
			type: "Bank Statement",
			category: "financial",
		},
		{
			name: "joseph-sample-personal-loan-application.pdf",
			type: "Personal Loan Application",
			category: "application",
		},
	],
	package3: [
		{
			name: "sarah-martin-canada-passport.jpg",
			type: "Canadian Passport",
			category: "identification",
		},
		{
			name: "sarah-martin-sample-pay-stub.pdf",
			type: "Pay Stub",
			category: "income",
		},
		{
			name: "sarah-martin-employment-letter.pdf",
			type: "Employment Letter",
			category: "income",
		},
		{
			name: "sarah-martin-bank-statement.pdf",
			type: "Bank Statement",
			category: "financial",
		},
		{
			name: "sarah-martin-home-improvement-loan-application.pdf",
			type: "Home Improvement Loan Application",
			category: "application",
		},
	],
} as const;

// Map package IDs to directory names (package1 -> package-1)
const PACKAGE_DIRECTORIES = {
	package1: "package-1",
	package2: "package-2",
	package3: "package-3",
} as const;

// Register custom templates and get component ID
async function registerCustomTemplates() {
	console.log("🔧 Registering custom templates...");

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for registration

	try {
		const response = await fetch(`${API_BASE_URL}/api/register-component`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: AUTH_TOKEN || "",
				...commonHeaders,
			},
			body: JSON.stringify({
				enableClassifier: true,
				enableExtraction: true,
				templates: DOCUMENT_TEMPLATES,
			}),
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("❌ Template registration failed:", errorText);
			throw new Error(
				`Template registration failed: ${response.status} ${errorText}`,
			);
		}

		const result = await response.json();
		console.log(
			"✅ Templates registered successfully, componentId:",
			result.componentId,
		);
		return result.componentId;
	} catch (error) {
		clearTimeout(timeoutId);
		if (error instanceof Error && error.name === "AbortError") {
			console.error("⏰ Timeout registering templates after 30 seconds");
			throw new Error(
				"Timeout registering templates: Request took longer than 30 seconds",
			);
		}
		throw error;
	}
}

async function fetchDocumentFile(packageId: string, fileName: string) {
	// Use the correct directory name (package1 -> package-1)
	const directoryName =
		PACKAGE_DIRECTORIES[packageId as keyof typeof PACKAGE_DIRECTORIES];

	// Read file directly from filesystem instead of HTTP request
	const filePath = join(
		process.cwd(),
		"public",
		"documents",
		directoryName,
		fileName,
	);
	console.log(`📥 Reading document from filesystem: ${filePath}`);
	console.log(`📂 Package ID: ${packageId} -> Directory: ${directoryName}`);

	try {
		const fileBuffer = await readFile(filePath);
		console.log(`✅ Successfully read ${fileName}: ${fileBuffer.length} bytes`);
		return new Blob([new Uint8Array(fileBuffer)]);
	} catch (error) {
		console.error(`❌ Failed to read file ${filePath}:`, error);
		throw new Error(
			`Failed to read ${fileName}: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

async function processDocument(
	file: Blob,
	fileName: string,
	documentType: string,
	componentId: string,
) {
	const formData = new FormData();
	formData.append("inputFile", file, fileName);
	formData.append("componentId", componentId);

	console.log(
		`🚀 Processing ${fileName} (${documentType}) with componentId: ${componentId}...`,
	);

	// Create an AbortController with timeout
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

	try {
		const response = await fetch(`${API_BASE_URL}/api/process`, {
			method: "POST",
			headers: {
				Authorization: AUTH_TOKEN || "",
				...commonHeaders,
			},
			body: formData,
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		console.log(
			`📡 API response for ${fileName}: ${response.status} ${response.statusText}`,
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`❌ API error for ${fileName}:`, errorText);
			throw new Error(
				`API error for ${fileName}: ${response.status} ${errorText}`,
			);
		}

		const result = await response.json();
		console.log(`✅ API success for ${fileName}:`, {
			detectedTemplate: result.detectedTemplate,
			fieldsCount: result.fields ? result.fields.length : 0,
			hasFields: !!result.fields,
		});

		return result;
	} catch (error) {
		clearTimeout(timeoutId);
		if (error instanceof Error && error.name === "AbortError") {
			console.error(`⏰ Timeout processing ${fileName} after 60 seconds`);
			throw new Error(
				`Timeout processing ${fileName}: Request took longer than 60 seconds`,
			);
		}
		throw error;
	}
}

export async function POST(request: NextRequest) {
	console.log(
		"🔥 NEW process-package route called at",
		new Date().toISOString(),
	);

	try {
		if (!AUTH_TOKEN) {
			console.error("❌ Missing authentication token");
			return NextResponse.json(
				{ error: "Authentication token not configured" },
				{ status: 500 },
			);
		}

		const { packageId } = await request.json();

		if (
			!packageId ||
			!PACKAGE_DOCUMENTS[packageId as keyof typeof PACKAGE_DOCUMENTS]
		) {
			return NextResponse.json(
				{ error: "Invalid package ID" },
				{ status: 400 },
			);
		}

		console.log(`📦 Processing package: ${packageId}`);

		// Register custom templates first
		const componentId = await registerCustomTemplates();

		const packageDocs =
			PACKAGE_DOCUMENTS[packageId as keyof typeof PACKAGE_DOCUMENTS];

		// Step 1: Fetch all files in parallel first
		console.log(`📥 Pre-loading all ${packageDocs.length} document files...`);
		const fileLoadingPromises = packageDocs.map(async (doc) => {
			try {
				const fileBlob = await fetchDocumentFile(packageId, doc.name);
				console.log(`✅ Loaded ${doc.name}: ${fileBlob.size} bytes`);
				return { doc, fileBlob, error: null };
			} catch (error) {
				console.error(`❌ Error loading ${doc.name}:`, error);
				return { doc, fileBlob: null, error };
			}
		});

		const fileResults = await Promise.all(fileLoadingPromises);
		console.log(
			`📦 File loading completed: ${fileResults.filter((r) => r.fileBlob).length}/${fileResults.length} files loaded successfully`,
		);

		// Step 2: Process all documents with API in parallel
		console.log(`🚀 Starting parallel API processing of loaded documents...`);

		const processingPromises = fileResults.map(async (fileResult) => {
			const { doc, fileBlob, error: loadError } = fileResult;

			// If file loading failed, return failed result
			if (loadError || !fileBlob) {
				return {
					id: doc.name,
					fileName: doc.name,
					documentType: doc.type,
					category: doc.category,
					status: "failed",
					error:
						loadError instanceof Error
							? loadError.message
							: "Failed to load file",
					timestamp: new Date().toISOString(),
				};
			}

			try {
				console.log(`🚀 Processing ${doc.name} with API...`);

				// Process with API using custom templates
				const apiResult = await processDocument(
					fileBlob,
					doc.name,
					doc.type,
					componentId,
				);

				// Format the result
				const processedResult = {
					id: doc.name,
					fileName: doc.name,
					documentType: doc.type,
					category: doc.category,
					status: "completed",
					detectedTemplate: apiResult.detectedTemplate,
					fields: apiResult.fields || [],
					apiResponse: apiResult,
					timestamp: new Date().toISOString(),
				};

				console.log(`✅ Successfully processed ${doc.name}`);
				return processedResult;
			} catch (error) {
				console.error(`❌ Error processing ${doc.name}:`, error);

				return {
					id: doc.name,
					fileName: doc.name,
					documentType: doc.type,
					category: doc.category,
					status: "failed",
					error: error instanceof Error ? error.message : "Unknown error",
					timestamp: new Date().toISOString(),
				};
			}
		});

		// Wait for all documents to be processed
		const results = await Promise.all(processingPromises);
		console.log(
			`🎉 Parallel processing completed: ${results.length} documents processed`,
		);

		// Calculate summary statistics
		const successCount = results.filter((r) => r.status === "completed").length;
		const completedResults = results.filter(
			(r) => r.status === "completed",
		) as Array<{
			fields?: Array<{ validationState: string }>;
		}>;

		const totalFields = completedResults
			.filter((r) => r.fields)
			.reduce((acc, r) => acc + (r.fields?.length || 0), 0);

		const validFields = completedResults
			.filter((r) => r.fields)
			.reduce((acc, r) => {
				return (
					acc +
					(r.fields?.filter((f) => f.validationState === "Valid").length || 0)
				);
			}, 0);

		const verificationFields = completedResults
			.filter((r) => r.fields)
			.reduce((acc, r) => {
				return (
					acc +
					(r.fields?.filter((f) => f.validationState === "VerificationNeeded").length || 0)
				);
			}, 0);

		const missingFields = completedResults
			.filter((r) => r.fields)
			.reduce((acc, r) => {
				return (
					acc +
					(r.fields?.filter((f) => f.validationState === "Undefined").length || 0)
				);
			}, 0);

		const summary = {
			packageId,
			totalDocuments: results.length,
			successfulDocuments: successCount,
			failedDocuments: results.length - successCount,
			totalFields,
			validFields,
			verificationNeededFields: verificationFields,
			missingFields: missingFields,
			overallStatus: successCount === results.length ? "completed" : "partial",
			timestamp: new Date().toISOString(),
		};

		console.log(`🏁 Package processing completed:`, summary);

		return NextResponse.json({
			success: true,
			summary,
			documents: results,
		});
	} catch (error) {
		console.error("💥 Unexpected error in process-package route:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
