import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_NUTRIENT_API_URL || "https://api.xtractflow.com";
const AUTH_TOKEN = process.env.NUTRIENT_AUTH_TOKEN;

// Define document types and their file patterns for each package
const PACKAGE_DOCUMENTS = {
	package1: [
		{
			name: "ima-cardholder-california-drivers-license.jpg",
			type: "California Driver's License",
			category: "identification",
		},
		{
			name: "ima-cardholder-sample-pay-stub-1.pdf",
			type: "Pay Stub",
			category: "income",
		},
		{
			name: "ima-cardholder-bank-statement.pdf",
			type: "Bank Statement",
			category: "financial",
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

async function fetchDocumentFile(packageId: string, fileName: string) {
	const baseUrl = process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: "http://localhost:3000";

	// Use the correct directory name (package1 -> package-1)
	const directoryName =
		PACKAGE_DIRECTORIES[packageId as keyof typeof PACKAGE_DIRECTORIES];
	const fileUrl = `${baseUrl}/documents/${directoryName}/${fileName}`;
	console.log(`📥 Fetching document: ${fileUrl}`);
	console.log(`📂 Package ID: ${packageId} -> Directory: ${directoryName}`);

	const response = await fetch(fileUrl);
	console.log(`📡 Fetch response: ${response.status} ${response.statusText}`);
	if (!response.ok) {
		throw new Error(
			`Failed to fetch ${fileName}: ${response.status} ${response.statusText}`,
		);
	}

	return response.blob();
}

async function processDocument(
	file: Blob,
	fileName: string,
	documentType: string,
) {
	const formData = new FormData();
	formData.append("inputFile", file, fileName);
	// Not including componentId - let the API automatically detect document type

	console.log(`🚀 Processing ${fileName} (${documentType})...`);

	const response = await fetch(`${API_BASE_URL}/api/process`, {
		method: "POST",
		headers: {
			Authorization: AUTH_TOKEN || "",
		},
		body: formData,
	});

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

		const packageDocs =
			PACKAGE_DOCUMENTS[packageId as keyof typeof PACKAGE_DOCUMENTS];
		const results = [];

		// Process each document in the package
		for (const doc of packageDocs) {
			try {
				console.log(`📄 Processing document: ${doc.name}`);

				// Fetch the document file
				const fileBlob = await fetchDocumentFile(packageId, doc.name);
				console.log(`✅ Fetched ${doc.name}: ${fileBlob.size} bytes`);

				// Process with API
				const apiResult = await processDocument(fileBlob, doc.name, doc.type);

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

				results.push(processedResult);
				console.log(`✅ Successfully processed ${doc.name}`);
			} catch (error) {
				console.error(`❌ Error processing ${doc.name}:`, error);

				results.push({
					id: doc.name,
					fileName: doc.name,
					documentType: doc.type,
					category: doc.category,
					status: "failed",
					error: error instanceof Error ? error.message : "Unknown error",
					timestamp: new Date().toISOString(),
				});
			}
		}

		// Calculate summary statistics
		const successCount = results.filter((r) => r.status === "completed").length;
		const completedResults = results.filter((r) => r.status === "completed") as Array<{
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
					(r.fields?.filter((f) => f.validationState === "Valid").length ||
						0)
				);
			}, 0);

		const verificationFields = completedResults
			.filter((r) => r.fields)
			.reduce((acc, r) => {
				return (
					acc +
					(r.fields?.filter(
						(f) =>
							f.validationState === "VerificationNeeded" ||
							f.validationState === "Undefined",
					).length || 0)
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
			missingFields: totalFields - validFields - verificationFields,
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
