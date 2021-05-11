
import React, { useEffect, useState } from "react";
import { Gif } from "./Gif";
import { GifResponse } from "@dogehouse/kebab/lib/entities";
import { giphy } from "@dogehouse/kebab/lib/http/giphy";
import { useGifPickerStore } from "../global-stores/useGifPickerStore";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { SearchBar } from "./Search/SearchBar";
import { giphyApiKey } from "../lib/constants";

interface RoomChatGifSearchProps {
    selectGifHandler: (gif: GifResponse) => void
}

export const GifPicker: React.FC<RoomChatGifSearchProps> = ({
    selectGifHandler
}) => {
    const [gifResults, setGifResults] = useState([] as GifResponse[]);
    const [timer, setTimer] = useState(setTimeout(() => { }, 1000));

    const {
        setQuery,
        setToggle,
        toggle,
        query,
    } = useGifPickerStore();
    const { t } = useTypeSafeTranslation();

    const trendingGifs = (callBack: (response: GifResponse[]) => void) => {
        giphy(giphyApiKey).trendingGifs(25, "r")
            .then(resp => callBack(resp.data))
            .catch(err => {
                console.error(err);
            });
    };
    const queryGifs = (querySearch: string, callBack: (response: GifResponse[]) => void) => {
        if (querySearch.length > 0) {
            giphy(giphyApiKey).queryGifs(querySearch, 25, "r")
                .then(resp => callBack(resp.data))
                .catch(err => {
                    console.error(err);
                });
        } else {
            trendingGifs(setGifResults);
        }
    };
    useEffect(() => {
        trendingGifs(setGifResults);
        if (!toggle) {
            setQuery("");
        }
        return () => {
            setTimer(setTimeout(() => { }, 1000));
            setQuery("");
        };
    }, [
        toggle,
        setGifResults,
        setQuery,
        setTimer,
    ]);

    const gifClick = (id: string) => {
        const index = gifResults.findIndex(x => x.id === id);
        if (index > -1) {
            selectGifHandler(gifResults[index]);
        }
        setToggle(false);
    };

    if (!toggle) {
        return null;
    }

    return (
        <div className="">
            <div className="flex items-stretch">
                <div className="flex-1">
                    <div className="flex flex-1 lg:mr-0 items-center bg-primary-700 rounded-b-lg">
                        <SearchBar
                            value={query}
                            placeholder={t("modules.roomChat.queryGif")}
                            onChange={(e) => {
                                if (timer) {
                                    clearTimeout(timer);
                                    setTimer(setTimeout(() => { }, 1000));
                                }
                                setQuery(e.target.value);
                                setTimer(
                                    setTimeout(() => {
                                        queryGifs(e.target.value, setGifResults);
                                    }, 1500));
                            }}
                            autoComplete="off"
                        />

                    </div>


                </div>
            </div>
            <div
                className="flex bg-primary-700 rounded-8 flex flex-row flex-grow max-h-24 absolute bottom-full w-full"
                data-testid="gif-picker"
            >
                <div
                    className={`flex grid grid-cols-1 w-full  max-h-16 overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded-xl scrollbar-thumb-primary-800 rounded-t-lg`}
                >
                    {gifResults.map((x) => {
                        return (
                            <Gif
                                key={x.id}
                                id={x.id}
                                srcGif={x.images.original.url}
                                srcStill={x.images.original_still.url}
                                title={x.title}
                                enabledGif={true}
                                togglable={true}
                                className="cursor-pointer w-full"
                                clickHandler={gifClick}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
