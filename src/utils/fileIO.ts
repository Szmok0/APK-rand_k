// Eksport / import danych — sekcja 15 MD. Jeden, spójny format pliku JSON,
// używany też przy automatycznej archiwizacji (sekcja 10).

import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import type { ExportFile } from '@/types/models';

export async function shareExportFile(file: ExportFile, filenameHint: string) {
  const target = new File(Paths.cache as Directory, `${filenameHint}.json`);
  if (target.exists) target.delete();
  target.create();
  target.write(JSON.stringify(file, null, 2));
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
