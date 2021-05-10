import { GifResponse } from "../entities";
import { create } from "../http/raw";



export const giphy = () => {

    return {
        trendingGifs: () =>
            create({
                baseUrl: 'https://api.giphy.com/v1/gifs/'
            }).request('GET', 'trending?api_key=4bEdDr78WtvmaSX1Ej58K5gRCeKUHq92&limit=25&rating=g') as Promise<{
                data: GifResponse[]
            }>,
        queryGifs: (query: string) =>
            create({
                baseUrl: 'https://api.giphy.com/v1/gifs/'
            }).request('GET', `search?api_key=4bEdDr78WtvmaSX1Ej58K5gRCeKUHq92&q=${query}&limit=25&rating=g`) as Promise<{
                data: GifResponse[]
            }>
    };
};
