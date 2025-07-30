import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const driversLicensesPath = join(
			process.cwd(),
			"public",
			"documents",
			"drivers-licenses",
		);
		const files = await readdir(driversLicensesPath);

		// Filter for image files only
		const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
		const imageFiles = files.filter((file) =>
			imageExtensions.some((ext) => file.toLowerCase().endsWith(ext)),
		);

		return NextResponse.json(imageFiles);
	} catch (error) {
		console.error("Error reading drivers licenses directory:", error);
		return NextResponse.json(
			{ error: "Failed to read drivers licenses directory" },
			{ status: 500 },
		);
	}
}
