import { supabase } from '@/services/supabase';

export async function pickDocument() {
  try {
    return null;
  } catch (error) {
    console.error('Error picking document:', error);
    return null;
  }
}

export async function uploadFile(uri: string, fileName: string, bucket: string = 'stories') {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileExt = fileName.split('.').pop();
    const filePath = `${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from(bucket).upload(filePath, blob);

    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}

export function generateThumbnail(videoUrl: string): string {
  return `${videoUrl}?t=1`;
}

export async function exportStoryAsJSON(story: any): Promise<string> {
  const json = JSON.stringify(story, null, 2);
  return json;
}

export async function exportStoryAsCSV(stories: any[]): Promise<string> {
  let csv = 'ID,Title,Category,Status,Viral Score,Created At\n';

  stories.forEach(story => {
    csv += `"${story.id}","${story.title}","${story.category}","${story.status}","${story.viralScore}","${story.createdAt}"\n`;
  });

  return csv;
}
