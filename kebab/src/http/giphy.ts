import { GifRating, GifResponse } from "../entities";
import { create } from "../http/raw";

export const giphy = (apiKey: string) => ({
  trendingGifs: (limit: number, rating: GifRating) =>
    create({
      baseUrl: 'https://api.giphy.com/v1/gifs/'
    }).request('GET', `trending?api_key=${apiKey}&limit=${limit}&rating=${rating}`) as Promise<{
      data: GifResponse[]
    }>,
  queryGifs: (query: string, limit: number, rating: GifRating) =>
    create({
      baseUrl: 'https://api.giphy.com/v1/gifs/'
    }).request('GET', `search?api_key=${apiKey}&q=${query}&limit=${limit}&rating=${rating}`) as Promise<{
      data: GifResponse[]
    }>
});
