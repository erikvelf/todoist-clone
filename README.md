# todoistClone React Native (learning project)

This is an [Expo](https://expo.dev) project created with
[`create-expo-app`](https://www.npmjs.com/package/create-expo-app) and I'm
learning from Simon Grimm how to create React Native apps.

This project follows
[this video tutorial](https://www.youtube.com/watch?v=_k5v0KOfNZ0) from Simon on
how to create React Native apps. Many thank for his tutorials helping others
like me becoming a better RN developer!

This Todoist clone can:

- add tasks
- add projects and delete projects
- open tasks with prefilled information, ready to be modified

## Get started

1. Install dependencies:

   ```bash
   npm install
   ```
2. Create prebuild/s: NOTE: if Android Studio tells you about an **env
   variable** that could affect emulator performance, unset it or delete it (as
   said in the message of Android Studio) before attempting to make a prebuild.

   If you encounter a problem (like me on GNU/Linux) "System limit for number of
   file watchers reached", you will have to modify this number by doing the
   following:
   ```sh
   sudo sysctl fs.inotify.max_user_watches=524288 # increase the max number temporarely, not a permanent solution
   ```

   ```sh
   # Android
   npx expo prebuild -p android --clean
   # IOS (only on Mac)
   npx expo prebuild -p ios --clean
   ```

3. Start the app:

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app
  development with Expo

You can start developing by editing the files inside the **app** directory. This
project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Learn more

To learn more about developing your project with Expo, look at the following
resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into
  advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a
  step-by-step tutorial where you'll create a project that runs on Android, iOS,
  and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform
  and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask
  questions.
