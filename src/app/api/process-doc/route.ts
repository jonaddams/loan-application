import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_NUTRIENT_API_URL || "https://api.xtractflow.com";
const AUTH_TOKEN = process.env.NUTRIENT_AUTH_TOKEN;

export async function POST(request: NextRequest) {
	console.log("🔥 NEW process-doc route called at", new Date().toISOString());

	try {
		if (!AUTH_TOKEN) {
			console.error("❌ Missing authentication token");
			return NextResponse.json(
				{ error: "Authentication token not configured" },
				{ status: 500 }
			);
		}

		// Parse the incoming form data
		const formData = await request.formData();
		const file = formData.get("file") as File;
		const componentId = formData.get("componentId") as string;

		console.log("📋 Received data:", {
			fileName: file?.name,
			fileSize: file?.size,
			fileType: file?.type,
			componentId,
		});

		// Validate required fields
		if (!file) {
			console.error("❌ Missing file");
			return NextResponse.json({ error: "File is required" }, { status: 400 });
		}

		if (!componentId) {
			console.error("❌ Missing componentId");
			return NextResponse.json(
				{ error: "ComponentId is required" },
				{ status: 400 },
			);
		}

		// Create form data for external API
		const externalFormData = new FormData();
		externalFormData.append("inputFile", file);
		externalFormData.append("componentId", componentId);

		console.log(
			"🚀 Making request to external API:",
			`${API_BASE_URL}/api/process`,
		);

		// Call external API
		const response = await fetch(`${API_BASE_URL}/api/process`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${AUTH_TOKEN}`,
			},
			body: externalFormData,
		});

		console.log("📡 External API response:", {
			status: response.status,
			statusText: response.statusText,
			ok: response.ok,
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error("❌ External API error:", errorText);
			return NextResponse.json(
				{
					error: `External API error: ${response.status} ${response.statusText}`,
					details: errorText,
				},
				{ status: response.status },
			);
		}

		const result = await response.json();
		console.log("✅ External API success:", result);

		return NextResponse.json(result);
	} catch (error) {
		console.error("💥 Unexpected error in process-doc route:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
