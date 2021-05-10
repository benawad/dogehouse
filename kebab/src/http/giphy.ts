import { GifResponse } from "../entities";
import { create } from "../http/raw";



export const giphy = () => {
    const conn = create({
        baseUrl: 'https://api.giphy.com/v1/gifs/'
    });
    return {
        trendingGifs: () =>
            conn.request('GET', 'trending?api_key=4bEdDr78WtvmaSX1Ej58K5gRCeKUHq92&limit=25&rating=g') as Promise<{
                data: GifResponse[]
            }>,
        queryGifs: (query: string) =>
            conn.request('GET', `search?api_key=4bEdDr78WtvmaSX1Ej58K5gRCeKUHq92&q=${query}&limit=25&rating=g`) as Promise<{
                data: GifResponse[]
            }>
    };
};
