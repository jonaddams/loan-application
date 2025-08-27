"use client";

import { useEffect, useRef } from "react";

interface FormField {
	name: string;
	type: string;
	required: boolean;
	value: string | null;
}

interface ViewerProps {
	document: string | ArrayBuffer;
	onFormFieldsLoaded?: (formFields: FormField[]) => void;
}

export default function Viewer({ document, onFormFieldsLoaded }: ViewerProps) {
	const containerRef = useRef(null);

	useEffect(() => {
		const container = containerRef.current;

		const { NutrientViewer } = window;
		if (container && NutrientViewer) {
			NutrientViewer.load({
				container,
				document: document,
			}).then(async (instance) => {
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
						const field = formField as { name: string; required: boolean; value?: string };
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
	}, [document, onFormFieldsLoaded]);

	// You must set the container height and width
	return <div ref={containerRef} style={{ height: "100vh", width: "100%" }} />;
}
