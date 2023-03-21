# mathpuzzle

[Demo](https://scipuzzle.ru)

## Project setup
1. Run:
```
npm install
```
2. Change `apiUrl` param in `src/settings.js` to your API URL
3. Get your TinyMCE key [https://www.tiny.cloud](here) (login or register)
4. Create `src/tinyMCEKey.js` file exporting your TinyMCE key as default

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Development
### HTML
- Use `<router-link>` instead of `<a>`
- Use `to` instead of `href`
