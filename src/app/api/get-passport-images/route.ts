import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const passportsPath = join(
			process.cwd(),
			"public",
			"documents",
			"passports",
		);
		const files = await readdir(passportsPath);

		// Filter for image files only
		const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
		const imageFiles = files.filter((file) =>
			imageExtensions.some((ext) => file.toLowerCase().endsWith(ext)),
		);

		return NextResponse.json(imageFiles);
	} catch (error) {
		console.error("Error reading passports directory:", error);
		return NextResponse.json(
			{ error: "Failed to read passports directory" },
			{ status: 500 },
		);
	}
}
