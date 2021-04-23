import { useEffect, useState } from "react";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { Button } from "../ui/Button";
import { HeaderController } from "../modules/display/HeaderController";

const links = [
  "https://github.com/benawad/dogehouse/releases/download/{{tag}}/DogeHouse-Setup-{{version}}.exe", // windows
  "https://github.com/benawad/dogehouse/releases/download/{{tag}}/DogeHouse-{{version}}.dmg", // macOS
  "https://github.com/benawad/dogehouse/releases/download/{{tag}}/DogeHouse-{{version}}.AppImage", // linux
];

const platforms = ["Windows", "macOS", "Linux"];

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
  isWindows = true;
  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "macOS";
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

function OtherPlatformButton(props: {
  platform: string;
  currentPlatform: number;
  downloadLinks: string[];
}) {
  const { t } = useTypeSafeTranslation();
  const index = platforms.indexOf(props.platform);
  const isCurrent = index === props.currentPlatform;
  return !isCurrent ? (
    <Button
      color="secondary"
      className="my-2"
      onClick={() => {
        window.location.href = props.downloadLinks[index];
      }}
    >
      {t("pages.download.download_for").replace("%platform%", platforms[index])}
    </Button>
  ) : null;
}

export default function Download() {
  const [loaded, setLoaded] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState(links);
  const [currentPlatform, setCurrentPlatform] = useState(0);
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
          try {
            const data = JSON.parse(xmlHttp.responseText);
            res = true;
            const tag = data.tag_name;
            if (tag) {
              const version = tag.replace("v", "");
              links.forEach((l) => {
                const i = links.indexOf(l);
                links[i] = l
                  .replace("{{tag}}", tag)
                  .replace("{{version}}", version);
              });
              setDownloadLinks(links);
              setCurrentPlatform(platforms.indexOf(os.os));
              setLoaded(true);
              setDownloadFailed(false);
            } else {
              setLoaded(true);
              setDownloadFailed(true);
            }
          } catch (e) {
            res = false;
            setDownloadFailed(true);
          }
        }
      };
    } else {
      setLoaded(true);
      setDownloadFailed(true);
    }
  }, []);

  let text = "";

  if (!loaded) {
    text = t("common.loading");
  } else if (downloadFailed) {
    text = t("pages.download.failed");
  } else {
    text = t("pages.download.prompt");
  }

  return (
    <>
      <HeaderController title="Download" />
      <div className="flex w-full h-full flex-col items-center justify-center p-8">
        <h4 className="text-primary-100 mb-4">{text}</h4>

        {loaded ? (
          <Button
            onClick={() => {
              window.location.href = downloadFailed
                ? "https://github.com/benawad/dogehouse/releases/latest"
                : downloadLinks[currentPlatform];
            }}
          >
            {downloadFailed
              ? t("pages.download.visit_gh")
              : t("pages.download.download_for").replace(
                  "%platform%",
                  platforms[currentPlatform]
                )}
          </Button>
        ) : null}

        {!loaded || downloadFailed ? null : (
          <div className="flex lg:flex-row md:flex-col sm:flex-col lg:space-x-4 p-2 items-center">
            {platforms &&
              platforms.map((platform) => (
                <OtherPlatformButton
                  platform={platform}
                  currentPlatform={currentPlatform}
                  downloadLinks={downloadLinks}
                  key={platform}
                />
              ))}
          </div>
        )}
      </div>
    </>
  );
}
