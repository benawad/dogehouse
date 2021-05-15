import { useEffect, useState } from "react";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { Button } from "../ui/Button";
import { HeaderController } from "../modules/display/HeaderController";
import { LgLogo } from "../icons";

const links = [
  "https://github.com/benawad/dogehouse/releases/download/{{tag}}/DogeHouse-Setup-{{version}}.exe", // windows
  "https://github.com/benawad/dogehouse/releases/download/{{tag}}/DogeHouse-{{version}}.dmg", // macOS
  "https://github.com/benawad/dogehouse/releases/download/{{tag}}/DogeHouse-{{version}}.AppImage", // linux
  "https://github.com/benawad/dogehouse/releases/download/{{tag}}/dogehouse_{{version}}_amd64.deb", // linux deb
  "https://github.com/benawad/dogehouse/releases/download/{{tag}}/DogeHouse-{{version}}.tar.gz", // linux targz
  "https://github.com/benawad/dogehouse/releases/download/{{tag}}/DogeHouse-{{version}}.x86_64.rpm", // linux rpm
];

const platforms = ["Windows", "macOS", "Linux", "Linux", "Linux", "Linux"]; // Sorted respectively

const extentions = [".exe", ".dmg", ".AppImage", ".deb", ".tar.gz", ".rpm"];

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
  linuxed: number;
}) {
  const { t } = useTypeSafeTranslation();
  const index = platforms.indexOf(props.platform);
  const isCurrent = index === props.currentPlatform;
  let add = 0;
  if (platforms[index] === "Linux") {
    add = props.linuxed;
  }
  return !isCurrent ? (
    <Button
      color="secondary"
      className="my-2"
      onClick={() => {
        window.location.href = props.downloadLinks[index + add];
      }}
    >
      {t("pages.download.download_for")
        .replace("%platform%", platforms[index + add])
        .replace("%ext%", extentions[index + add])}
    </Button>
  ) : null;
}

function CurrentPlatformButton(props: {
  platform: number;
  downloadLinks: string[];
  linuxed: number;
}) {
  const { t } = useTypeSafeTranslation();
  const plat = platforms[props.platform];
  let add = 0;
  if (plat === "Linux") {
    add = props.linuxed;
  }
  return (
    <Button
      onClick={() => {
        window.location.href = props.downloadLinks[props.platform + add];
      }}
    >
      {t("pages.download.download_for")
        .replace("%platform%", plat)
        .replace("%ext%", extentions[props.platform + add])}
    </Button>
  );
}

export default function Download() {
  const [loaded, setLoaded] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState(links);
  const [currentPlatform, setCurrentPlatform] = useState(0);
  const [downloadFailed, setDownloadFailed] = useState(false);

  let linuxed = -1;

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

  let button = null;

  if (loaded) {
    if (downloadFailed) {
      button = (
        <Button
          onClick={() => {
            window.location.href =
              "https://github.com/benawad/dogehouse/releases/latest";
          }}
        >
          {t("pages.download.visit_gh")}
        </Button>
      );
    } else {
      button = (
        <div className="flex lg:flex-row md:flex-col sm:flex-col lg:space-x-4 p-2 items-center">
          {platforms.map((platform) => {
            if (platform === platforms[currentPlatform]) {
              if (platform === "Linux") linuxed++;
              return (
                <CurrentPlatformButton
                  platform={currentPlatform}
                  downloadLinks={downloadLinks}
                  linuxed={linuxed}
                />
              );
            } else {
              return null;
            }
          })}
        </div>
      );
    }
  }

  return (
    <>
      <HeaderController title="Download" />
      <div className="flex w-full h-full flex-col items-center justify-center p-8">
        <h4 className="text-primary-100 mb-4">{text}</h4>

        {button}

        {!loaded || downloadFailed ? null : (
          <div className="flex lg:flex-row md:flex-col sm:flex-col lg:space-x-4 p-2 items-center">
            {platforms &&
              platforms.map((platform) => {
                if (platform === "Linux") linuxed++;
                return (
                  <OtherPlatformButton
                    platform={platform}
                    currentPlatform={currentPlatform}
                    downloadLinks={downloadLinks}
                    linuxed={linuxed}
                    key={`${platform}-${linuxed}`}
                  />
                );
              })}
          </div>
        )}
      </div>

      <div className="flex flex-row absolute bottom-0 w-full justify-between px-5 py-5 mt-auto items-center sm:px-7">
            <LgLogo onClick={() => {
                window.location.href =
                  "https://dogehouse.tv";
              }}/>
      </div>
    </>
  );
}
