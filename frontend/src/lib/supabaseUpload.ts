/**
 * Supabase Storage Upload Utilities
 * 
 * Frontend → Backend → Supabase Storage
 * 
 * This file handles uploads by sending files to the backend API,
 * which then uploads them to Supabase Storage.
 * 
 * The backend keeps Supabase credentials secure and handles validation.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface UploadProgress {
    percent: number;
    bytesUploaded: number;
    totalBytes: number;
}

interface UploadResult {
    success: boolean;
    url?: string;
    filename?: string;
    message?: string;
    error?: string;
}

/**
 * Upload file to Supabase Storage via backend API
 * 
 * @param file - File to upload
 * @param onProgress - Optional progress callback
 * @returns Promise with upload result containing the public URL
 */
export async function uploadToSupabase(
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
    try {
        // Validate file type
        if (!file.name.toLowerCase().endsWith('.mp3')) {
            return {
                success: false,
                error: 'Only MP3 files are allowed'
            };
        }

        // Validate file size (max 50MB)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            return {
                success: false,
                error: `File too large. Maximum size is 50MB. Your file: ${(file.size / 1024 / 1024).toFixed(2)}MB`
            };
        }

        // Create form data
        const formData = new FormData();
        formData.append('file', file);

        // Create XMLHttpRequest for progress tracking
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && onProgress) {
                    onProgress({
                        percent: (e.loaded / e.total) * 100,
                        bytesUploaded: e.loaded,
                        totalBytes: e.total
                    });
                }
            });

            // Handle completion
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve({
                            success: true,
                            url: response.url,
                            filename: response.filename,
                            message: response.message
                        });
                    } catch (e) {
                        resolve({
                            success: false,
                            error: 'Invalid response from server'
                        });
                    }
                } else {
                    try {
                        const error = JSON.parse(xhr.responseText);
                        resolve({
                            success: false,
                            error: error.detail || `Upload failed with status ${xhr.status}`
                        });
                    } catch (e) {
                        resolve({
                            success: false,
                            error: `Upload failed with status ${xhr.status}`
                        });
                    }
                }
            });

            // Handle errors
            xhr.addEventListener('error', () => {
                resolve({
                    success: false,
                    error: 'Network error occurred during upload'
                });
            });

            xhr.addEventListener('abort', () => {
                resolve({
                    success: false,
                    error: 'Upload was cancelled'
                });
            });

            // Send request
            xhr.open('POST', `${API_BASE_URL}/upload-audio`);
            xhr.send(formData);
        });

    } catch (error) {
        console.error('Upload error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Delete file from Supabase Storage via backend API
 * 
 * @param filename - Name of the file to delete
 * @returns Promise with deletion result
 */
export async function deleteFromSupabase(filename: string): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/upload/${filename}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            return {
                success: false,
                error: error.detail || 'Delete failed'
            };
        }

        return { success: true };

    } catch (error) {
        console.error('Delete error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * List all uploaded files from Supabase Storage
 * 
 * @returns Promise with list of files
 */
export async function listSupabaseFiles(): Promise<{
    success: boolean;
    files?: Array<{ name: string; url: string; size: number; created_at?: string }>;
    error?: string;
}> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/upload/files`);

        if (!response.ok) {
            const error = await response.json();
            return {
                success: false,
                error: error.detail || 'Failed to list files'
            };
        }

        const data = await response.json();
        return {
            success: true,
            files: data.files
        };

    } catch (error) {
        console.error('List files error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}
