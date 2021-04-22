import { useEffect, useState } from "react";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { Button } from "../ui/Button";
import { HeaderController } from "../modules/display/HeaderController";

const links: any = {
  "Mac OS":
    "https://github.com/benawad/dogehouse/releases/download/{{tag}}/DogeHouse-{{version}}.dmg",
  Windows:
    "https://github.com/benawad/dogehouse/releases/download/{{tag}}/DogeHouse-Setup-{{version}}.exe",
  Linux:
    "https://github.com/benawad/dogehouse/releases/download/{{tag}}/DogeHouse-{{version}}.AppImage",
};

function getOS() {
  let isWindows = false;
  let isMac = false;
  let isLinux = false;
  let isPhone = false;

  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const macosPlatforms = [
    "Macintosh",
    "MacIntel",
    "MacPPC",
    "Mac68K",
    "darwin",
  ];
  const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
  const iosPlatforms = ["iPhone", "iPad", "iPod"];

  let os = "Windows";
  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "Mac OS";
    isMac = true;
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS";
    isPhone = true;
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows";
    isWindows = true;
  } else if (/Android/.test(userAgent)) {
    os = "Android";
    isPhone = true;
  } else if (/Linux/.test(platform)) {
    os = "Linux";
    isLinux = true;
  }

  return { isWindows, isMac, isLinux, isPhone, os };
}

export default function Download() {
  const [downloadFailed, setDownloadFailed] = useState(false);
  const { t } = useTypeSafeTranslation();
  useEffect(() => {
    const os = getOS();
    if (!os.isPhone) {
      let res = false;
      const xmlHttp = new XMLHttpRequest();
      xmlHttp.open(
        "GET",
        "https://api.github.com/repos/benawad/dogehouse/releases/latest"
      );
      xmlHttp.send(null);
      xmlHttp.onreadystatechange = () => {
        if (xmlHttp.responseText && !res) {
          res = true;
          const data = JSON.parse(xmlHttp.responseText);
          const tag = data.tag_name;
          if (tag) {
            const version = tag.replace("version", "");
            const link = links[os.os]
              .replace("{{tag}}", tag)
              .replace("{{version}}", version);
            window.location.href = link;
          } else {
            setDownloadFailed(true);
          }
        }
      };
    } else {
      setDownloadFailed(true);
    }
  }, []);

  return (
    <>
      <HeaderController title="Download" />
      <div className="flex w-full h-full flex-col items-center justify-center p-8">
        <h4 className="text-primary-100 mb-4">
          {downloadFailed
            ? t("pages.download.failed")
            : t("pages.download.starting")}
        </h4>
        {downloadFailed ? (
          <Button
            onClick={() => {
              window.location.href =
                "https://github.com/benawad/dogehouse/releases/latest";
            }}
          >
            {t("pages.download.visit_gh")}
          </Button>
        ) : null}
      </div>
    </>
  );
}
