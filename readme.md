# Create APK for quick sharing off app

1) Go to the root of the project in the terminal and run the below command
```
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

2) 
```
cd android
```
3)
```
./gradlew assembleDebug
```
4) Done, now APK can be found in
```
/android/app/build/outputs/apk/debug/app-debug.apk
```