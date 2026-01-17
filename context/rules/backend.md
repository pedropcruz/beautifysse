# Backend / API Rules

*   **Nuxt Server**: Use Nuxt 4 server routes/middleware.
*   **Logic**: Keep API handlers thin. Move logic to composables or server utils (which must be unit tested).
*   **Types**: Share types from `types/` where applicable (isomorphic).
