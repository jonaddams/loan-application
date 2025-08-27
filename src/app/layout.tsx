import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Nutrient AI Document Processing Loan Application POC",
	description:
		"AI-powered document classification and data extraction for loan applications",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const webSDKVersion = process.env.NEXT_PUBLIC_WEB_SDK_VERSION || "1.5.0";
	const cdnUrl = `https://cdn.cloud.pspdfkit.com/pspdfkit-web@${webSDKVersion}/nutrient-viewer.js`;
	return (
		<html lang="en">
			<head>
				{/* DNS prefetch and preconnect for faster CDN connection */}
				<link rel="dns-prefetch" href="//cdn.cloud.pspdfkit.com" />
				<link
					rel="preconnect"
					href="https://cdn.cloud.pspdfkit.com"
					crossOrigin=""
				/>

				{/* Preload the script to start downloading immediately */}
				<link rel="preload" href={cdnUrl} as="script" crossOrigin="" />

				{/* Load the script before page becomes interactive */}
				<Script src={cdnUrl} strategy="beforeInteractive" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
