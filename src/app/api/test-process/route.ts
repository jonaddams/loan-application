import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_NUTRIENT_API_URL || "https://api.xtractflow.com";
const AUTH_TOKEN = process.env.NUTRIENT_AUTH_TOKEN;

export async function GET() {
	console.log("🧪 Starting process test without componentId...");

	if (!AUTH_TOKEN) {
		return NextResponse.json(
			{ error: "Authentication token not configured" },
			{ status: 500 }
		);
	}

	const testResults = [];

	// Test files - passports and driver licenses using actual files from public folder
	const testFiles = [
		// Passport files
		{
			url: "/documents/passports/usa-passport.jpg",
			type: "passport",
			name: "usa-passport.jpg"
		},
		{
			url: "/documents/passports/canada-passport.jpg", 
			type: "passport",
			name: "canada-passport.jpg"
		},
		{
			url: "/documents/passports/uk-ireland-passport.jpg",
			type: "passport", 
			name: "uk-ireland-passport.jpg"
		},
		// Driver license files
		{
			url: "/documents/drivers-licenses/california-drivers-license.jpg",
			type: "driver_license",
			name: "california-drivers-license.jpg"
		},
		{
			url: "/documents/drivers-licenses/texas-drivers-license.webp",
			type: "driver_license", 
			name: "texas-drivers-license.webp"
		},
		{
			url: "/documents/drivers-licenses/florida-driver-license.png",
			type: "driver_license",
			name: "florida-driver-license.png"
		}
	];

	for (const testFile of testFiles) {
		console.log(`📄 Testing ${testFile.name} (${testFile.type})...`);
		
		try {
			// First, get the image file from local API
			const fullUrl = `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}${testFile.url}`;
			console.log(`📥 Fetching image from: ${fullUrl}`);
			const imageResponse = await fetch(fullUrl);

			if (!imageResponse.ok) {
				console.error(`❌ Failed to fetch ${testFile.name}: ${imageResponse.statusText}`);
				testResults.push({
					file: testFile.name,
					type: testFile.type,
					success: false,
					error: `Failed to fetch image: ${imageResponse.statusText}`,
					timestamp: new Date().toISOString(),
				});
				continue;
			}

			const imageBlob = await imageResponse.blob();
			console.log(`✅ Got image blob: ${imageBlob.size} bytes, type: ${imageBlob.type}`);

			// Create FormData for the process request (without componentId)
			const formData = new FormData();
			formData.append("inputFile", imageBlob, testFile.name);
			// Note: Not including componentId - let server deduce the type

			console.log(`🚀 Processing ${testFile.name} without componentId...`);
			
			// Process the document without componentId
			const processResponse = await fetch(`${API_BASE_URL}/api/process`, {
				method: "POST",
				headers: {
					Authorization: AUTH_TOKEN,
				},
				body: formData,
			});

			const responseText = await processResponse.text();
			console.log(`📡 Process response for ${testFile.name}:`, {
				status: processResponse.status,
				statusText: processResponse.statusText,
				ok: processResponse.ok,
				body: responseText,
			});

			if (processResponse.ok) {
				const processResult = JSON.parse(responseText);
				testResults.push({
					file: testFile.name,
					type: testFile.type,
					success: true,
					detectedTemplate: processResult.detectedTemplate,
					fieldsCount: processResult.fields ? processResult.fields.length : 0,
					result: processResult,
					timestamp: new Date().toISOString(),
				});
				console.log(`✅ Successfully processed ${testFile.name}. Detected: ${processResult.detectedTemplate}`);
			} else {
				testResults.push({
					file: testFile.name,
					type: testFile.type,
					success: false,
					error: `HTTP ${processResponse.status}: ${responseText}`,
					timestamp: new Date().toISOString(),
				});
				console.error(`❌ Failed to process ${testFile.name}: ${responseText}`);
			}
		} catch (error) {
			console.error(`💥 Exception processing ${testFile.name}:`, error);
			testResults.push({
				file: testFile.name,
				type: testFile.type,
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				timestamp: new Date().toISOString(),
			});
		}
	}

	const successCount = testResults.filter(r => r.success).length;
	const summary = {
		totalTests: testResults.length,
		successful: successCount,
		failed: testResults.length - successCount,
		timestamp: new Date().toISOString(),
	};

	console.log("🏁 Process test completed:", summary);

	return NextResponse.json({
		summary,
		results: testResults,
	});
}