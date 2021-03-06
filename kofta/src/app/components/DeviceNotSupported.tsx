import React from "react";
import { CenterLayout } from "./CenterLayout";
import { RegularAnchor } from "./RegularAnchor";
import { Wrapper } from "./Wrapper";

interface DeviceNotSupportedProps {}

export const DeviceNotSupported: React.FC<DeviceNotSupportedProps> = ({}) => {
	return (
		<div className="flex items-center h-full justify-around">
			<CenterLayout>
				<Wrapper>
					<div className={`mb-4 mt-8 text-xl`}>
						Your device is currently not supported. You can create an{" "}
						<RegularAnchor href="https://github.com/benawad/dogehouse/issues">
							issue on GitHub
						</RegularAnchor>{" "}
						and I will try adding support for your device.
					</div>
				</Wrapper>
			</CenterLayout>
		</div>
	);
};
