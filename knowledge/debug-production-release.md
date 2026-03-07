Sometimes it's needed to debug a production release just run this command inside `apps/mobile`:

```bash
bun expo run:ios --device --configuration Release
```

## App crashes immediately on open

That happened once because of environment variables missing. Expo doesn't show proper logs so you can do this:

- cd into `ios/` folder and open XCode workspace with `open MercadoFcil.xcworkspace`.
- Go to **Product** > **Scheme** > **Edit scheme** and choose `Release` under **Info** > **Build configuration**

Now you'll be able to see logs properly inside XCode