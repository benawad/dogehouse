import React from "react";
import { CenterLayout } from "./CenterLayout";
import { RegularAnchor } from "./RegularAnchor";
import { Wrapper } from "./Wrapper";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

interface DeviceNotSupportedProps {}

export const DeviceNotSupported: React.FC<DeviceNotSupportedProps> = ({}) => {
	const { t } = useTypeSafeTranslation();

	return (
		<div className="flex items-center h-full justify-around">
			<CenterLayout>
				<Wrapper>
					<div className={`mb-4 mt-8 text-xl`}>
						{t("components.deviceNotSupported.notSupported")}{" "}
						<RegularAnchor href="https://github.com/benawad/dogehouse/issues">
							{t("components.deviceNotSupported.linkText")}
						</RegularAnchor>{" "}
						{t("components.deviceNotSupported.addSupport")}
					</div>
				</Wrapper>
			</CenterLayout>
		</div>
	);
};
