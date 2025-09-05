"use client";

import { useEffect, useRef, useMemo, useState } from "react";

interface FormField {
	name: string;
	type: string;
	required: boolean;
	value: string | null;
}

interface FieldData {
	name: string;
	type: string;
	required: boolean;
	value: string | null;
	extractedValue?: string | null;
	hasMatch?: boolean;
}

interface FormFieldValues {
	[fieldName: string]: string;
}

interface ViewerInstance {
	getFormFields: () => Promise<unknown>;
	setFormFieldValues: (values: FormFieldValues) => void;
	update: (formFieldValue: unknown) => Promise<unknown>;
}

interface ViewerProps {
	document: string | ArrayBuffer;
	onFormFieldsLoaded?: (formFields: FormField[]) => void;
	fieldData?: FieldData[];
	toolbarItems?: Array<{ type: string }>;
}

export default function Viewer({
	document,
	onFormFieldsLoaded,
	fieldData,
	toolbarItems,
}: ViewerProps) {
	const containerRef = useRef(null);
	const instanceRef = useRef<ViewerInstance | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const memoizedToolbarItems = useMemo(
		() => toolbarItems,
		[toolbarItems],
	);

	const fillFormFieldsWithData = async (
		instance: ViewerInstance,
		fieldData: FieldData[],
	) => {
		const { NutrientViewer } = window;
		if (!NutrientViewer?.FormFieldValue) {
			console.error("❌ NutrientViewer.FormFieldValue not available");
			return;
		}

		let filledCount = 0;
		for (const field of fieldData) {
			if (field.hasMatch && field.extractedValue) {
				try {
					const formFieldValue = new NutrientViewer.FormFieldValue({
						name: field.name,
						value: field.extractedValue,
					});

					await instance.update(formFieldValue);
					console.log(
						`✅ Filled field '${field.name}' with value '${field.extractedValue}'`,
					);
					filledCount++;
				} catch (error) {
					console.error(`❌ Error filling field '${field.name}':`, error);
				}
			}
		}
		console.log(`🎉 Successfully filled ${filledCount} form fields`);
	};

	useEffect(() => {
		// Reset error state for new documents
		setError(null);
		
		// Check for missing pay stub
		if (document.includes('joseph-sample-sample-pay-stub.pdf')) {
			setIsLoading(false);
			setError("Document Unavailable");
			return;
		}

		let timeoutId: NodeJS.Timeout;
		
		const tryLoad = () => {
			const container = containerRef.current;
			const { NutrientViewer } = window;
			
			console.log("🔍 Trying to load - Container:", !!container, "NutrientViewer:", !!NutrientViewer);
			
			if (container && NutrientViewer) {
				const baseConfig = {
					container: container as HTMLElement,
					document: document,
				};

				const loadConfig = memoizedToolbarItems 
					? { ...baseConfig, toolbarItems: memoizedToolbarItems }
					: baseConfig;

				(NutrientViewer.load as any)(loadConfig).then(async (instance: any) => {
					instanceRef.current = instance;
					setIsLoading(false);
					
					try {
						const formFields = await instance.getFormFields();
						console.log("📋 PDF Form Fields:", formFields);

						const getFormFieldType = (formField: unknown) => {
							const { NutrientViewer } = window;
							if (!NutrientViewer?.FormFields) return "Unknown";

							if (formField instanceof NutrientViewer.FormFields.TextFormField)
								return "Text Field";
							if (formField instanceof NutrientViewer.FormFields.CheckBoxFormField)
								return "Checkbox";
							if (formField instanceof NutrientViewer.FormFields.RadioButtonFormField)
								return "Radio Button";
							if (formField instanceof NutrientViewer.FormFields.ComboBoxFormField)
								return "Combo Box";
							if (formField instanceof NutrientViewer.FormFields.ListBoxFormField)
								return "List Box";
							if (formField instanceof NutrientViewer.FormFields.ButtonFormField)
								return "Button";
							if (formField instanceof NutrientViewer.FormFields.SignatureFormField)
								return "Signature";

							return "Unknown";
						};

						const formFieldsArray: FormField[] = [];
						formFields.forEach((formField: unknown) => {
							const field = formField as {
								name: string;
								required: boolean;
								value?: string;
							};
							formFieldsArray.push({
								name: field.name,
								type: getFormFieldType(formField),
								required: field.required,
								value: field.value || null,
							});
						});

						if (onFormFieldsLoaded) {
							onFormFieldsLoaded(formFieldsArray);
						}
					} catch (error) {
						console.error("❌ Error getting form fields:", error);
					}
				}).catch((error: any) => {
					setIsLoading(false);
					console.error("❌ Error loading document:", error);
					setError("Failed to load document. Please refresh the page and try again.");
				});
			} else {
				timeoutId = setTimeout(tryLoad, 100);
			}
		};

		// Start trying to load after a short delay
		timeoutId = setTimeout(tryLoad, 100);

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			const { NutrientViewer } = window;
			if (containerRef.current && NutrientViewer) {
				NutrientViewer.unload(containerRef.current);
			}
		};
	}, [document, onFormFieldsLoaded, memoizedToolbarItems]);

	useEffect(() => {
		if (fieldData && fieldData.length > 0 && instanceRef.current) {
			console.log("🔧 Filling form fields with extracted data...");
			fillFormFieldsWithData(instanceRef.current, fieldData);
		}
	}, [fieldData]);

	if (error) {
		return (
			<div 
				style={{ height: "100vh", width: "100%" }} 
				className="flex items-center justify-center bg-gray-50"
			>
				<div className="text-center p-8 max-w-md">
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
						<div className="flex items-center">
							<svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
							</svg>
							<div>
								<h3 className="font-semibold text-sm">Document Unavailable</h3>
							</div>
						</div>
					</div>
					<p className="text-gray-600 text-sm">
						{typeof document === 'string' ? document.split('/').pop() : 'Document file'}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div style={{ position: "relative", height: "100vh", width: "100%" }}>
			<div ref={containerRef} style={{ height: "100vh", width: "100%" }} />
			{isLoading && (
				<div 
					style={{ 
						position: "absolute", 
						top: 0, 
						left: 0, 
						height: "100vh", 
						width: "100%",
						backgroundColor: "rgba(249, 250, 251, 0.95)",
						zIndex: 1000
					}} 
					className="flex items-center justify-center"
				>
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
						<p className="text-gray-600 text-sm">Loading document...</p>
					</div>
				</div>
			)}
		</div>
	);
}