// Photos picked via expo-image-picker land in the OS's app-scoped CACHE
// directory (see expo-image-picker's own Android native code —
// ImagePickerModule.kt / MediaHandler.kt both write through
// `appContext.cacheDirectory`). Paths.cache is explicitly documented as "a
// place to store files that can be deleted by the system when the device
// runs low on storage" — a real risk for a gift build nobody will re-add
// photos to after handoff, not a theoretical one. This copies each picked
// photo into the permanent document directory ("safe from being deleted by
// the system") right after picking; only that persistent copy's URI ever
// gets stored on the Activity.

import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

function randomFileName(extension: string): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}${extension || '.jpg'}`;
}

export async function persistPickedPhoto(sourceUri: string): Promise<string> {
  // Web's picker already returns a blob: URL with nothing further to copy
  // into — expo-file-system's File/Paths are native-only there anyway (same
  // web branch as shareExportFile in src/utils/fileIO.ts).
  if (Platform.OS === 'web') return sourceUri;

  const photosDir = new Directory(Paths.document, 'photos');
  if (!photosDir.exists) photosDir.create({ intermediates: true });

  const sourceFile = new File(sourceUri);
  const destFile = new File(photosDir, randomFileName(sourceFile.extension));
  await sourceFile.copy(destFile);
  return destFile.uri;
}
