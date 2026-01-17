# Project Vision: Beautify Event Stream

## The Idea
"Like Beautify JSON, but for Event Streams."
Event streams (SSE) can be hard to read and debug. This tool parses and formatting them into a human-readable structure.

## Goals
1.  **Utility**: Make SSE debugging effortless.
2.  **Monetization**: Build a high-quality product suitable for paid tiers or features in the future.

## Market Analysis
*   **Problem**: SSE (Server-Sent Events) raw output is difficult to read (`data: ...`), especially with minified JSON or AI streams.
*   **Competitors**:
    *   *Libraries*: Many NPM packages (`fetch-event-source`, `better-sse`), but these are for code, not visualization.
    *   *Tools*: Postman/Insomnia (Heavy, not focused on "beautifying"), Curl (Zero UI), Online Testers (Basic lists).
*   **Unique Value Proposition**: "Beautify JSON" for Streams.
    *   Auto-detect and format JSON payloads within streams.
    *   Syntax highlighting.
    *   Time deltas between chunks (performance debugging).
    *   Clean, focused UI vs "Kitchen Sink" API Clients.

## Key Features (Initial)
*   **Input**: Paste area for RAW SSE streams. (No live connection in MVP, focused on analyzing dumps).
*   **Viewer**: Split view (Input | Output).
*   **Formatting**: Auto-prettify JSON chunks.
*   **Agents**: Helper agents to parse specific stream formats (e.g., Vercel AI SDK, OpenAI, generic).
