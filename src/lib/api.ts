import type {
	DocumentTemplate,
	ProcessDocumentResponse,
	ValidationMethod,
} from "@/types";

export interface PredefinedTemplate {
	name: string;
	fields: {
		name: string;
		semanticDescription: string;
		format: "Text" | "Number" | "Date" | "Currency";
		validationMethod: ValidationMethod | null;
	}[];
	identifier: string;
	semanticDescription: string;
	componentId?: string; // Optional componentId if template is already registered
}

export interface RegisterComponentResponse {
	componentId: string;
}

/**
 * Get predefined templates from the API
 */
export async function getPredefinedTemplates(): Promise<PredefinedTemplate[]> {
	const response = await fetch("/api/get-templates");

	if (!response.ok) {
		throw new Error(
			`Failed to get predefined templates: ${response.statusText}`,
		);
	}

	return response.json();
}

/**
 * Register component with templates
 */
export async function registerComponent(
	templates: DocumentTemplate[],
): Promise<RegisterComponentResponse> {
	const response = await fetch("/api/register-component", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ templates }),
	});

	if (!response.ok) {
		throw new Error(`Failed to register component: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Process document with given component ID
 */
export async function processDocument(
	file: File,
	componentId: string,
): Promise<ProcessDocumentResponse> {
	console.log(
		"🚀 UPDATED processDocument function called at",
		new Date().toISOString(),
	);
	const formData = new FormData();
	formData.append("file", file);
	formData.append("componentId", componentId);

	console.log("Making request to /api/process-doc with:", {
		file: file.name,
		componentId,
		url: "/api/process-doc",
		timestamp: new Date().toISOString(),
	});

	const response = await fetch("/api/process-doc", {
		method: "POST",
		body: formData,
	});

	console.log("Response status:", response.status, response.statusText);

	if (!response.ok) {
		throw new Error(`Failed to process document: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Get list of driver license images from the server
 */
export async function getDriverLicenseImages(): Promise<string[]> {
	const response = await fetch("/api/get-driver-license-images");

	if (!response.ok) {
		throw new Error(
			`Failed to get driver license images: ${response.statusText}`,
		);
	}

	return response.json();
}

/**
 * Get list of passport images from the server
 */
export async function getPassportImages(): Promise<string[]> {
	const response = await fetch("/api/get-passport-images");

	if (!response.ok) {
		throw new Error(`Failed to get passport images: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Get list of bank statement documents from the server
 */
export async function getBankStatementImages(): Promise<string[]> {
	const response = await fetch("/api/get-bank-statement-images");

	if (!response.ok) {
		throw new Error(
			`Failed to get bank statement documents: ${response.statusText}`,
		);
	}

	return response.json();
}

/**
 * Convert image URL to File object for API processing
 */
export async function urlToFile(url: string, filename: string): Promise<File> {
	const response = await fetch(url);
	const blob = await response.blob();
	return new File([blob], filename, { type: blob.type });
}
