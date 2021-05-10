import { GifResponse } from "../entities";
import { Http } from "./raw";

export const giphy = (http: Http) => {
    return {
        trendingGifs: () =>
            http.request('GET', 'trending?api_key=4bEdDr78WtvmaSX1Ej58K5gRCeKUHq92&limit=25&rating=g') as Promise<{
                data: GifResponse[]
            }>,
    };
};
