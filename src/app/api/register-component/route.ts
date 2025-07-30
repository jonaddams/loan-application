import { type NextRequest, NextResponse } from "next/server";
import type { DocumentTemplate } from "@/types";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_NUTRIENT_API_URL || "https://api.xtractflow.com";
const AUTH_TOKEN = process.env.NUTRIENT_AUTH_TOKEN;

export async function POST(request: NextRequest) {
	try {
		if (!AUTH_TOKEN) {
			return NextResponse.json(
				{ error: "Authentication token not configured" },
				{ status: 500 },
			);
		}

		const body = await request.json();
		const { templates }: { templates: DocumentTemplate[] } = body;

		if (!templates || !Array.isArray(templates)) {
			return NextResponse.json(
				{ error: "Invalid templates data" },
				{ status: 400 },
			);
		}

		const response = await fetch(`${API_BASE_URL}/api/register-component`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${AUTH_TOKEN}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				enableClassifier: true,
				enableExtraction: true,
				templates,
			}),
		});

		if (!response.ok) {
			return NextResponse.json(
				{ error: `Failed to register component: ${response.statusText}` },
				{ status: response.status },
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error in register-component API route:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
