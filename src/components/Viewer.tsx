"use client";

import { useEffect, useRef, useMemo } from "react";

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

// Basic type for Nutrient Viewer instance
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

	// Memoize toolbarItems to prevent infinite re-renders
	const memoizedToolbarItems = useMemo(
		() => toolbarItems,
		[toolbarItems],
	);

	// Function to fill form fields with extracted data
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
		const container = containerRef.current;

		const { NutrientViewer } = window;
		if (container && NutrientViewer) {
			// Use object spreading to avoid TypeScript conflicts with strict typing
			const baseConfig = {
				container: container as HTMLElement,
				document: document,
			};

			const loadConfig = memoizedToolbarItems 
				? { ...baseConfig, toolbarItems: memoizedToolbarItems }
				: baseConfig;

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(NutrientViewer.load as any)(loadConfig).then(async (instance: any) => {
				instanceRef.current = instance;
				try {
					// Get form fields from the PDF (returns ImmutableJS List)
					const formFields = await instance.getFormFields();
					console.log("📋 PDF Form Fields:", formFields);
					console.log("📊 Total form fields:", formFields.size);

					// Helper function to determine form field type
					const getFormFieldType = (formField: unknown) => {
						const { NutrientViewer } = window;
						if (!NutrientViewer?.FormFields) return "Unknown";

						if (formField instanceof NutrientViewer.FormFields.TextFormField)
							return "Text Field";
						if (
							formField instanceof NutrientViewer.FormFields.CheckBoxFormField
						)
							return "Checkbox";
						if (
							formField instanceof
							NutrientViewer.FormFields.RadioButtonFormField
						)
							return "Radio Button";
						if (
							formField instanceof NutrientViewer.FormFields.ComboBoxFormField
						)
							return "Combo Box";
						if (formField instanceof NutrientViewer.FormFields.ListBoxFormField)
							return "List Box";
						if (formField instanceof NutrientViewer.FormFields.ButtonFormField)
							return "Button";
						if (
							formField instanceof NutrientViewer.FormFields.SignatureFormField
						)
							return "Signature";

						return "Unknown";
					};

					// Convert ImmutableJS List to regular JavaScript array
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

					// Pass form fields back to parent component
					if (onFormFieldsLoaded) {
						onFormFieldsLoaded(formFieldsArray);
					}
				} catch (error) {
					console.error("❌ Error getting form fields:", error);
				}
			});
		}

		return () => {
			NutrientViewer?.unload(container);
		};
	}, [document, onFormFieldsLoaded, memoizedToolbarItems]);

	// Separate effect to fill form fields when fieldData is available
	useEffect(() => {
		if (fieldData && fieldData.length > 0 && instanceRef.current) {
			console.log("🔧 Filling form fields with extracted data...");
			fillFormFieldsWithData(instanceRef.current, fieldData);
		}
	}, [fieldData]);

	// You must set the container height and width
	return <div ref={containerRef} style={{ height: "100vh", width: "100%" }} />;
}
