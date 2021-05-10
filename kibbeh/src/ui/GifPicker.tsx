
import React, { Component, useEffect, useState } from 'react';
import { Input } from './Input';
import { Gif } from './Gif';
import { GifResponse } from '@dogehouse/kebab/lib/entities';
import { giphy } from '@dogehouse/kebab/lib/http/giphy';
import { http } from '@dogehouse/kebab/lib/index';
import { useGifPickerStore } from '../global-stores/useGifPickerStore';
import { useTypeSafeTranslation } from '../shared-hooks/useTypeSafeTranslation';
import { SearchBar } from './Search/SearchBar';

interface RoomChatGifSearchProps {
}

export const GifPicker: React.FC<RoomChatGifSearchProps> = () => {
    const [gifResults, setGifResults] = useState(new Array<GifResponse>());

    const {
        setQuery,
        toggle,
        query,
    } = useGifPickerStore();
    const { t } = useTypeSafeTranslation();
    const conn = http;
    // <Input inputCss='form__input'
    // value={gifSearch}
    // changed={(e) => {
    //     setGifSearch(e.target.value);
    //     clearTimeout(timeout);
    //     timeout = setTimeout(() => {
    //         props.searchGifHandler(e.target.value);
    //     }, 1500);

    // }}
    // elementConfig={{
    //     placeholder: 'Search for gif'
    // }} />
    //        const [gifSearch, setGifSearch] = useState('');
    //     <Input
    //     value={query}
    //     onChange={(e) => setQuery(e.target.value)}
    //     autoComplete='off'
    //     placeholder={t("modules.roomChat.queryGif")}
    // />
    const trendingGifs = (callBack: (response: GifResponse[]) => void) => {
        giphy(conn.create({
            baseUrl: 'https://api.giphy.com/v1/gifs/'
        })).trendingGifs()
            .then(resp => callBack(resp.data))
            .catch(err => {
                console.error(err);
            });
    }

    useEffect(() => {
        trendingGifs(setGifResults);
    }, []);

    const gifClick = (id: string) => {

    }

    if (!toggle) return null;

    return (
        <div className=''>
            <div className="flex items-stretch">
                <div className="flex-1">
                    <div className="flex flex-1 lg:mr-0 items-center bg-primary-700 rounded-8">
                        <SearchBar
                            value={query}
                            placeholder={t("modules.roomChat.queryGif")}
                            onChange={(e) => setQuery(e.target.value)}
                            autoComplete='off'
                        />

                    </div>


                </div>
            </div>
            <div
                className={`flex bg-primary-700 rounded-8 flex flex-row flex-grow p-1 max-h-24 pt-2 px-2 mb-1 absolute bottom-full w-full`}
                data-testid="gif-picker"
            >



                <div
                    className={`flex grid grid-cols-2 w-full pr-3 gap-2 max-h-16 overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded-xl scrollbar-thumb-primary-800`}
                >
                    {gifResults.map((x) => {
                        return <Gif
                            key={x.id}
                            id={x.id}
                            srcGif={x.images.original.url}
                            srcStill={x.images.original_still.url}
                            title={x.title}
                            enabledGif={false}
                            togglable={true}
                            className='cursor-pointer'
                            clickHandler={gifClick}
                        />
                    })}
                </div>
            </div>
        </div>
    );

}