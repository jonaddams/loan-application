import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const bankStatementsPath = join(
			process.cwd(),
			"public",
			"documents",
			"bank-statements",
		);
		const files = await readdir(bankStatementsPath);

		// Filter for document files (including PDFs and images)
		const documentExtensions = [
			".jpg",
			".jpeg",
			".png",
			".gif",
			".webp",
			".pdf",
			".docx",
			".tiff",
		];
		const documentFiles = files.filter((file) =>
			documentExtensions.some((ext) => file.toLowerCase().endsWith(ext)),
		);

		return NextResponse.json(documentFiles);
	} catch (error) {
		console.error("Error reading bank statements directory:", error);
		return NextResponse.json(
			{ error: "Failed to read bank statements directory" },
			{ status: 500 },
		);
	}
}
