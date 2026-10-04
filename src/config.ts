export default {
  GITHUB_REPO: "",
  DISCORD_LINK: "",
  VITE_API_HOST: import.meta.env.VITE_API_HOST || "https://api.opendota.com",
  // Необязательный ключ API — повышает лимит запросов
  VITE_API_KEY: import.meta.env.VITE_API_KEY || "",
  VITE_IMAGE_CDN:
    import.meta.env.VITE_IMAGE_CDN || "https://cdn.cloudflare.steamstatic.com",
  VITE_ENABLE_RIVALRY: import.meta.env.VITE_ENABLE_RIVALRY,
  VITE_ENABLE_GOSUAI: import.meta.env.VITE_ENABLE_GOSUAI,
};
