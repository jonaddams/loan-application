import { NextResponse } from "next/server";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_NUTRIENT_API_URL || "https://api.xtractflow.com";
const AUTH_TOKEN = process.env.NUTRIENT_AUTH_TOKEN;

export async function GET() {
	try {
		if (!AUTH_TOKEN) {
			return NextResponse.json(
				{ error: "Authentication token not configured" },
				{ status: 500 },
			);
		}

		const response = await fetch(
			`${API_BASE_URL}/api/get-predefined-templates`,
			{
				headers: {
					Authorization: AUTH_TOKEN,
				},
			},
		);

		if (!response.ok) {
			return NextResponse.json(
				{ error: `Failed to get predefined templates: ${response.statusText}` },
				{ status: response.status },
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error in get-templates API route:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
