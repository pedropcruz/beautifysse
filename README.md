# Beautify Event Stream

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Like Beautify JSON, but for Event Streams.

## About

Beautify Event Stream is a debugging and visualization tool for Server-Sent Events (SSE). Raw SSE output is difficult to read and debug, especially when dealing with minified JSON or AI streaming responses. This tool parses and formats streams into a human-readable structure with syntax highlighting and advanced filtering capabilities.

Perfect for debugging:
- Vercel AI SDK streams
- OpenAI streaming responses
- Custom SSE implementations
- Live chat applications
- Real-time data feeds

## Features

- **Auto-detection**: Automatically detects Standard SSE or Vercel AI SDK format
- **JSON Formatting**: Auto-prettifies JSON payloads with syntax highlighting
- **Syntax Highlighting**: Color-coded display for better readability
- **Search & Filter**: Quickly find errors or specific events within large streams
- **Export Options**: Export parsed events to JSON, CSV, or raw text
- **Share Streams**: Generate shareable URLs to collaborate on debugging
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Event Metadata**: View event IDs, types, and size information

## Quick Start

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Paste your raw SSE stream** into the input area
2. **Auto-formatting**: The tool automatically detects the format and displays formatted output
3. **Search**: Type in the search box to highlight matching events (press Enter for next match)
4. **Export**: Click "Export" to download as JSON, CSV, or raw text
5. **Share**: Click "Share" to generate a shareable URL

## Tech Stack

- **Frontend**: Nuxt 4, Vue 3, Nuxt UI
- **Backend**: Nuxt Server Routes
- **Runtime**: Bun
- **Database**: PostgreSQL
- **Deployment**: Cloudflare Pages
- **Testing**: Vitest, Playwright
- **Language**: TypeScript

## Development

### Install Dependencies
```bash
bun install
```

### Development Server
```bash
bun dev
```

### Build for Production
```bash
bun run build
```

### Run Tests
```bash
bun test
```

### Lint & Typecheck
```bash
bun lint
bun typecheck
```

## Contributing

If you find any bugs or have suggestions for new features, please open a pull request!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Made with ❤️ by [Pedro Cruz](https://pedropcruz.pt)
