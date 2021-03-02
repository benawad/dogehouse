import React from "react";
import Select from "react-dropdown-select";
import { useTranslation } from "react-i18next";

interface LanguageSelectorProps<T> {
    options?: T[];
}

const dropDownStyles = {
    color: "#000000",
    backgroundColor: "#FFFFFF"
}

const defaultValue = { value: "en", label: "en" };

export const LanguageSelector: React.FC<LanguageSelectorProps<{}>> = ({
    options = [
        { value: "en", label: "en" },
        { value: "de", label: "de" },
        { value: "es", label: "es" },
        { value: "fr", label: "fr" },
        { value: "pt", label: "pt" },
        { value: "hu", label: "hu" }
    ]
}) => {
    const { i18n } = useTranslation();
    const changeLanguage = (lng: any) => {
        i18n.changeLanguage(lng[0].value);
    };

    return (
        <Select
            options={options}
            values={[defaultValue]}
            onChange={lng => changeLanguage(lng)}
            style={dropDownStyles}
            dropdownPosition={"top"}
        />
    );
};
