import React from "react";

interface PageWrapperProps {}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
	return (
		<div className={`mx-auto max-w-5xl w-full h-full flex relative`}>
			{children}
		</div>
	);
};
