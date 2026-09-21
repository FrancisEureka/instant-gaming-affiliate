import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://eurekagaming.com.br",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
  ]
}
