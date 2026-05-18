export const getImageUrl = (urlOrBase64: string | undefined): string | undefined => {
  if (!urlOrBase64) return undefined;
  
  // If it's already a full URL or a base64 string, return it as is
  if (urlOrBase64.startsWith('http') || urlOrBase64.startsWith('data:')) {
    return urlOrBase64;
  }
  
  // If it's a relative API path from the backend, prepend the backend host
  // Assuming the backend is running on http://localhost:8082
  // And the path is like /api/events/1/image
  if (urlOrBase64.startsWith('/api')) {
    return `http://localhost:8082${urlOrBase64}`;
  }
  
  return urlOrBase64;
};
