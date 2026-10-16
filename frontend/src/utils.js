// MongoDB ids are 24 characters long; show the last 6 in the UI (the full id is still used for API calls)
export const shortId = (id) => String(id ?? '').slice(-6);
