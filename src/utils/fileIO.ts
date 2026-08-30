// Eksport / import danych — sekcja 15 MD. Jeden, spójny format pliku JSON,
// używany też przy automatycznej archiwizacji (sekcja 10).

import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';
import * as Sharing from 'expo-sharing';

import type { ExportFile } from '@/types/models';

export async function shareExportFile(file: ExportFile, filenameHint: string) {
  const json = JSON.stringify(file, null, 2);

  // expo-file-system's File/Paths and expo-sharing are native-only — on web
  // (the desktop preview, used e.g. to type up activities faster on a
  // keyboard before a build) they either no-op or throw, so Export silently
  // did nothing there. A plain Blob + temporary <a download> is the actual
  // way to trigger a browser file download, no native API involved.
  if (Platform.OS === 'web') {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filenameHint}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return url;
  }

  const target = new File(Paths.cache as Directory, `${filenameHint}.json`);
  if (target.exists) target.delete();
  target.create();
  target.write(json);
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(target.uri, { mimeType: 'application/json', dialogTitle: 'Eksportuj dane' });
  }
  return target.uri;
}

export async function pickImportFile(): Promise<ExportFile | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  });
  if (result.canceled || !result.assets?.[0]) return null;
  const file = new File(result.assets[0].uri);
  const content = await file.text();
  const parsed = JSON.parse(content);
  if (parsed?.schema !== 'zuz-diary/relationship') {
    throw new Error('Nieprawidłowy format pliku');
  }
  return parsed as ExportFile;
}
