export const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const getAssetPath = (path: string) => {
    // If path is external (http/https), return as is
    if (path.startsWith('http')) return path;
    // Ensure path starts with / if prefix exists
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${prefix}${normalizedPath}`;
};
