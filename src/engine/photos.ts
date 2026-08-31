// Multi-photo support (Activity.photoUris) — product owner feedback after
// the gift build shipped: one photo per day (the original approved
// ADD_ACTIVITY_TECH_SPEC "single photo attachment area") was too limiting.
// Capped rather than unlimited so the thumbnail row in Add Activity and the
// carousel dots in Day Detail stay legible on a real phone width.
export const MAX_PHOTOS_PER_ACTIVITY = 5;
