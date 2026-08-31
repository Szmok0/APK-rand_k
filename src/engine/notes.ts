// Shared note-length cap — was 1000, defined separately (and identically)
// in both app/add-activity.tsx and app/note/[date].tsx, a real risk of the
// two drifting apart. Bumped to 5000 after real-usage feedback ("more text
// in notes"). One place now; both screens import this instead of their own
// local constant.
export const NOTE_MAX_LENGTH = 5000;
